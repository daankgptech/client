import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../utils/Secure/api";
import {
  PartyPopper,
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  MessageSquareHeart,
  Music,
  Phone,
  ArrowLeft,
  Info,
} from "lucide-react";

const InputWrapper = ({ children, icon: Icon, label }) => (
  <div className="flex flex-col space-y-1.5 w-full">
    {label && (
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-rose-500" />}
        {label}
      </label>
    )}
    <div className="relative">{children}</div>
  </div>
);

const SelectClasses =
  "w-full rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all shadow-sm backdrop-blur-sm";
const InputClasses =
  "w-full rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm backdrop-blur-sm";

const Farewell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    isGraduating: "",
    graduatingMemory: "",
    isJoining: "",
    isExpressing: "",
    performanceType: "",
    otherPerformanceData: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      batch: "",
      isGraduating: "",
      graduatingMemory: "",
      isJoining: "",
      isExpressing: "",
      performanceType: "",
      otherPerformanceData: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/farewell`, formData);
      if (res.status === 201) {
        toast.success("Thank you for your response, see you there!");
        handleReset();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const showGraduatingLogic =
    formData.batch === "21" || formData.batch === "22";
  const showJoiningLogic = formData.isJoining === "Yes";
  const showExpressingLogic =
    showJoiningLogic && formData.isExpressing === "Yes";
  const showOtherPerf =
    showExpressingLogic && formData.performanceType === "Others";

  return (
    <>
      <Helmet>
        <title>Farewell 2026 | DAAN KGP</title>
      </Helmet>

      <div className="min-h-screen py-12 px-4 sm:px-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <div className="w-full max-w-2xl relative">
          {/* Decorative Blooms */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>

          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-500 to-rose-600 p-8 sm:p-10 text-white text-center">
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-colors flex items-center justify-center text-white"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>

              <PartyPopper
                size={48}
                className="mx-auto mb-4 opacity-90 text-yellow-200"
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                Farewell Ceremony 2026
              </h1>
              <p className="text-rose-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                A grand celebration organised by our graduating seniors for the
                entire DAAN KGPian family. Let's make this evening
                unforgettable!
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Clock size={16} /> April 11, Evening (6:00 PM)
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <MapPin size={16} /> TSG Frontside
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-2 md:p-3 lg:p-4 m-8 mb-0 rounded-r-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    <strong className="font-bold">Mandatory for all DAAN KGPians:</strong> Your
                    response is required because it yields the exact headcount
                    so we can efficiently book transport, food, and other
                    logistics for the entire family.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
              {/* Row 1: Name & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputWrapper icon={User} label="Full Name*">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={InputClasses}
                    placeholder="Enter your name"
                    required
                  />
                </InputWrapper>

                <InputWrapper icon={GraduationCap} label="Your Batch*">
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className={SelectClasses}
                    required
                  >
                    <option value="" disabled>
                      Select Batch
                    </option>
                    <option value="21">2021</option>
                    <option value="22">2022</option>
                    <option value="23">2023</option>
                    <option value="24">2024</option>
                    <option value="25">2025</option>
                  </select>
                </InputWrapper>
              </div>

              {/* Conditional: Graduating Seniors Logic */}
              {showGraduatingLogic && (
                <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 space-y-5 transition-all">
                  <InputWrapper
                    icon={Sparkles}
                    label="Are you graduating this year?"
                  >
                    <div className="flex gap-4">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="isGraduating"
                            value={opt}
                            className="sr-only peer"
                            onChange={handleChange}
                            checked={formData.isGraduating === opt}
                            required
                          />
                          <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 transition-colors bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                            {opt}
                          </div>
                        </label>
                      ))}
                    </div>
                  </InputWrapper>

                  {formData.isGraduating === "Yes" && (
                    <InputWrapper label="Would you like to share a special DAAN KGP memory with us? (Optional)">
                      <textarea
                        name="graduatingMemory"
                        value={formData.graduatingMemory}
                        onChange={handleChange}
                        className={`${InputClasses} resize-none h-24`}
                        placeholder="A moment that you'll cherish forever..."
                      ></textarea>
                    </InputWrapper>
                  )}
                </div>
              )}

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Row 2: Joining & Expressing Logic */}
              <InputWrapper
                icon={PartyPopper}
                label="Will you be joining us on April 11?*"
              >
                <div className="flex gap-4 sm:max-w-xs">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="isJoining"
                        value={opt}
                        className="sr-only peer"
                        onChange={handleChange}
                        checked={formData.isJoining === opt}
                        required
                      />
                      <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 transition-colors bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                        {opt}
                      </div>
                    </label>
                  ))}
                </div>
              </InputWrapper>

              {showJoiningLogic && (
                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 space-y-6 animate-fade-in">
                  <InputWrapper
                    icon={Music}
                    label="Would you like to express yourself with a performance?"
                  >
                    <div className="flex gap-4 sm:max-w-xs">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="isExpressing"
                            value={opt}
                            className="sr-only peer"
                            onChange={handleChange}
                            checked={formData.isExpressing === opt}
                            required={showJoiningLogic}
                          />
                          <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 transition-colors bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                            {opt}
                          </div>
                        </label>
                      ))}
                    </div>
                  </InputWrapper>

                  {showExpressingLogic && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                      <InputWrapper label="Type of Performance">
                        <select
                          name="performanceType"
                          value={formData.performanceType}
                          onChange={handleChange}
                          className={SelectClasses}
                          required={showExpressingLogic}
                        >
                          <option value="" disabled>
                            Select category
                          </option>
                          <option value="Song">Song</option>
                          <option value="Dance">Dance</option>
                          <option value="StandUp">StandUp</option>
                          <option value="Poetry">Poetry</option>
                          <option value="Play Instruments">
                            Play Instruments
                          </option>
                          <option value="Others">Others</option>
                        </select>
                      </InputWrapper>

                      {showOtherPerf && (
                        <InputWrapper label="Please specify">
                          <input
                            type="text"
                            name="otherPerformanceData"
                            value={formData.otherPerformanceData}
                            onChange={handleChange}
                            className={InputClasses}
                            placeholder="What will you present?"
                            required={showOtherPerf}
                          />
                        </InputWrapper>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Row 3: Optional Message */}
              <InputWrapper
                icon={MessageSquareHeart}
                label="Any warm messages or suggestions for us? (Optional)"
              >
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${InputClasses} resize-none h-24`}
                  placeholder="Drop a note for the organizing team..."
                ></textarea>
              </InputWrapper>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
              >
                {loading ? "Submitting..." : "Confirm Registration"}
              </button>
            </form>

            {/* Footer Connect Section */}
            <div className="bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 p-6 text-center space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Facing issues or have a query? Connect with our team:
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                <a
                  href="https://wa.me/916264607383"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-500 transition-colors"
                >
                  <Phone size={14} className="text-green-500" />
                  CR: +91 6264607383
                </a>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                  |
                </span>
                <a
                  href="https://wa.me/919725920609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-500 transition-colors"
                >
                  <Phone size={14} className="text-green-500" />
                  TechTeam: +91 9725920609
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Farewell;
