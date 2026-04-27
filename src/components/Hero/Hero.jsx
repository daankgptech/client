import { useEffect, useState, useRef } from "react";
import FlashingNoticesCard from "./FlashingNoticesCard";

const VIDEO_URL = "https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [videoSrc, setVideoSrc] = useState(VIDEO_URL);
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

  useEffect(() => {
    let objectUrl = null;

    const loadAndCacheVideo = async () => {
      try {
        if (!("caches" in window)) return;
        const cache = await caches.open("daan-kgp-video-cache");
        const cachedResponse = await cache.match(VIDEO_URL);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          objectUrl = URL.createObjectURL(blob);
          setVideoSrc(objectUrl);
        } else {
          fetch(VIDEO_URL)
            .then((res) => {
              if (res.ok) cache.put(VIDEO_URL, res.clone());
            })
            .catch((e) => console.warn("Background video caching failed", e));
        }
      } catch (err) {
        console.warn("Cache API error", err);
      }
    };

    loadAndCacheVideo();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[75vh] md:min-h-[93vh] flex items-center justify-center overflow-hidden py-12 md:py-0"
    >
      {/* Cinematic Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Theme-aware Cinematic Overlays */}
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-gray-100 dark:from-gray-950/90 dark:via-transparent dark:to-gray-950" />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 flex flex-col items-center gap-6 md:gap-8">
        {/* Main heading with parallax effect */}
        <div
          className="text-center transition-transform duration-300 ease-out px-2 md:px-0"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
          }}
        >
          {/* Main title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-400">
              Congratulations on being a
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent dark:from-red-400 dark:via-rose-400 dark:to-orange-400 font-bold">
              DAAN KGPian!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 md:mt-6 text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mask">
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
          className="w-full mt-2 md:mt-4 transition-all duration-500 delay-200"
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
