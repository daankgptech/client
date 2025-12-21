import { useState } from "react";
import { api } from "../../utils/Secure/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import BlurLoader from "../../utils/LoaderOverlay";
import { PasswordHelper } from "./PasswordHelper";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("IDENTIFY");
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState({ q1: "", q2: "" });
  const [answers, setAnswers] = useState({ a1: "", a2: "" });
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const identifyUser = async () => {
    setLoading(true);
    try {
      const res = await api.post("/forgotpassword/identify", { username });
      if (res.data.hasSetSecQues) {
        setQuestions({ q1: res.data.sec_q1, q2: res.data.sec_q2 });
        setStep("VERIFY_ANSWERS");
      } else {
        setStep("SET_QUESTIONS");
      }
    } catch {
      toast.error("User not found");
    } finally {
      setLoading(false);
    }
  };

  const setSecurityQuestions = async () => {
    setLoading(true);
    try {
      await api.post("/forgotpassword/set-questions", {
        username,
        q1: questions.q1,
        q2: questions.q2,
        a1: answers.a1,
        a2: answers.a2,
      });
      toast.success("Security questions saved");
      setStep("RESET_PASSWORD");
    } catch {
      toast.error("Failed to save questions");
    } finally {
      setLoading(false);
    }
  };

  const verifyAnswers = async () => {
    setLoading(true);
    try {
      await api.post("/forgotpassword/verify", {
        username,
        a1: answers.a1,
        a2: answers.a2,
      });
      setStep("RESET_PASSWORD");
    } catch {
      toast.error("Wrong answers");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      await api.post("/forgotpassword/reset", { username, newPassword });
      toast.success("Password updated");
      navigate("/signin");
    } catch {
      toast.error("Weak password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300";

  const btnClass =
    "w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium shadow-md shadow-rose-300/40 hover:scale-105 active:scale-95 transition-all duration-300 flex justify-center items-center gap-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-8">
      {loading && <BlurLoader />}

      <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 space-y-6">
        {step === "IDENTIFY" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Find Your Account
            </h2>
            <input
              className={inputClass}
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={identifyUser} className={btnClass}>
              Continue
            </button>
          </>
        )}

        {step === "SET_QUESTIONS" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Set Security Questions
            </h2>
            <div className="space-y-3">
              <input
                className={inputClass}
                placeholder="Question 1"
                value={questions.q1}
                onChange={(e) =>
                  setQuestions({ ...questions, q1: e.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Answer 1"
                value={answers.a1}
                onChange={(e) => setAnswers({ ...answers, a1: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="Question 2"
                value={questions.q2}
                onChange={(e) =>
                  setQuestions({ ...questions, q2: e.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Answer 2"
                value={answers.a2}
                onChange={(e) => setAnswers({ ...answers, a2: e.target.value })}
              />
            </div>
            <button onClick={setSecurityQuestions} className={btnClass}>
              Save & Continue
            </button>
          </>
        )}

        {step === "VERIFY_ANSWERS" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Verify Security Answers
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">{questions.q1}</p>
              <input
                className={inputClass}
                value={answers.a1}
                onChange={(e) => setAnswers({ ...answers, a1: e.target.value })}
              />
              <p className="text-gray-700 dark:text-gray-300">{questions.q2}</p>
              <input
                className={inputClass}
                value={answers.a2}
                onChange={(e) => setAnswers({ ...answers, a2: e.target.value })}
              />
            </div>
            <button onClick={verifyAnswers} className={btnClass}>
              Verify
            </button>
          </>
        )}

        {step === "RESET_PASSWORD" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Set New Password
            </h2>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass + " pr-12"}
                placeholder="New strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </button>
            </div>
            <PasswordHelper password={newPassword} />
            <button onClick={resetPassword} className={btnClass}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
