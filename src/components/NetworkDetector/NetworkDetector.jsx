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
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="network-modal-title"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 border border-amber-300/50 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10">
          {/* Ambient glow effect */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-100/10 via-transparent to-orange-500/10" />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
                <div className="relative p-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-500/20 dark:to-orange-600/20 border border-amber-300 dark:border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    <Wifi className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2
              id="network-modal-title"
              className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3"
            >
              Restricted Network Detected
            </h2>

            {/* Body */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
              It looks like you are connected via Institute Wi-Fi (NKN). This
              network often blocks certain features of our website, which may
              lead to errors. For the best experience, please switch to your
              Mobile Data or a Personal Hotspot.
            </p>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-6 italic">
              If you are already on a personal network, you can safely ignore
              this.
            </p>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Continue Anyway
              </button>
            </div>

            {/* Timer hint */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              This message won't appear again for 30 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
