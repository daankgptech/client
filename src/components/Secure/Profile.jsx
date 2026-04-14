import { useEffect, useState } from "react";
import { api } from "../../utils/Secure/api";
import { toast } from "sonner";
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
  FiUser,
} from "react-icons/fi";
import PersonalInfo from "./PersonalInfo";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { Link } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import SEO, { seoConfig } from "../../utils/SEO";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSgpaModal, setShowSgpaModal] = useState(false);
  const [selectModal, setSelectModal] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

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
      ([, v]) => v !== "" && v !== "{" && !isNaN(Number(v)),
    ),
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
          personalInfo: res.data.personalInfo || {},
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

  const toggleCard = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
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
      fd.append("parentJNV", form.parentJNV || "");
      fd.append("contacts", JSON.stringify(form.contacts));
      fd.append("involvements", JSON.stringify(form.involvements));
      fd.append("personalInfo", JSON.stringify(form.personalInfo));

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
      <SEO {...seoConfig.profile} />
      <div className="container py-10 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={
              imagePreview ||
              user.imgLink ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User",
              )}&background=fee2e2&color=991b1b`
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
        <Card
          title="Academics"
          icon={FiBookOpen}
          isExpanded={expandedCards["academics"]}
          onToggle={() => toggleCard("academics")}
        >
          <Field
            editing={editing}
            label="Semester"
            value={form.sem || semStatus}
            type="select"
            openSelect={() =>
              setSelectModal({
                title: "Select Semester",
                options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                value: form.sem,
                onSelect: (v) => handleChange("sem", v),
              })
            }
          />
          <Field
            editing={editing}
            label="Branch"
            value={form.branch}
            type="select"
            openSelect={() =>
              setSelectModal({
                title: "Select Branch",
                options: [
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
                ],
                value: form.branch,
                onSelect: (v) => handleChange("branch", v),
              })
            }
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
              SGPA(s)
            </span>
            {editing ? (
              <button
                onClick={() => setShowSgpaModal(true)}
                className="text-gray-800 dark:text-gray-200 border-b border-red-400 flex items-center justify-center"
              >
                Fill <FiChevronDown />
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
            openSelect={() =>
              setSelectModal({
                title: "Select Course",
                options: ["4-year", "5-year"],
                value: form.course,
                onSelect: (v) => handleChange("course", v),
              })
            }
          />
        </Card>
        
        <Card
          title="More Info"
          icon={FiInfo}
          isExpanded={expandedCards["moreInfo"]}
          onToggle={() => toggleCard("moreInfo")}
        >
          <Field
            editing={editing}
            label="Hall"
            value={form.hall}
            type="select"
            openSelect={() =>
              setSelectModal({
                title: "Select Hall",
                options: [
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
                ],
                value: form.hall,
                onSelect: (v) => handleChange("hall", v),
              })
            }
          />
          <Field
            editing={editing}
            label="COE"
            value={form.coe}
            type="select"
            openSelect={() =>
              setSelectModal({
                title: "Select COE",
                options: [
                  "Dakshana Valley",
                  "JNV Bengaluru Rural",
                  "JNV Bengaluru Urban",
                  "JNV Bundi",
                  "JNV Kottayam",
                  "JNV Lucknow",
                  "JNV Rangareddi",
                ],
                value: form.coe,
                onSelect: (v) => handleChange("coe", v),
              })
            }
          />
          <Field
            editing={editing}
            label="Parent JNV"
            value={form.parentJNV}
            onChange={(v) => handleChange("parentJNV", v)}
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

        <Card
          title="Contacts"
          icon={FiPhone}
          isExpanded={expandedCards["contacts"]}
          onToggle={() => toggleCard("contacts")}
        >
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

        <Card
          title="Involvements"
          icon={FiUsers}
          isExpanded={expandedCards["involvements"]}
          onToggle={() => toggleCard("involvements")}
        >
          <Field
            editing={editing}
            label="Society"
            value={form.involvements.soc}
            onChange={(v) => handleChange("involvements.soc", v)}
          />
          <Field
            editing={editing}
            label="Hall Involvement"
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

        <Card
          title="Personal Info"
          icon={FiUser}
          isExpanded={expandedCards["personalInfo"]}
          onToggle={() => toggleCard("personalInfo")}
        >
          <PersonalInfo
            data={form.personalInfo}
            editing={editing}
            onChange={(key, value) =>
              handleChange(`personalInfo.${key}`, value)
            }
          />
        </Card>

        <Card
          title="Account Activity"
          icon={FiClock}
          isExpanded={expandedCards["accountActivity"]}
          onToggle={() => toggleCard("accountActivity")}
        >
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
      <div className="flex flex-wrap justify-center gap-3 mt-8 pb-4">
        {/* Edit / Save */}
        <button
          onClick={editing ? saveProfile : () => setEditing(true)}
          disabled={saving}
          className="
      flex items-center gap-2
      px-3 py-1.5 rounded-md
      bg-rose-500 text-white
      text-[12px] font-medium
      transition-colors duration-150
      hover:bg-rose-600
      disabled:opacity-50
    "
        >
          {editing ? <FiSave size={14} /> : <FiEdit2 size={14} />}
          {saving ? "Saving..." : editing ? "Save" : "Edit"}
        </button>
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="
      flex items-center gap-2
      px-3 py-1.5 rounded-md
      bg-gray-100 dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      text-[12px] font-medium
      transition-colors duration-150
      hover:bg-gray-200 dark:hover:bg-gray-700
    "
        >
          <RxDashboard size={14} />
          Dashboard
        </Link>
        {/* Reset Password */}
        <Link
          to="/forgot-password"
          className="
      flex items-center gap-2
      px-3 py-1.5 rounded-md
      bg-gray-100 dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      text-[12px] font-medium
      transition-colors duration-150
      hover:bg-gray-200 dark:hover:bg-gray-700
    "
        >
          <MdLockReset size={14} />
          Reset
        </Link>
        {/* Sign Out */}
        <Link
          to="/signout"
          className="
      flex items-center gap-2
      px-3 py-1.5 rounded-md
      bg-rose-100 dark:bg-rose-900/30
      text-rose-600 dark:text-rose-400
      text-[12px] font-medium
      transition-colors duration-150
      hover:bg-rose-200 dark:hover:bg-rose-900/50
    "
        >
          <FiLogOut size={14} />
          Sign Out
        </Link>
      </div>

      {/* select-Model  */}
      <SelectModal
        open={!!selectModal}
        title={selectModal?.title}
        options={selectModal?.options || []}
        value={selectModal?.value}
        onSelect={selectModal?.onSelect}
        onClose={() => setSelectModal(null)}
      />
      {/* SGPA-Model */}
      {showSgpaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSgpaModal(false)}
          />

          {/* modal */}
          <div
            className="
      relative z-10
      w-[92%] max-w-sm
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-xl
      p-4
    "
          >
            {/* header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                SGPA
              </h2>

              <button
                onClick={() => setShowSgpaModal(false)}
                className="text-gray-400 hover:text-rose-500"
              >
                ✕
              </button>
            </div>

            {/* content */}
            <div className="space-y-2 max-h-[45vh] overflow-y-auto">
              {Array.from({ length: sem || 0 }, (_, i) => {
                const s = i + 1;
                return (
                  <div
                    key={s}
                    className="
              flex items-center justify-between
              px-2 py-1.5
              rounded-md
              bg-gray-50 dark:bg-gray-800
            "
                  >
                    <span className="text-[12px] text-gray-600 dark:text-gray-300">
                      Sem {s}
                    </span>

                    <input
                      value={form.sgpa?.[s] || ""}
                      onChange={(e) =>
                        setForm((prev) => {
                          const value = e.target.value;
                          const next = { ...prev.sgpa };

                          if (value === "") delete next[s];
                          else next[s] = value;

                          return { ...prev, sgpa: next };
                        })
                      }
                      inputMode="decimal"
                      placeholder="—"
                      className="
                w-16 text-right text-[12px]
                bg-transparent
                border-b border-gray-300 dark:border-gray-600
                focus:border-rose-500
                text-gray-900 dark:text-gray-100
                outline-none
              "
                    />
                  </div>
                );
              })}
            </div>

            {/* actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSgpaModal(false)}
                className="
          px-3 py-1.5 text-[12px]
          rounded-md
          text-gray-600 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
        "
              >
                Cancel
              </button>

              <button
                onClick={() => setShowSgpaModal(false)}
                className="
          px-3 py-1.5 text-[12px]
          rounded-md
          bg-rose-500 text-white
          hover:bg-rose-600
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

const Card = ({ title, icon: Icon, children, isExpanded, onToggle }) => {
  return (
    <div
      className="
        rounded-xl border
        border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        transition-colors duration-150
      "
    >
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          px-4 py-3
          text-left
        "
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
            <Icon size={16} />
          </div>

          <h2 className="text-[11px] font-semibold tracking-wide text-gray-600 dark:text-gray-300 uppercase">
            {title}
          </h2>
        </div>

        <FiChevronDown
          className={`
            text-gray-400
            transition-transform duration-150
            ${isExpanded ? "rotate-180 text-rose-500" : ""}
          `}
          size={16}
        />
      </button>

      <div
        className={`
          overflow-hidden
          transition-all duration-200 ease-out
          ${isExpanded ? "max-h-96 opacity-100 px-4 pb-3" : "max-h-0 opacity-0"}
        `}
      >
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};
const Field = ({
  label,
  value,
  editing,
  onChange,
  type = "text",
  options = [],
  openSelect,
}) => (
  <div className="flex justify-between items-center gap-4 text-sm group">
    <span className="text-gray-500 flex items-center gap-2">
      <FiEdit3 className="opacity-40 group-hover:opacity-80 transition" />
      {label}
    </span>

    {editing ? (
      type === "select" ? (
        <button
          onClick={openSelect}
          className="max-w-[60%] text-right border-b border-rose-400 text-gray-900 dark:text-gray-100"
        >
          {value || "Select..."}
        </button>
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-[60%] text-right bg-transparent border-b border-rose-400 focus:outline-none"
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
const SelectModal = ({ open, title, options, value, onSelect, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div
        className="
          relative z-10
          w-[92%] max-w-sm
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-xl
          p-4
        "
      >
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-500"
          >
            ✕
          </button>
        </div>

        {/* options */}
        <div className="space-y-1 max-h-[45vh] overflow-y-auto">
          {options.map((opt) => {
            const active = opt === value;

            return (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onClose();
                }}
                className={`
                  w-full text-left
                  px-3 py-1.5 rounded-md
                  text-[12px]
                  transition-colors duration-150
                  ${
                    active
                      ? "bg-rose-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
