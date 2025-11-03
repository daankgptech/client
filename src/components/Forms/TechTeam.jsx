import { useState } from "react";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const baseClasses =
  "px-4 py-2 w-full border border-red-200 dark:border-gray-600 rounded-3xl shadow-sm text-red-600 " +
  "focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-gray-500 " +
  "transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg dark:hover:shadow-gray-800";

const FormInput = ({ type = "text", ...props }) => (
  <input type={type} className={baseClasses} {...props} />
);

const FormTextarea = ({ rows = 2, ...props }) => (
  <textarea rows={rows} className={baseClasses} {...props} />
);

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

const levelOptions = ["Basic", "Intermediate", "Advanced"];

const TechTeam = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    html: "",
    css: "",
    more: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "rollNo") value = value.toUpperCase().replace(/\s+/g, "").slice(0, 9);
    if (name === "email") value = value.toLowerCase();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      name: "",
      rollNo: "",
      email: "",
      html: "",
      css: "",
      more: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const res = await fetch(`${API_URL}/api/tech-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: "success",
          message: "We’ll reach out to you soon! Keep checking your email regularly.",
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
        <title>Join Tech Team | DAAN KGP</title>
        <meta
          name="description"
          content="Interested in joining DAAN KGP Tech Team? Fill out this quick form and we’ll reach out to you soon via email!"
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
      <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400 text-gray-900 min-h-screen flex flex-col items-center px-4 py-8">
        <section
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"
          data-aos="fade-up"
        >
          <h1 className="mb-6 border-l-8 border-red-300 dark:border-gray-400 py-1 pl-3 text-2xl sm:text-3xl font-bold">
            Tech Team Application
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID"
              required
            />

            <h2 className="mt-4 mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              Skills (Select your level)
            </h2>

            <FormSelect
              name="html"
              value={formData.html}
              onChange={handleChange}
              options={levelOptions}
              placeholder="HTML"
            />
            <FormSelect
              name="css"
              value={formData.css}
              onChange={handleChange}
              options={levelOptions}
              placeholder="CSS"
            />
            <FormTextarea
              name="more"
              value={formData.more}
              onChange={handleChange}
              placeholder="Any other skills or comments?"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-400 dark:bg-gray-700 hover:bg-red-500 dark:hover:bg-gray-600 hover:scale-105 border border-gray-500 text-gray-900 dark:text-red-400 py-2 px-4 rounded-full transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm sm:text-base">
            Facing any issue?{" "}
            <a
              href="mailto:cr.daan.kgp@gmail.com"
              target="_blank"
              className="text-blue-500 dark:text-blue-400"
            >
              Brief it!
            </a>
          </p>
        </section>
      </div>
    </>
  );
};

export default TechTeam;