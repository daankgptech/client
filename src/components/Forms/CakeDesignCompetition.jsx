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

// 🔹 File Input Component
const FormFileInput = ({ ...props }) => (
  <input type="file" className="hidden" {...props} />
);

// 🔹 Main Component
const CakeDesignCompetition = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    mobile: "",
    email: "",
    cakeImage: null,
    cakeURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    let { name, value, files } = e.target;
    if (name === "rollNo") value = value.toUpperCase().trim();
    if (name === "cakeImage") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () =>
    setFormData({
      name: "",
      rollNo: "",
      mobile: "",
      email: "",
      cakeImage: null,
      cakeURL: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      const res = await fetch(`${API_URL}/api/cake-design`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: "success",
          message: "Cake design submitted successfully!",
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
        <title>Cake Design Competition | DAAN KGP</title>
        <meta
          name="description"
          content="Showcase your creativity in the DAAN KGP Cake Design Competition 2025! Submit your original cake design, following square or circular shapes. The top 3 designs will be declared winners and will be featured on the cake during Dakshana Day 2025 as a mark of honour. Don’t miss this chance to have your design celebrated by the DAAN community."
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
            Cake Design Competition 2025
          </h1>
          <p className="my-8 italic">
            The top 3 designs will be declared winners. These winning designs
            will be featured on the cake on Dakshana Day 2025 as a mark of
            honour.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg mx-auto"
            encType="multipart/form-data"
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
              pattern="^[0-9]{2}[A-Z]{2}[0-9](?:[0-9]{2}|[A-Z]{2})[0-9]{2}$"
              title="Put correct Roll No (Don't use autofill)"
            />
            <FormInput
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              pattern="[6-9]{1}[0-9]{9}"
              title="Enter valid 10-digit Indian mobile number"
            />
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <div>
              <label
                htmlFor="cakeImage"
                className="cursor-pointer bg-white dark:bg-gray-700
                   border border-red-200 dark:border-gray-600 text-gray-900 dark:text-red-400 py-2 px-4 rounded-full transition-all duration-500 inline-block w-full text-center truncate"
              >
                {formData.cakeImage
                  ? formData.cakeImage.name
                  : "Choose Cake Design Image"}
              </label>
              <FormFileInput
                id="cakeImage"
                name="cakeImage"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <FormInput
              type="url"
              name="cakeURL"
              value={formData.cakeURL}
              onChange={handleChange}
              placeholder="Cake Design URL (Helpful)"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-400 dark:bg-gray-700 hover:bg-red-500 dark:hover:bg-gray-600 hover:scale-105 border border-gray-500 text-gray-900 dark:text-red-400 py-2 px-4 rounded-full transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="mt-10">
            Facing any issue?{" "}
            <a
              href="mailto:cr.daan.kgp@gmail.com"
              target="_blank"
              className="text-blue-500 dark:text-blue-400 "
            >
              Brief it!
            </a>
          </p>
        </section>
      </div>
    </>
  );
};

export default CakeDesignCompetition;
