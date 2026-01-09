import { useEffect, useState } from "react";
import { api } from "../../utils/Secure/api";
import toast from "react-hot-toast";
import {
  FiCamera,
  FiEdit3,
  FiChevronDown,
  FiEdit2,
  FiSave,
  FiBookOpen,
  FiPhone,
  FiUsers,
  FiClock,
  FiInfo,
  FiLogOut,
} from "react-icons/fi";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { Link } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSgpaModal, setShowSgpaModal] = useState(false);
  const normalizeSgpa = (sgpa) => {
    if (!sgpa || typeof sgpa !== "object" || Array.isArray(sgpa)) return {};
    const clean = {};
    for (const [k, v] of Object.entries(sgpa)) {
      if (!isNaN(Number(k)) && typeof v === "string" && v.trim() !== "{") {
        clean[k] = v;
      }
    }
    return clean;
  };
  const cleanSgpa = Object.fromEntries(
    Object.entries(form?.sgpa || {}).filter(
      ([, v]) => v !== "" && v !== "{" && !isNaN(Number(v))
    )
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
        setForm({
          ...res.data,
          sgpa: normalizeSgpa(res.data.sgpa),
          contacts: res.data.contacts?.[0] || {},
          involvements: res.data.involvements?.[0] || {},
        });
      } catch {
        toast.error("Session expired");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoaderOverlay />;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Unable to load profile
      </div>
    );
  }

  const handleChange = (path, value) => {
    setForm((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let cur = copy;
      while (keys.length > 1) cur = cur[keys.shift()];
      cur[keys[0]] = value;
      return copy;
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      if (Object.keys(cleanSgpa).length > 0) {
        fd.append("sgpa", JSON.stringify(cleanSgpa));
      }
      fd.append("name", form.name || "");
      fd.append("gender", form.gender || "");
      fd.append("batch", form.batch || "");
      fd.append("branch", form.branch || "");
      fd.append("hall", form.hall || "");
      fd.append("course", form.course || "");
      fd.append("cgpa", form.cgpa || "");
      // fd.append("sgpa", JSON.stringify(form.sgpa || {}));
      fd.append("bio", form.bio || "");
      fd.append("contacts", JSON.stringify(form.contacts));
      fd.append("involvements", JSON.stringify(form.involvements));

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await api.put("/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    } finally {
      setSaving(false);
    }
  };
  const sem = user.batch ? (new Date().getFullYear() - user.batch) * 2 : null;
  const graduatingStatus = user.graduated ? "Graduated" : "Currently Enrolled";
  const semStatus = user.graduated ? "Graduated" : sem;
  const calculatedCgpa = (() => {
    const values = Object.values(form?.sgpa || {})
      .map(Number)
      .filter((v) => !isNaN(v));
    if (!values.length) return "";
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(2);
  })();
  return (
    <>
      <div className="container py-10 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={
              imagePreview ||
              user.imgLink ||
              "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
            }
            className="
        w-32 h-32
        rounded-3xl object-cover
        border-2 border-rose-400
        shadow-lg shadow-rose-200/40 dark:shadow-red-900/30
        transition
      "
            alt="profile"
          />

          {editing && (
            <label
              className="
          absolute -bottom-2 -right-2
          p-2 rounded-xl
          bg-rose-600 text-white
          cursor-pointer
          shadow-md
          hover:bg-rose-500
          transition
        "
            >
              <FiCamera size={16} />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          {editing ? (
            <input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="max-w-[60%] text-right bg-transparent border-b border-rose-400 focus:outline-none text-gray-900 dark:text-gray-100 "
            />
          ) : (
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {user.name || user.username}
            </h1>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            {user.bio || "—"}
          </p>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 container">
        <Card title="Academics" icon={FiBookOpen}>
          <Field
            editing={editing}
            label="Semester"
            value={form.sem || semStatus}
            type="select"
            options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            onChange={(v) => handleChange("sem", v)}
          />
          <Field
            editing={editing}
            label="Branch"
            value={form.branch}
            type="select"
            options={[
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
            ]}
            onChange={(v) => handleChange("branch", v)}
          />
          <Field
            editing={editing}
            label="CGPA"
            value={form.cgpa || calculatedCgpa}
            onChange={(v) => handleChange("cgpa", v)}
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2">
              <FiEdit3 className="opacity-40" />
              SGPA
            </span>
            {editing ? (
              <button
                onClick={() => setShowSgpaModal(true)}
                className="text-gray-800 dark:text-gray-200 border-b border-red-400 flex items-center justify-center"
              >
                Edit <FiChevronDown />
              </button>
            ) : (
              <span className=" ml-6 text-gray-800 dark:text-gray-200 truncate">
                {Object.values(form.sgpa || {}).join(", ") || "—"}
              </span>
            )}
          </div>
          <Field
            editing={editing}
            label="Course"
            value={form.course}
            type="select"
            options={["4-year", "5-year"]}
            onChange={(v) => handleChange("course", v)}
          />
        </Card>
        <Card title="More Info" icon={FiInfo}>
          <Field
            editing={editing}
            label="Hall"
            value={form.hall}
            type="select"
            options={[
              "ABV",
              "Azad",
              "HJB",
              "JCB",
              "LLR",
              "LBS",
              "MS",
              "MMM",
              "MT",
              "Nehru",
              "Patel",
              "RK",
              "RP",
              "SN/IG",
              "SNVH",
              "VS",
            ]}
            onChange={(v) => handleChange("hall", v)}
          />
          <Field
            editing={editing}
            label="COE"
            value={form.coe}
            type="select"
            options={[
              "Dakshana Valley",
              "JNV Bengaluru Rural",
              "JNV Bengaluru Urban",
              "JNV Bundi",
              "JNV Kottayam",
              "JNV Lucknow",
              "JNV Rangareddi",
            ]}
            onChange={(v) => handleChange("coe", v)}
          />
          <Field
            editing={editing}
            label="Graduating Status"
            value={graduatingStatus}
            type="select"
            options={["Graduated", "Currently Enrolled"]}
            onChange={(v) => handleChange("graduated", v)}
          />
          <Field
            editing={editing}
            label="Bio"
            value={form.bio}
            onChange={(v) => handleChange("bio", v)}
          />
        </Card>

        <Card title="Contacts" icon={FiPhone}>
          <Field
            editing={editing}
            label="Phone"
            value={form.contacts.phone}
            onChange={(v) => handleChange("contacts.phone", v)}
          />
          <Field
            editing={editing}
            label="Email"
            value={form.contacts.email}
            onChange={(v) => handleChange("contacts.email", v)}
          />
          <Field
            editing={editing}
            label="GitHub"
            value={form.contacts.github}
            onChange={(v) => handleChange("contacts.github", v)}
          />
          <Field
            editing={editing}
            label="LinkedIn"
            value={form.contacts.linkedIn}
            onChange={(v) => handleChange("contacts.linkedIn", v)}
          />
        </Card>

        <Card title="Involvements" icon={FiUsers}>
          <Field
            editing={editing}
            label="Society"
            value={form.involvements.soc}
            onChange={(v) => handleChange("involvements.soc", v)}
          />
          <Field
            editing={editing}
            label="Hall"
            value={form.involvements.involvementsHall}
            onChange={(v) => handleChange("involvements.involvementsHall", v)}
          />
          <Field
            editing={editing}
            label="Council"
            value={form.involvements.council}
            onChange={(v) => handleChange("involvements.council", v)}
          />
          <Field
            editing={editing}
            label="IIT"
            value={form.involvements.iit}
            onChange={(v) => handleChange("involvements.iit", v)}
          />
          <Field
            editing={editing}
            label="Extra"
            value={form.involvements.extra}
            onChange={(v) => handleChange("involvements.extra", v)}
          />
        </Card>

        <Card title="Account Activity" icon={FiClock}>
          <Info
            label="Account Created"
            value={formatDate(user.audit?.signUpAt)}
          />
          <Info
            label="Last Sign In"
            value={formatDate(user.audit?.lastSignInAt)}
          />
          {/* <Info
            label="Last Sign Out"
            value={formatDate(user.audit?.lastSignOutAt)}
          /> */}
        </Card>
      </div>
      {/* Action Buttons */}
      <div className="container flex flex-wrap items-center justify-center gap-5 mt-10">
        {/* Edit / Save */}
        <button
          onClick={editing ? saveProfile : () => setEditing(true)}
          disabled={saving}
          className="
      group flex items-center gap-2
      px-3 py-1 rounded-2xl
      bg-gradient-to-br from-rose-500 via-red-500 to-rose-600
      dark:from-rose-600 dark:via-red-600 dark:to-rose-700
      text-white text-sm font-semibold tracking-wide
      shadow-lg shadow-rose-400/40 dark:shadow-rose-900/40
      hover:shadow-xl hover:shadow-rose-500/50
      hover:scale-[1.06]
      active:scale-95
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
    "
        >
          <span className="transition-transform duration-300 group-hover:rotate-6">
            {editing ? <FiSave /> : <FiEdit2 />}
          </span>
          {saving ? "Saving..." : editing ? "Save" : "Edit"}
        </button>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="
      px-3 py-1 rounded-2xl
      bg-gradient-to-br from-gray-700 to-gray-800
      dark:from-gray-800 dark:to-gray-700
      text-gray-100 text-sm font-medium
      shadow-md shadow-gray-400/20 dark:shadow-black/30
      hover:from-gray-600 hover:to-gray-700
      hover:scale-[1.05]
      active:scale-95
      transition-all duration-300 ease-out flex gap-1 justify-center items-center
    "
        >
          <RxDashboard /> Dashboard
        </Link>

        {/* Reset Password */}
        <Link
          to="/forgot-password"
          className="
      px-3 py-1 rounded-2xl
      bg-gradient-to-br from-gray-600 to-gray-700
      dark:from-gray-700 dark:to-gray-600
      text-gray-100 text-sm font-medium
      shadow-md shadow-gray-400/20 dark:shadow-black/30
      hover:from-gray-500 hover:to-gray-600
      hover:scale-[1.05]
      active:scale-95
      transition-all duration-300 ease-out flex justify-center items-center gap-1
    "
        >
          <MdLockReset /> Reset Password
        </Link>

        {/* Sign Out */}
        <Link
          to="/signout"
          className="
      px-3 py-1 rounded-2xl
      bg-gradient-to-br from-rose-600 to-red-700
      dark:from-rose-700 dark:to-red-800
      text-white text-sm font-semibold
      shadow-lg shadow-rose-400/40 dark:shadow-rose-900/40
      hover:from-rose-500 hover:to-red-600
      hover:scale-[1.06]
      active:scale-95
      transition-all duration-300 ease-out flex gap-1 justify-center items-center
    "
        >
          Sign Out <FiLogOut />
        </Link>
      </div>

      {/* SGPA-Model */}
      {showSgpaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowSgpaModal(false)}
          />

          {/* modal */}
          <div
            className="
        relative z-10
        w-[92%] max-w-md
        rounded-3xl
        bg-gradient-to-br from-white via-gray-50 to-gray-100
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        border border-gray-200/60 dark:border-gray-700
        shadow-2xl shadow-rose-500/20 dark:shadow-black/40
        p-6
        animate-scaleIn
      "
          >
            {/* header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Semester-wise SGPA
              </h2>

              <button
                onClick={() => setShowSgpaModal(false)}
                className="
            text-gray-400 hover:text-rose-500
            transition
          "
              >
                ✕
              </button>
            </div>

            {/* content */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {Array.from({ length: sem || 0 }, (_, i) => {
                const s = i + 1;
                return (
                  <div
                    key={s}
                    className="
                flex items-center justify-between
                rounded-xl px-3 py-2
                bg-white/70 dark:bg-gray-800/70
                hover:bg-rose-50 dark:hover:bg-gray-700
                transition
              "
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Semester {s}
                    </span>

                    <input
                      value={form.sgpa?.[s] || ""}
                      onChange={(e) =>
                        setForm((prev) => {
                          const value = e.target.value;
                          const next = { ...prev.sgpa };

                          if (value === "") {
                            delete next[s];
                          } else {
                            next[s] = value;
                          }

                          return { ...prev, sgpa: next };
                        })
                      }
                      inputMode="decimal"
                      placeholder="—"
                      className="
                  w-20 text-right
                  bg-transparent
                  border-b border-gray-300 dark:border-gray-600
                  focus:border-rose-500
                  text-gray-900 dark:text-gray-100
                  focus:outline-none
                  transition
                "
                    />
                  </div>
                );
              })}
            </div>

            {/* actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSgpaModal(false)}
                className="
            px-4 py-1.5 text-sm rounded-xl
            text-gray-600 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-700
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={() => setShowSgpaModal(false)}
                className="
            px-5 py-1.5 text-sm rounded-xl
            bg-gradient-to-br from-rose-500 to-red-600
            text-white font-medium
            shadow-md shadow-rose-400/40
            hover:shadow-lg hover:shadow-rose-500/50
            hover:scale-[1.04]
            active:scale-95
            transition-all
          "
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- UI Helpers ---------- */

const Card = ({ title, icon: Icon, children }) => (
  <div
    className="
      group relative overflow-hidden
      rounded-3xl p-6
      bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      border border-gray-300/60 dark:border-gray-700
      transition-all duration-500
      hover:-translate-y-1
      hover:shadow-xl hover:shadow-rose-900/20
    "
  >
    <div
      className="
        pointer-events-none absolute inset-0
        bg-gradient-to-br from-rose-200/10 via-transparent to-rose-500/10
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "
    />

    <div className="relative z-10 flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
          <Icon size={18} />
        </div>
        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-600 dark:text-rose-400">
          {title}
        </h2>
      </div>
      <FiChevronDown className="text-gray-400 group-hover:text-rose-500 transition" />
    </div>

    <div className="relative z-10 space-y-3">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
  editing,
  onChange,
  type = "text",
  options = [],
}) => (
  <div className="flex justify-between items-center gap-4 text-sm group">
    <span className="text-gray-500 flex items-center gap-2">
      <FiEdit3 className="opacity-40 group-hover:opacity-80 transition" />
      {label}
    </span>

    {editing ? (
      type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="
            max-w-[60%] text-right
            bg-transparent border-b border-rose-400
            focus:outline-none text-gray-900 dark:text-gray-100
            cursor-pointer
          "
        >
          <option value="" className="dark:bg-gray-900">
            Select...
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="dark:bg-gray-900">
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="
            max-w-[60%] text-right
            bg-transparent border-b border-rose-400
            focus:outline-none text-gray-900 dark:text-gray-100
          "
        />
      )
    ) : (
      <span className="truncate max-w-[60%] text-gray-800 dark:text-gray-200 font-medium">
        {value || "—"}
      </span>
    )}
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between text-xs uppercase tracking-wide">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-700 dark:text-gray-300">{value || "—"}</span>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
