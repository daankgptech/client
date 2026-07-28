import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  X,
  Save,
  Loader2,
  Upload,
  User,
  GraduationCap,
  PhoneCall,
  MapPin,
  Calendar,
  Building, 
  Award,
  BookOpen,
} from "lucide-react";
import { api } from "../utils/Secure/api";

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
  "Azad", "BC Roy", "BR Ambedkar", "HJB", "JBR", "LBS", "MMM",
  "Patel", "RK", "RP", "SAM", "VS", "SN / IG", "MT", "GKH",
  "Sister Nivedita", "RLB", "NVH", "Sir Ashutosh Mukherjee",
];

const BATCH_OPTIONS = Array.from({ length: 20 }, (_, i) => (2012 + i).toString());

export default function UserEditModal({ user, onClose, onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State initialized with user props
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    batch: "",
    hall: "",
    branch: "",
    course: "",
    graduated: false,
    cgpa: "",
    bio: "",
    coe: "",
    parentJNV: "",
    imgLink: "",
    // Contacts
    phone: "",
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
    // SGPA Map
    sgpa: {},
  });

  useEffect(() => {
    if (user) {
      const contact = user.contacts?.[0] || {};
      const inv = user.involvements?.[0] || {};
      const pers = user.personalInfo || {};

      let formattedDob = "";
      if (pers.dob) {
        try {
          formattedDob = new Date(pers.dob).toISOString().split("T")[0];
        } catch (e) {
          formattedDob = "";
        }
      }

      setFormData({
        name: user.name || "",
        username: user.username || "",
        gender: user.gender || "Male",
        batch: user.batch || "2024",
        hall: user.hall || "Azad",
        branch: user.branch || "CS",
        course: user.course || "B.Tech",
        graduated: Boolean(user.graduated),
        cgpa: user.cgpa || "",
        bio: user.bio || "",
        coe: user.coe || "",
        parentJNV: user.parentJNV || "",
        imgLink: user.imgLink || "",
        // Contacts
        phone: contact.phone || "",
        email: contact.email || user.username || "",
        github: contact.github || "",
        linkedIn: contact.linkedIn || "",
        // Involvements
        soc: inv.soc || "",
        involvementsHall: inv.involvementsHall || "",
        council: inv.council || "",
        iit: inv.iit || "",
        extra: inv.extra || "",
        // Personal Info
        dob: formattedDob,
        address: pers.address || "",
        city: pers.city || "",
        state: pers.state || "",
        pincode: pers.pincode || "",
        emergencyContact: pers.emergencyContact || "",
        bloodGroup: pers.bloodGroup || "O+",
        // SGPA Map
        sgpa: user.sgpa || {},
      });
    }
  }, [user]);

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({ ...prev, imgLink: res.data.url }));
        toast.success("Profile image uploaded successfully");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload profile image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSgpaChange = (semKey, value) => {
    setFormData((prev) => ({
      ...prev,
      sgpa: {
        ...prev.sgpa,
        [semKey]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        gender: formData.gender,
        batch: formData.batch,
        hall: formData.hall,
        branch: formData.branch,
        course: formData.course,
        graduated: formData.graduated,
        cgpa: formData.cgpa,
        bio: formData.bio,
        coe: formData.coe,
        parentJNV: formData.parentJNV,
        imgLink: formData.imgLink,
        sgpa: formData.sgpa,
        contacts: [
          {
            phone: formData.phone,
            email: formData.email,
            github: formData.github,
            linkedIn: formData.linkedIn,
          },
        ],
        involvements: [
          {
            soc: formData.soc,
            involvementsHall: formData.involvementsHall,
            council: formData.council,
            iit: formData.iit,
            extra: formData.extra,
          },
        ],
        personalInfo: {
          dob: formData.dob ? new Date(formData.dob).toISOString() : null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          emergencyContact: formData.emergencyContact,
          bloodGroup: formData.bloodGroup,
        },
      };

      const res = await api.patch(`/admin/users/${user._id}`, payload);
      if (res.data?.success) {
        toast.success(`Updated ${formData.name || formData.username} successfully`);
        onSaveSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Save user error:", err);
      toast.error("Failed to update user record");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "academic", label: "Academic & SGPA", icon: GraduationCap },
    { id: "contacts", label: "Contacts & Clubs", icon: PhoneCall },
    { id: "personal", label: "Personal & Emergency", icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#09090b] border border-white/10 w-full max-w-3xl max-h-[92vh] flex flex-col font-space-grotesk shadow-2xl">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            {formData.imgLink ? (
              <img
                src={formData.imgLink}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                {formData.name?.[0] || formData.username?.[0] || "U"}
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Edit User: {formData.name || formData.username}
              </h2>
              <p className="text-[11px] text-white/50 font-mono">
                @{formData.username} · ID: {user._id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-white rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-black no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex-shrink-0
                  ${
                    isActive
                      ? "border-rose-500 text-rose-400 bg-white/5"
                      : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Username / Email Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Gender (Select Dropdown) *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-[#09090b]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Batch Year (Select Dropdown) *</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {BATCH_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-[#09090b]">
                        Batch {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Branch (Select Dropdown) *</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {BRANCH_OPTIONS.map((br) => (
                      <option key={br} value={br} className="bg-[#09090b]">
                        {br}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Hall of Residence (Select Dropdown) *</label>
                  <select
                    value={formData.hall}
                    onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {HALL_OPTIONS.map((h) => (
                      <option key={h} value={h} className="bg-[#09090b]">
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Course / Degree (Select Dropdown) *</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#09090b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Graduation Status (Select Dropdown) *</label>
                  <select
                    value={formData.graduated ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, graduated: e.target.value === "true" })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="false" className="bg-[#09090b]">Scholar (Current Student)</option>
                    <option value="true" className="bg-[#09090b]">Alumni (Graduated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Dakshana COE / Center</label>
                  <input
                    type="text"
                    value={formData.coe}
                    onChange={(e) => setFormData({ ...formData, coe: e.target.value })}
                    placeholder="e.g. Pune, Bundi, JNV Pune"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Parent JNV School</label>
                  <input
                    type="text"
                    value={formData.parentJNV}
                    onChange={(e) => setFormData({ ...formData, parentJNV: e.target.value })}
                    placeholder="e.g. JNV Lucknow"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-bold">Profile Image URL & Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.imgLink}
                    onChange={(e) => setFormData({ ...formData, imgLink: e.target.value })}
                    placeholder="https://cloudinary.com/..."
                    className="flex-1 px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer font-bold shrink-0">
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-bold">Member Bio</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Short bio description..."
                  className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC & SGPA */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              <div>
                <label className="block text-white/60 mb-1 font-bold">Cumulative CGPA</label>
                <input
                  type="text"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="e.g. 9.42"
                  className="w-full sm:w-1/2 px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
                  Semester SGPA Breakdown (Semesters 1 - 10)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semNum) => (
                    <div key={semNum}>
                      <label className="block text-white/50 mb-1 font-mono text-[10px]">
                        Semester {semNum}
                      </label>
                      <input
                        type="text"
                        value={formData.sgpa?.[semNum] || formData.sgpa?.[semNum.toString()] || ""}
                        onChange={(e) => handleSgpaChange(semNum.toString(), e.target.value)}
                        placeholder="0.00"
                        className="w-full px-2.5 py-1.5 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS & CLUBS */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1 font-bold">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@iitkgp.ac.in"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
                  Involvements & Societies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1 font-bold">Societies / Clubs</label>
                    <input
                      type="text"
                      value={formData.soc}
                      onChange={(e) => setFormData({ ...formData, soc: e.target.value })}
                      placeholder="e.g. Technology Robotix Society, E-Cell"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">Hall Involvements</label>
                    <input
                      type="text"
                      value={formData.involvementsHall}
                      onChange={(e) => setFormData({ ...formData, involvementsHall: e.target.value })}
                      placeholder="e.g. Hall President, Tech Sec"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">Student Council Position</label>
                    <input
                      type="text"
                      value={formData.council}
                      onChange={(e) => setFormData({ ...formData, council: e.target.value })}
                      placeholder="e.g. VP Gymkhana, General Secretary"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-bold">IIT Level Activities</label>
                    <input
                      type="text"
                      value={formData.iit}
                      onChange={(e) => setFormData({ ...formData, iit: e.target.value })}
                      placeholder="e.g. Kshitij Coordinator, Spring Fest Team"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-white/60 mb-1 font-bold">Extra Achievements</label>
                    <input
                      type="text"
                      value={formData.extra}
                      onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
                      placeholder="e.g. Inter-IIT Gold Medalist"
                      className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERSONAL & EMERGENCY */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-bold">Date of Birth (DOB Picker)</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Blood Group (Select Dropdown)</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  >
                    {BLOOD_GROUP_OPTIONS.map((bg) => (
                      <option key={bg} value={bg} className="bg-[#09090b]">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Emergency Contact Number</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="721302"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Kharagpur"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="West Bengal"
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/60 mb-1 font-bold">Street Address</label>
                  <textarea
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Permanent residential address..."
                    className="w-full px-3 py-2 bg-transparent border border-white/10 text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
