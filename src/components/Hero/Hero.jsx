import { useEffect, useState, useRef } from "react";
import GridBackground from "./GridBackground";
import FlashingNoticesCard from "./FlashingNoticesCard";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const hero = heroRef.current;
    hero?.addEventListener("mousemove", handleMouseMove);
    return () => hero?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[93vh] flex items-center justify-center overflow-hidden"
    >
      {/* Premium animated background */}
      <GridBackground />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center gap-8">
        {/* Main heading with parallax effect */}
        <div
          className="text-center transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
          }}
        >
          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            <span className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-400">
              Congratulations on being a
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent dark:from-red-400 dark:via-rose-400 dark:to-orange-400 font-bold">
              DAAN KGPian!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The esteemed community of
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              {" "}
              KGPians{" "}
            </span>
            and proudly embracing your
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              {" "}
              Dakshanite{" "}
            </span>
            heritage. Connect, collaborate, and grow together.
          </p>
        </div>

        {/* Notice board */}
        <div
          className="w-full mt-4 transition-all duration-500 delay-200"
          style={{
            opacity: 1,
            transform: "translateY(0)",
          }}
        >
          <FlashingNoticesCard />
        </div>
      </div>
    </section>
  );
}
