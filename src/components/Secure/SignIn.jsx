import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import SEO, { seoConfig } from "../../utils/SEO";
import { ShieldAlert, ArrowRight, RefreshCw } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/our-fam";

  const [step, setStep] = useState(1); // 1 = Phone Number, 2 = OTP Code
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);

  // Resend OTP Countdown
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const startTimer = (seconds = 30) => {
    setTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Setup Firebase RecaptchaVerifier
  const setupRecaptchaVerifier = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn("Error clearing previous recaptcha verifier:", e);
      }
      window.recaptchaVerifier = null;
    }

    const container = document.getElementById("recaptcha-container");
    if (!container) {
      console.error("recaptcha-container element missing from DOM");
      return null;
    }
    container.innerHTML = "";

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      container,
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          toast.error("reCAPTCHA expired. Please request OTP again.");
        },
      }
    );

    return window.recaptchaVerifier;
  };

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const formatFullPhone = (numStr) => {
    const cleaned = numStr.replace(/\D/g, "");
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 12 && cleaned.startsWith("91")) return `+${cleaned}`;
    return `+91${cleaned}`;
  };

  // Step 1: Check phone existence & send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setPhoneError("");
    setPendingApproval(false);

    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const formattedPhone = formatFullPhone(cleaned);
    setLoading(true);

    try {
      // Backend Check: Does phone exist and is approved in DB?
      const checkRes = await api.post("/auth/check-phone", { phone: formattedPhone });
      const { exists, isApproved, hasPendingRequest, message } = checkRes.data || {};

      if (hasPendingRequest || (exists && !isApproved)) {
        setPendingApproval(true);
        toast.warning(message || "Your registration request is currently under review.");
        setLoading(false);
        return;
      }

      if (!exists) {
        setPhoneError("No account found with this phone number. Please Sign Up first.");
        toast.error("No account found with this phone number.");
        setLoading(false);
        return;
      }

      // Phone exists & is approved -> Trigger Firebase Phone OTP
      const appVerifier = setupRecaptchaVerifier();
      if (!appVerifier) {
        toast.error("reCAPTCHA initialization failed. Please refresh the page.");
        setLoading(false);
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);

      setStep(2);
      startTimer(30);
      toast.success(`OTP sent to ${formattedPhone}`);
    } catch (err) {
      console.error("Firebase send OTP error:", err);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }

      if (err.code === "auth/invalid-app-credential") {
        toast.error(
          "Firebase Phone Auth Error (invalid-app-credential): Please check Firebase Console -> 1) Enable Phone Provider, 2) Add domain to Authorized Domains, 3) Verify API Key restrictions."
        );
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many OTP requests. Please wait a few minutes before trying again.");
      } else if (err.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number format. Please check your mobile number.");
      } else {
        toast.error(err.message || "Failed to send OTP. Check your Firebase configuration.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP action: resets to Step 1 (phone number field) and clears reCAPTCHA instance to resolve reCAPTCHA already solved errors
  const handleResendOtp = () => {
    if (timer > 0) return;

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn("Error clearing recaptcha verifier:", e);
      }
      window.recaptchaVerifier = null;
    }

    setOtpCode("");
    setConfirmationResult(null);
    setStep(1);
    toast.info("Please verify your mobile number and click Send OTP Code.");
  };

  // Step 2: Verify OTP & Sign In Session
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    if (!confirmationResult) {
      toast.error("OTP session expired. Please request OTP again.");
      setStep(1);
      return;
    }

    setLoading(true);

    // 1. Verify OTP code with Firebase
    try {
      await confirmationResult.confirm(otpCode);
    } catch (firebaseErr) {
      console.error("Firebase OTP confirmation error:", firebaseErr);
      setLoading(false);
      if (firebaseErr.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP code. Please check the code and try again.");
      } else if (firebaseErr.code === "auth/code-expired") {
        toast.error("OTP code has expired. Please click Resend OTP.");
      } else {
        toast.error(firebaseErr.message || "Failed to verify OTP code.");
      }
      return;
    }

    // 2. Obtain session token from Backend
    try {
      const formattedPhone = formatFullPhone(phoneNumber);
      const res = await api.post("/auth/otp-signin", { phone: formattedPhone });

      if (res.data?.success) {
        toast.success("Signed in successfully!");
        navigate(from, { replace: true });
        window.location.reload();
      } else {
        toast.error(res.data?.message || "Session authentication failed");
      }
    } catch (apiErr) {
      console.error("Backend signin error:", apiErr);
      toast.error(apiErr.response?.data?.message || apiErr.message || "Failed to complete sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12 font-space-grotesk">
      <SEO {...seoConfig.signin} />
      {loading && <LoaderOverlay />}

      {/* Invisible Recaptcha Container for Firebase */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-transparent border border-white/10 rounded-none shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sign In
          </h1>
          <p className="text-xs text-white/50">
            For DAAN KGPians
          </p>
        </div>

        {/* STEP 1: Phone Input Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                10-Digit Mobile Number *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-red-400 font-mono select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ""));
                    setPhoneError("");
                    setPendingApproval(false);
                  }}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 text-sm font-mono bg-transparent border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Error & Warning Banners */}
            {phoneError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs space-y-2">
                <p className="flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  {phoneError}
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 text-xs text-white underline font-bold hover:text-red-300"
                >
                  Go to Sign Up Page <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {pendingApproval && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Registration Pending Approval
                </p>
                <p className="text-white/70">
                  Your signup request has been received and is currently under review by Admin.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || phoneNumber.length !== 10}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40"
            >
              Send OTP Code
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/70 flex justify-between items-center">
              <span>OTP sent to <strong className="text-white font-mono">{formatFullPhone(phoneNumber)}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                }}
                className="text-red-400 hover:underline font-bold text-[11px]"
              >
                Change Number
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-4 py-3 text-center text-lg font-mono tracking-[0.3em] bg-transparent border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || loading}
                className="text-white/70 hover:text-white font-bold flex items-center gap-1.5 disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${timer > 0 ? "animate-spin" : ""}`} />
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40"
            >
              Verify OTP & Sign In
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-white/50 space-y-2">
          <p>
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-red-400 hover:underline font-bold">
              Sign Up Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
