import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import SEO from "../../utils/SEO";
import {
  User,
  Upload,
  ArrowRight,
  Loader2,
  MapPin,
  Share2,
  Info,
} from "lucide-react";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COURSE_OPTIONS = [
  "B.Tech",
  "Dual Degree",
  "B.S.",
  "M.Tech",
  "M.Sc",
  "Ph.D",
  "MBA",
  "B.Arch",
  "M.S.",
];
const BRANCH_OPTIONS = [
  "AE", "AG", "AR", "BT", "CE", "CH", "CS", "CY", "EC", "EE",
  "EX", "GG", "HS", "IE", "IM", "MA", "ME", "MF", "MI", "MT",
  "NA", "PH", "QE", "TS",
];
const HALL_OPTIONS = [
  "LBS", "Azad", "BCR", "BRH", "HJB", "JBR", "MMM",
  "Patel", "RK", "RP", "VS", "SN / IG", "MT", "GKH",
  "SNVH", "RLB", "SAM",
];
const COE_OPTIONS = ["Dakshana Valley", "JNV Bangalore Urban", "JNV Lucknow", "JNV Bundi", "Other"];
const BATCH_OPTIONS = Array.from({ length: 14 }, (_, i) => (2016 + i).toString());
const SEMESTER_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = Phone OTP, 3 = Submitted
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Form State with specified defaults
  const [form, setForm] = useState({
    name: "",
    username: "", // Email
    phone: "",
    gender: "",
    batch: "2026", // Default 2026 batch
    hall: "LBS", // Default LBS hall
    branch: "",
    course: "B.Tech",
    semester: 1, // Default Semester 1
    graduated: false,
    cgpa: "",
    bio: "",
    coe: "",
    parentJNV: "",
    imgLink: "",
    // Contacts & Social
    email: "",
    github: "",
    linkedIn: "",
    // Involvements
    soc: "",
    involvementsHall: "",
    council: "",
    iit: "",
    extra: "",
    // Personal Info
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    bloodGroup: "",
  });

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

  // Cleanup on component unmount
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

  // Upload Profile Image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.url) {
        setForm((prev) => ({ ...prev, imgLink: res.data.url }));
        toast.success("Profile photo uploaded!");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Step 1 -> Step 2: Validate all required fields, pre-check phone & email, send Firebase OTP
  const handleProceedToOtp = async (e) => {
    e?.preventDefault();

    // 1. Mandatory Field Validation
    if (!form.name.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!form.username.trim()) {
      toast.error("Email Address is required.");
      return;
    }
    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile phone number.");
      return;
    }
    if (!form.imgLink) {
      toast.error("Profile photo is required. Please upload your photo.");
      return;
    }
    if (!form.dob) {
      toast.error("Date of Birth is required.");
      return;
    }
    if (!form.emergencyContact.trim()) {
      toast.error("Emergency Contact Number is required.");
      return;
    }
    if (!form.address.trim()) {
      toast.error("Address is required.");
      return;
    }
    if (!form.city.trim()) {
      toast.error("City is required.");
      return;
    }
    if (!form.state.trim()) {
      toast.error("State is required.");
      return;
    }
    if (!form.pincode.trim()) {
      toast.error("Pincode is required.");
      return;
    }

    const formattedPhone = formatFullPhone(cleanedPhone);
    setLoading(true);

    try {
      // Check if phone or email/username already exists in DB
      const checkRes = await api.post("/auth/check-phone", {
        phone: formattedPhone,
        username: form.username.trim(),
      });

      if (checkRes.data?.exists || checkRes.data?.hasPendingRequest) {
        toast.error(
          checkRes.data?.hasPendingRequest
            ? "A registration request with this phone number or email is already under review."
            : "An account with this phone number or email already exists."
        );
        setLoading(false);
        return;
      }

      // Trigger Firebase Phone OTP
      const appVerifier = setupRecaptchaVerifier();
      if (!appVerifier) {
        toast.error("reCAPTCHA initialization failed. Please refresh the page.");
        setLoading(false);
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);

      setStep(2);
      toast.success(`OTP sent to ${formattedPhone}`);
    } catch (err) {
      console.error("OTP send error:", err);
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
        toast.error(err.message || "Failed to send OTP. Check Firebase configuration.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> Step 3: Verify OTP & Submit Pending Registration Request
  const handleVerifyAndSubmit = async (e) => {
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

    // 1. Verify OTP with Firebase
    try {
      await confirmationResult.confirm(otpCode);
    } catch (firebaseErr) {
      console.error("Firebase OTP verification error:", firebaseErr);
      setLoading(false);
      if (firebaseErr.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP code. Please check and try again.");
      } else if (firebaseErr.code === "auth/code-expired") {
        toast.error("OTP code has expired. Please request OTP again.");
      } else {
        toast.error(firebaseErr.message || "Failed to verify OTP code.");
      }
      return;
    }

    // 2. Submit Signup Request to Backend
    try {
      const formattedPhone = formatFullPhone(form.phone);

      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        phone: formattedPhone,
        gender: form.gender,
        batch: form.batch,
        hall: form.hall,
        branch: form.branch,
        course: form.course,
        semester: Number(form.semester) || 1,
        graduated: form.graduated,
        cgpa: form.cgpa,
        bio: form.bio,
        coe: form.coe,
        parentJNV: form.parentJNV,
        imgLink: form.imgLink,
        contacts: [
          {
            phone: formattedPhone,
            email: form.username.trim(),
            github: form.github ? form.github.trim() : "",
            linkedIn: form.linkedIn ? form.linkedIn.trim() : "",
          },
        ],
        involvements: [
          {
            soc: form.soc ? form.soc.trim() : "",
            involvementsHall: form.involvementsHall,
            council: form.council,
            iit: form.iit,
            extra: form.extra,
          },
        ],
        personalInfo: {
          dob: form.dob ? new Date(form.dob).toISOString() : null,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          emergencyContact: form.emergencyContact.trim(),
          bloodGroup: form.bloodGroup,
        },
      };

      const signupRes = await api.post("/auth/otp-signup", payload);
      if (signupRes.data?.success) {
        setStep(3);
        toast.success("Registration request submitted for Admin approval!");
      }
    } catch (apiErr) {
      console.error("Signup submission error:", apiErr);
      toast.error(apiErr.response?.data?.message || apiErr.message || "Failed to submit signup request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12 font-space-grotesk">
      <SEO title="Sign Up | DAAN KGP" description="Register for DAAN KGP family account" />
      {loading && <LoaderOverlay />}

      <div id="recaptcha-container"></div>

      <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-transparent border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sign Up
          </h1>
          <p className="text-xs text-white/50">
            Fill all required fields (*). Optional fields are marked explicitly.
          </p>
        </div>

        {/* STEP 1: Full Profile Details & Photo Upload */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="space-y-6 text-xs">
            {/* Basic Info Header */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-white/10 pb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> 1. Primary Academic & Member Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">10-Digit Phone Number *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-red-400 font-mono">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="Only 10 digits"
                      className="w-full pl-12 pr-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-[#09090b]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Joining Year (Batch) *</label>
                  <select
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {BATCH_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-[#09090b]">
                        Batch {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Branch *</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {BRANCH_OPTIONS.map((br) => (
                      <option key={br} value={br} className="bg-[#09090b]">
                        {br}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Hall of Residence *</label>
                  <select
                    value={form.hall}
                    onChange={(e) => setForm({ ...form, hall: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {HALL_OPTIONS.map((h) => (
                      <option key={h} value={h} className="bg-[#09090b]">
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Course/Degree *</label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#09090b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Current Semester *</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  >
                    {SEMESTER_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#09090b]">
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Dakshana COE *</label>
                  <select
                    value={form.coe}
                    onChange={(e) => setForm({ ...form, coe: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {COE_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#09090b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">
                    Parent JNV School *
                  </label>
                  <input
                    type="text"
                    value={form.parentJNV}
                    onChange={(e) => setForm({ ...form, parentJNV: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-white/70 mb-1 font-bold">Profile Photo *</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer font-bold shrink-0">
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {form.imgLink ? (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.imgLink} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Profile photo attached</span>
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-red-400">Photo upload is required for verification.</p>
                )}
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-bold">
                  About yourself *
                </label>
                <textarea
                  rows="2"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
            </div>

            {/* Social & Involvements Optional Header */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-white/10 pb-2 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> 2. Social Profiles & Involvements (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-bold">
                    GitHub Link <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    placeholder="eg. https://github.com/username"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">
                    LinkedIn Link <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.linkedIn}
                    onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                    placeholder="eg. https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 mb-1 font-bold">
                    Societies & Campus Involvements <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.soc}
                    onChange={(e) => setForm({ ...form, soc: e.target.value })}
                    placeholder="e.g. Technology Robotix Society, E-Cell"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Personal & Emergency Info Header */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-white/10 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 3. Address, Personal & Emergency Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1 font-bold">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Blood Group *</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    {BLOOD_GROUP_OPTIONS.map((bg) => (
                      <option key={bg} value={bg} className="bg-[#09090b]">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Emergency Contact Number *</label>
                  <input
                    type="text"
                    required
                    value={form.emergencyContact}
                    onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Address *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House/Street address"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Type here..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-bold">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="6 digits"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Send OTP <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Phone OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndSubmit} className="space-y-5">
            <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/70 flex justify-between items-center">
              <span>Sending OTP to <strong className="text-white font-mono">{formatFullPhone(form.phone)}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                }}
                className="text-red-400 hover:underline font-bold text-[11px]"
              >
                Back to Details
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
                placeholder="Put here..."
                className="w-full px-4 py-3 text-center text-lg font-mono tracking-[0.3em] bg-transparent border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-red-500"
              />
              <p className="text-[11px] text-amber-300/80 flex items-center gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                Please check your spam or blocked messages folder if you haven't received the OTP.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40"
            >
              Verify OTP & Submit Request
            </button>
          </form>
        )}

        {/* STEP 3: Request Submitted Screen */}
        {step === 3 && (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Registration Request Submitted!
              </h2>
              <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{form.name}</strong>. Your member signup application has been created and sent to the DAAN KGP Team for verification.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/60 max-w-md mx-auto text-left space-y-1 font-mono">
              <p>Registered Phone: {formatFullPhone(form.phone)}</p>
              <p>Batch & Branch: Batch {form.batch} · {form.branch} (Semester {form.semester})</p>
              <p>Hall: {form.hall}</p>
              <p>Status: Pending Admin Review</p>
            </div>

            <div className="pt-4">
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all"
              >
                Go to Sign In Page <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        {step !== 3 && (
          <div className="pt-4 border-t border-white/10 text-center text-xs text-white/50">
            Already have an approved account?{" "}
            <Link to="/signup" onClick={() => navigate("/signin")} className="text-red-400 hover:underline font-bold">
              Sign In Here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
