import { useState } from "react";
import { api } from "../../utils/Secure/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import BlurLoader from "../../utils/LoaderOverlay";
import { PasswordHelper } from "./PasswordHelper";
import { Helmet } from "react-helmet";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step state: 'IDENTIFY' | 'CONFIRM_SMS' | 'VERIFY_OTP' | 'RESET_PASSWORD'
  const [step, setStep] = useState("IDENTIFY");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // STEP 1: Find user and retrieve the masked phone number
  const identifyUser = async () => {
    if (!username) return toast.error("Enter username or email");
    setLoading(true);
    try {
      const res = await api.post("/forgotpassword/identify", { username });
      // Backend returns "******7890", we display it with +91
      setMaskedPhone(res.data.phone);
      setStep("CONFIRM_SMS");
    } catch (err) {
      toast.error(err.response?.data?.msg || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Trigger the Twilio SMS
  const sendOTP = async () => {
    setLoading(true);
    const toastId = toast.loading("Requesting OTP...");
    try {
      await api.post("/forgotpassword/send-otp", { username });
      toast.success("SMS sent successfully!", { id: toastId });
      setStep("VERIFY_OTP");
    } catch (err) {
      toast.error("Failed to send SMS. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Verify the 6-digit code
  const verifyOTP = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit code");
    setLoading(true);
    try {
      await api.post("/forgotpassword/verify-otp", { username, otp });
      toast.success("Identity Verified");
      setStep("RESET_PASSWORD");
    } catch (err) {
      toast.error("Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Finalize Reset
  const resetPassword = async () => {
    setLoading(true);
    try {
      await api.post("/forgotpassword/reset", { username, newPassword, otp });
      toast.success("Password updated! Please remember it.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300";
  const btnClass =
    "w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium shadow-md shadow-rose-300/40 hover:scale-105 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <Helmet>
        <title>Reset Password | DAAN KGP</title>
      </Helmet>
      {loading && <BlurLoader />}

      <div className="group relative overflow-hidden w-full max-w-md rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 border border-rose-50 dark:border-slate-700/50 p-8 shadow-xl transition-all duration-500">
        <div className="relative z-10 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {step === "IDENTIFY" && "Reset Password"}
            {step === "CONFIRM_SMS" && "SMS Verification"}
            {step === "VERIFY_OTP" && "Check Your Phone"}
            {step === "RESET_PASSWORD" && "New Credentials"}
          </h2>
          <div className="text-sm text-gray-500 mt-2 flex flex-col items-center gap-1">
            {step === "CONFIRM_SMS" && (
              <>
                <span>Secure code will be sent to:</span>
                <span className="text-rose-500 font-mono font-bold text-lg bg-rose-500/10 px-3 py-1 rounded-lg">
                  +91 {maskedPhone}
                </span>
              </>
            )}
            {step === "VERIFY_OTP" && "Enter the 6-digit code we just sent."}
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {step === "IDENTIFY" && (
            <>
              <input
                className={inputClass}
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={identifyUser} className={btnClass}>
                Next
              </button>
            </>
          )}

          {step === "CONFIRM_SMS" && (
            <>
              <button onClick={sendOTP} className={btnClass}>
                Confirm & Send Code
              </button>
              <button
                onClick={() => setStep("IDENTIFY")}
                className="w-full text-center text-gray-400 text-sm hover:underline"
              >
                Change Username
              </button>
            </>
          )}

          {step === "VERIFY_OTP" && (
            <>
              <input
                className={`${inputClass} text-center tracking-[0.5em] text-2xl font-bold`}
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOTP} className={btnClass}>
                Verify Code
              </button>
              <button
                onClick={sendOTP}
                className="w-full text-center text-gray-400 text-sm hover:text-rose-500 transition-colors"
              >
                Resend SMS
              </button>
            </>
          )}

          {step === "RESET_PASSWORD" && (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass + " pr-12"}
                  placeholder="New strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </button>
              </div>
              <PasswordHelper password={newPassword} />
              <button onClick={resetPassword} className={btnClass}>
                Save New Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
