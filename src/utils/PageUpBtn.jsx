import { useState, useEffect } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";

const PageUpBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Scroll to top"
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-gradient-to-tr from-gray-100 dark:from-gray-900 to-gray-200 dark:to-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg text-red-600 dark:text-gray-400 hover:from-gray-300 dark:hover:from-gray-700 hover:to-gray-400 hover:border-gray-500 transition-all duration-300"
    >
      <FaLongArrowAltUp className="w-4 h-4" />
    </button>
  ) : null;
};

export default PageUpBtn;