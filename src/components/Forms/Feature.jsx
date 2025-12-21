import { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";

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
  <textarea rows={4} className={baseClasses} {...props} />
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
        toast.success("Thank you for contributing DAAN KGP!");
        resetForm();
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
      // Set popup message only if there was a response
      if (res.ok) {
        setPopup({
          type: "success",
          message: "Thank you for your submission!",
        });
      } else {
        setPopup({
          type: "error",
          message: "Something went wrong, please try again.",
        });
      }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-14 h-14 rotate-45">
            {["0s", "0.15s", "0.3s", "0.45s"].map((delay, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-sm bg-rose-500 dark:bg-gray-400 animate-ping"
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
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
          px-6 py-3 rounded-2xl
          shadow-lg shadow-black/20
          animate-scaleIn
          text-sm font-medium text-white
          ${
            popup.type === "success"
              ? "bg-gradient-to-r from-emerald-600 to-green-600"
              : "bg-gradient-to-r from-red-600 to-rose-600"
          }`}
        >
          {popup.message}
        </div>
      )}

      {/* Form */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300">
        <section className="container mx-auto py-12" data-aos="fade-up">
          <div
            className="
            max-w-2xl mx-auto
            rounded-3xl
            bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
            dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
            border border-rose-100 dark:border-gray-700
            p-8
            shadow-xl
          "
          >
            <h1 className="mb-4 pl-3 border-l-8 border-rose-400 text-3xl font-bold">
              Feature Suggestion Form
            </h1>

            <p className="mb-8 text-sm italic text-gray-600 dark:text-gray-400 leading-relaxed">
              You can suggest frontend features, UI improvements, specific
              pages, additions or removals, server-side changes, database
              improvements, or anything else that could make the platform
              better.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="Feature Suggestion (Describe in detail...)*"
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
                className="
                  mt-4
                  self-center
                  px-8 py-2.5
                  rounded-full
                  bg-gradient-to-r from-rose-500 to-red-600
                  text-white text-sm font-medium
                  shadow-md shadow-rose-300/40
                  hover:scale-105
                  active:scale-95
                  transition-all duration-300
                  disabled:opacity-50
                "
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Feature;
