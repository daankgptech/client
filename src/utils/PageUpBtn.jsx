import { useState, useEffect } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PageUpBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Scroll to top"
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 p-3 bg-black/70 backdrop-blur-md border-[0.5px] border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out shadow-xl"
        >
          <FaLongArrowAltUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default PageUpBtn;
