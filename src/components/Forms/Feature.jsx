import { useState } from "react";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// 🔹 Common styles
const baseClasses =
  "px-4 py-2 border border-red-200 dark:border-gray-600 rounded-3xl shadow-sm text-red-600 " +
  "focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-gray-500 " +
  "transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg dark:hover:shadow-gray-800";

// 🔹 Input Component
const FormInput = ({ type = "text", ...props }) => (
  <input type={type} className={baseClasses} {...props} />
);

// 🔹 Textarea Component
const FormTextarea = ({ ...props }) => (
  <textarea
    rows={4}
    className={baseClasses + ""}
    {...props}
  />
);

// 🔹 Main Component
const Feature = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    feature: "",
    otherSuggestion: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      name: "",
      rollNo: "",
      feature: "",
      otherSuggestion: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const res = await fetch(`${API_URL}/api/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setPopup({
          type: "success",
          message: "Thank you for contributing DAAN KGP!",
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
        <title>Feature Suggestion Form | DAAN KGP</title>
        <meta
          name="description"
          content="Suggest new features, improvements, or ideas for the DAAN KGP platform."
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
            Feature Suggestion Form
          </h1>
          <p className="my-8 italic">You can suggest over Frontend Work/Function, UI, any specific
            tab/page, addition/removal/updation of existing features,
            server-side or database-related improvements, etc.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg mx-auto"
          >
            <FormInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name*"
              required
            />
            <FormInput
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="Roll No (Institute)*"
              required
              pattern="^[0-9]{2}[A-Z]{2}[0-9](?:[0-9]{2}|[A-Z]{2})[0-9]{2}$"
              title="Put correct Roll No (Don't use autofill)"
            />
            <FormTextarea
              name="feature"
              value={formData.feature}
              onChange={handleChange}
              placeholder="Feature Suggestion (Detail here...)*"
              required
              />
            <FormTextarea
              name="otherSuggestion"
              value={formData.otherSuggestion}
              onChange={handleChange}
              placeholder="Any other suggestion..."
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-400 dark:bg-gray-700 hover:bg-red-500 dark:hover:bg-gray-600 hover:scale-105 border border-gray-500 text-gray-900 dark:text-red-400 py-2 px-4 rounded-full transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default Feature;