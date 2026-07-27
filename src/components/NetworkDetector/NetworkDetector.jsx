import { useEffect, useState } from "react";
import { AlertTriangle, Wifi, X } from "lucide-react";

const STORAGE_KEY = "daan_network_modal_dismissed";
const DISMISS_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export default function NetworkDetector() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      // Check if user has dismissed the modal recently
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const dismissedTime = parseInt(dismissedAt, 10);
        const timeElapsed = Date.now() - dismissedTime;
        if (timeElapsed < DISMISS_DURATION_MS) {
          setIsLoading(false);
          return; // Still within 30-minute window
        }
        // Clear expired timestamp
        localStorage.removeItem(STORAGE_KEY);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch network data");
        }

        const data = await response.json();

        // Check for NKN EDGE Network or ASN 55847
        const isNKN =
          data.org?.includes("NKN EDGE Network") ||
          data.asn === "AS55847" ||
          data.asn === 55847;

        if (isNKN) {
          setShowModal(true);
        }
      } catch (error) {
        // Gracefully handle errors - don't show modal on failure
        if (error.name !== "AbortError") {
          console.warn("Network detection failed:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkNetwork();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  // Don't render anything while loading or if modal shouldn't show
  if (isLoading || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 group"
        role="dialog"
        aria-modal="true"
        aria-labelledby="network-modal-title"
      >
        {/* Soft Glow behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff3130]/20 to-transparent blur-2xl opacity-50 transition duration-1000" />
        
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl">
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff3130]/30 rounded-full blur-xl animate-pulse" />
                <div className="relative p-4 rounded-full border border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-[#ff3130]" />
                    <Wifi className="w-6 h-6 text-white/70" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2
              id="network-modal-title"
              className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white mb-4 text-center"
            >
              Restricted Network
            </h2>

            {/* Body */}
            <p className="font-['Inter'] text-sm text-white/70 text-center leading-relaxed mb-4">
              It looks like you are connected via <span className="text-white font-medium">Institute Wi-Fi (NKN)</span>. This
              network often blocks certain features of our website, which may
              lead to errors. 
            </p>

            <p className="font-['Inter'] text-sm text-white/70 text-center leading-relaxed mb-8">
              For the best experience, please switch to your
              Mobile Data or a Personal Hotspot.
            </p>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="bg-[#ff3130] hover:bg-[#d42a29] transition-all duration-300 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs w-full sm:w-auto"
              >
                Continue Anyway
              </button>
            </div>

            {/* Timer hint */}
            <p className="text-[#ff3130] text-[10px] font-bold uppercase tracking-[0.2em] text-center mt-6">
              Dismissed for 30 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
