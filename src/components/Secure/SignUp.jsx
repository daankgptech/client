import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { api } from "../../utils/Secure/api";
import { isValidEmail, passwordRules } from "../../utils/Secure/validators";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { PasswordHelper } from "./PasswordHelper";
import SEO, { seoConfig } from "../../utils/SEO";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hallOptions = [
    "ABV",
    "Azad",
    "BRH",
    "Gokhale",
    "HJB",
    "JCB",
    "LBS",
    "LLR",
    "MMM",
    "MS",
    "MT",
    "Nehru",
    "Patel",
    "RK",
    "RP",
    "SN/IG",
    "SNVH",
    "VS",
  ];
  const coeOptions = [
    "Dakshana Valley",
    "JNV Bengaluru Rural",
    "JNV Bengaluru Urban",
    "JNV Bundi",
    "JNV Kottayam",
    "JNV Lucknow",
    "JNV Rangareddi",
  ];
  const branches = [
    "AE",
    "AG",
    "AI",
    "BT",
    "CE",
    "CH",
    "CI",
    "CS",
    "CY",
    "EC",
    "EE",
    "EX",
    "HS",
    "IE",
    "IM",
    "MA",
    "ME",
    "MF",
    "MI",
    "NA",
    "MT",
    "GG",
  ];
  const batches = [2021, 2022, 2023, 2024, 2025];
  const courses = ["4-year", "5-year"];
  const graduatedOptions = ["Yes", "No"];
  const genders = ["Male", "Female", "Other"];

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    gender: "",
    batch: "",
    hall: "",
    branch: "",
    imgLink: "",
    cgpa: "",
    sgpa: "",
    bio: "",
    coe: "",
    graduated: "",
    course: "",
    phone: "",
    github: "",
    linkedIn: "",
    soc: "",
    involvementsHall: "",
    council: "",
    iit: "",
    extra: "",
    q1: "",
    a1: "",
    q2: "",
    a2: "",
  });

  const rules = passwordRules(form.password);

  const submit = async () => {
    if (!isValidEmail(form.username)) {
      toast.error("Invalid email format");
      return;
    }
    if (!Object.values(rules).every(Boolean)) {
      toast.error("Weak password");
      return;
    }
    setLoading(true);
    try {
      await api.post("/signup", {
        username: form.username,
        password: form.password,
        name: form.name,
        gender: form.gender,
        batch: form.batch,
        hall: form.hall,
        branch: form.branch,
        imgLink: form.imgLink,
        cgpa: form.cgpa,
        sgpa: form.sgpa,
        bio: form.bio,
        coe: form.coe,
        graduated: form.graduated === "Yes",
        course: form.course,
        contacts: [
          {
            phone: form.phone,
            email: form.username,
            github: form.github,
            linkedIn: form.linkedIn,
          },
        ],
        involvements: [
          {
            soc: form.soc,
            involvementsHall: form.involvementsHall,
            council: form.council,
            iit: form.iit,
            extra: form.extra,
          },
        ],
        sec_q1: form.q1,
        sec_a1: form.a1,
        sec_q2: form.q2,
        sec_a2: form.a2,
      });
      toast.success("Signed up successfully");
      navigate("/signin");
    } catch (e) {
      toast.error(e.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <SEO {...seoConfig.signup} />
      {loading && <LoaderOverlay />}
      <div
        className="
          group relative overflow-hidden
          rounded-3xl
          bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
          dark:from-slate-900 dark:via-slate-800 dark:to-gray-900
          border border-rose-50 dark:border-slate-700/50
          p-8
          shadow-xl
          w-full max-w-2xl
          transition-all duration-500
          hover:border-rose-400/40 dark:hover:border-rose-500/50
          hover:shadow-lg hover:shadow-rose-900/20
        "
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100/10 via-transparent to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 relative z-10">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10">
          Fill in your details to get started
        </p>

        {/* BASIC */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          <input
            className={input}
            placeholder="Full name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className={input}
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.batch}
            onChange={(e) => setForm({ ...form, batch: e.target.value })}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.hall}
            onChange={(e) => setForm({ ...form, hall: e.target.value })}
          >
            <option value="">Select Hall</option>
            {hallOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.coe}
            onChange={(e) => setForm({ ...form, coe: e.target.value })}
          >
            <option value="">Select COE</option>
            {coeOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={input}
            value={form.graduated}
            onChange={(e) => setForm({ ...form, graduated: e.target.value })}
          >
            <option value="">Graduated?</option>
            {graduatedOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input
            className={input + " md:col-span-2"}
            placeholder="Image URL"
            onChange={(e) => setForm({ ...form, imgLink: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10 my-4">
          <input
            className={input}
            placeholder="Email"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          {/* Password wrapper */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={input + " pr-10"}
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </span>
          </div>
        </div>

        <PasswordHelper password={form.password} />

        {/* ACADEMICS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10 mt-4">
          <input
            className={input}
            placeholder="CGPA (optional)"
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
          />
          <input
            className={input}
            placeholder="SGPA (optional)"
            onChange={(e) => setForm({ ...form, sgpa: e.target.value })}
          />
          <textarea
            className={input}
            placeholder="Bio (optional)"
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* CONTACTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10 my-4">
          <input
            className={input}
            placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className={input}
            placeholder="GitHub (optional)"
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
          <input
            className={input}
            placeholder="LinkedIn (optional)"
            onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
          />
        </div>

        {/* INVOLVEMENTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
          <input
            className={input}
            placeholder="Society (optional)"
            onChange={(e) => setForm({ ...form, soc: e.target.value })}
          />
          <input
            className={input}
            placeholder="Hall involvement (optional)"
            onChange={(e) =>
              setForm({ ...form, involvementsHall: e.target.value })
            }
          />
          <input
            className={input}
            placeholder="Council (optional)"
            onChange={(e) => setForm({ ...form, council: e.target.value })}
          />
          <input
            className={input}
            placeholder="IIT involvement (optional)"
            onChange={(e) => setForm({ ...form, iit: e.target.value })}
          />
          <input
            className={input}
            placeholder="Extra (optional)"
            onChange={(e) => setForm({ ...form, extra: e.target.value })}
          />
        </div>

        {/* SECURITY QUESTIONS */}
        <div className=" my-4 grid grid-cols-2 gap-4 relative z-10">
          <input
            className={input}
            placeholder="Security question 1 (optional)"
            onChange={(e) => setForm({ ...form, q1: e.target.value })}
          />
          <input
            className={input}
            placeholder="Answer 1"
            onChange={(e) => setForm({ ...form, a1: e.target.value })}
          />
          <input
            className={input}
            placeholder="Security question 2 (optional)"
            onChange={(e) => setForm({ ...form, q2: e.target.value })}
          />
          <input
            className={input}
            placeholder="Answer 2"
            onChange={(e) => setForm({ ...form, a2: e.target.value })}
          />
        </div>
<div className="flex w-full justify-center items-center">
        <button
          onClick={submit}
          className="align-middle text-center rounded-3xl bg-rose-600 py-3 px-6 text-white font-medium hover:bg-rose-500 active:scale-[0.98] transition-all duration-300 hover:scale-95 relative z-10"
        >
          Sign Up
        </button>
</div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-rose-600 dark:text-rose-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
