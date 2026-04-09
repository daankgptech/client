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
      className="
    fixed bottom-5 right-5 z-50
    p-2.5 rounded-lg
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    text-gray-700 dark:text-gray-300
    shadow-sm
    transition-transform duration-200
    hover:-translate-y-0.5
    active:scale-95
  "
    >
      <FaLongArrowAltUp className="w-4 h-4" />
      {/* <FaLongArrowAltUp className="w-4 h-4" /> */}
    </button>
  ) : null;
};

export default PageUpBtn;
