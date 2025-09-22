import { useState } from "react";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// 🔹 Common styles
const baseClasses =
  "px-4 py-2 border border-red-200 dark:border-gray-600 rounded-full shadow-sm text-red-600 " +
  "focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-gray-500 " +
  "transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg dark:hover:shadow-gray-800";

// 🔹 Input Component
const FormInput = ({ type = "text", ...props }) => (
  <input type={type} className={baseClasses} {...props} />
);

// 🔹 Select Component
const FormSelect = ({ options, placeholder, ...props }) => (
  <select className={baseClasses} {...props}>
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

// 🔹 Static options
const yearOptions = [1, 2, 3, 4, 5, "PG 1", "PG 2", "PhD"];
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
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

// 🔹 Main Component
const Tshirt = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    yearOfStudy: "",
    hallOfResidence: "",
    mobileNo: "",
    email: "",
    coe: "",
    tshirtSize: "",
    dxnRoll: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "rollNo") value = value.toUpperCase().trim();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      name: "",
      rollNo: "",
      yearOfStudy: "",
      hallOfResidence: "",
      mobileNo: "",
      email: "",
      coe: "",
      tshirtSize: "",
      dxnRoll: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const res = await fetch(`${API_URL}/api/tshirt-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: "success",
          message: "Registered successfully for Dakshana T-Shirt 2025!",
        });
        resetForm();
      } else {
        setPopup({
          type: "error",
          message: data.error || "Something went wrong!",
        });
      }
    } catch (err) {
      setPopup({ type: "error", message: "Error: " + err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title>T Shirt 2025 | DAAN KGP</title>
        <meta
          name="description"
          content="Excited for Dakshana T-Shirt 2025? Don’t miss out! Register now by filling in your details and grab your tee to represent the spirit of Dakshana."
        />
      </Helmet>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-12 h-12 relative rotate-45">
            {["0s", "0.15s", "0.3s", "0.45s"].map((delay, i) => (
              <div
                key={i}
                className="absolute bg-red-400 dark:bg-gray-400 w-4 h-4 animate-ping"
                style={{
                  top: i < 2 ? 0 : "auto",
                  bottom: i >= 2 ? 0 : "auto",
                  left: i === 0 || i === 3 ? 0 : "auto",
                  right: i === 1 || i === 2 ? 0 : "auto",
                  animationDuration: "1.2s",
                  animationDelay: delay,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popup */}
      {popup && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in ${
            popup.type === "success"
              ? "bg-green-600 dark:bg-emerald-700"
              : "bg-red-600 dark:bg-red-700"
          } text-white text-center`}
        >
          {popup.message}
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400 text-gray-900">
        <section className="container mx-auto" data-aos="fade-up">
          <h1 className="my-8 border-l-8 border-red-300 dark:border-gray-400 py-2 pl-2 text-3xl font-bold">
            T-Shirt Registration 2025
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg mx-auto"
          >
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <FormInput
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="Roll No (Institution)"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                options={yearOptions}
                placeholder="Year of Study"
                required
              />
              <FormSelect
                name="hallOfResidence"
                value={formData.hallOfResidence}
                onChange={handleChange}
                options={hallOptions}
                placeholder="Hall Of Residence"
                required
              />
            </div>
            <FormInput
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="Mobile No (9XXXXXXXXX)"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                name="coe"
                value={formData.coe}
                onChange={handleChange}
                options={coeOptions}
                placeholder="COE"
                required
              />
              <FormSelect
                name="tshirtSize"
                value={formData.tshirtSize}
                onChange={handleChange}
                options={sizeOptions}
                placeholder="T-shirt Size"
                required
              />
            </div>
            <FormInput
              type="text"
              name="dxnRoll"
              value={formData.dxnRoll}
              onChange={handleChange}
              placeholder="Dakshana Roll No (Optional)"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-400 dark:bg-gray-700 hover:bg-red-500 dark:hover:bg-gray-600 hover:scale-105 border border-gray-500 text-gray-900 dark:text-red-400 py-2 px-4 rounded-full transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-10">Facing any issue? <a href="mailto:cr.daan.kgp@gmail.com" target="_blank" className="text-blue-500 dark:text-blue-400 ">Brief it!</a></p>
        </section>
      </div>
    </>
  );
};

export default Tshirt;
