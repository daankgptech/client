import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import defaultNotices from './Notice';
import { Link } from 'react-router-dom';
import { api } from '../../utils/Secure/api';

const Hero = () => {
  const [notices, setNotices] = useState(defaultNotices);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices');
        if (res.data?.success && Array.isArray(res.data.notices) && res.data.notices.length > 0) {
          setNotices(res.data.notices);
        }
      } catch (err) {
        console.warn("Using fallback static notices for Hero Noticeboard:", err.message);
      }
    };

    fetchNotices();
  }, []);

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#000000] text-white overflow-hidden flex items-center px-[5vw] py-10">
      {/* Subtle Background Parallax Element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        style={{ userSelect: 'none' }}
        className="absolute -top-20 -left-10 text-[20vw] font-bold font-['Space_Grotesk'] tracking-tighter leading-none"
      >
        DAAN
      </motion.div>

      <div className="md:container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Content Column */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-7 flex flex-col items-start"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-['Space_Grotesk'] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-balance"
          >
            Welcome to <br />
            <span className="text-[#ff3130]">DAAN KGP</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-['Inter'] text-sm md:text-lg text-white/70 max-w-xl leading-relaxed mb-10"
          >You are now part of the distinguished Dakshana network at IIT Kharagpur - where heritage, ambition, and innovation unite to
            <span className="text-white font-medium"> connect, collaborate, and grow</span> together.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex gap-6">
            <Link to="/our-fam" className="bg-[#ff3130] hover:bg-[#d42a29] transition-all duration-300 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs">
              Explore Network
            </Link>
            <Link to="/events" className="border border-white/20 hover:border-white transition-all duration-300 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs backdrop-blur-sm">
              Our Events
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - The Noticeboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          {/* Glassmorphism Container */}
          <div className="relative group">
            {/* Soft Glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff3130]/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">Noticeboard</h3>
                <div className="h-2 w-2 rounded-full bg-[#ff3130] animate-pulse" title="Live Noticeboard Stream" />
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {notices.map((item, index) => {
                  const key = item._id || index;
                  const Content = (
                    <div className="group/item cursor-pointer">
                      <p className="text-[#ff3130] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                        {item.date}
                      </p>
                      <h4 className="font-['Inter'] text-white group-hover/item:text-[#ff3130] transition-colors duration-300 text-lg font-medium leading-snug">
                        {item.text}
                      </h4>
                      <div className="mt-4 h-[0.5px] w-full bg-white/10 group-hover/item:bg-[#ff3130]/30 transition-all duration-500" />
                    </div>
                  );

                  return item.link ? (
                    <a
                      key={key}
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div key={key}>{Content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ultra-thin Decorative Lines (Zero-Clutter Architecture) */}
      <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-[20%] w-[0.5px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default Hero;