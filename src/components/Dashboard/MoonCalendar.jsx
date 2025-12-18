import { useEffect, useState } from "react";

const API_KEY = "fb5cc961147f431e800115848251712";

export default function MoonCalendar() {
  const [astro, setAstro] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAstronomy = async () => {
      try {
        // Step 1: get location from IP
        const ipRes = await fetch(
          `https://api.weatherapi.com/v1/ip.json?key=${API_KEY}&q=auto:ip`
        );
        if (!ipRes.ok) throw new Error("IP lookup failed");
        const ipData = await ipRes.json();

        const { lat, lon } = ipData;

        // Step 2: get astronomy data
        const astroRes = await fetch(
          `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${lat},${lon}`
        );
        if (!astroRes.ok) throw new Error("Astronomy fetch failed");
        const astroData = await astroRes.json();

        setAstro(astroData.astronomy.astro);
      } catch (err) {
        setError("Unable to load moon data");
      }
    };

    fetchAstronomy();
  }, []);

  if (error) {
    return (
      <div className="card">
        <h3>Moon Calendar</h3>
        <p className="muted">{error}</p>
      </div>
    );
  }

  if (!astro) {
    return (
      <div className="card">
        <h3>Moon Calendar</h3>
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div
  className="
    group relative overflow-hidden
    rounded-3xl
    bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    border border-rose-50
    dark:border-slate-700/50
    p-6
    transition-all duration-300
    hover:border-gray-500/40
    dark:hover:border-rose-500/50
    hover:shadow-lg hover:shadow-rose-900/20 
    w-full h-full flex flex-col justify-evenly items-start
  "
>
  {/* ambient glow */}
  <div
    className="
      pointer-events-none absolute inset-0
      bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5
      dark:from-rose-500/10 dark:to-red-900/10
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500
    "
  />

  {/* Header */}
  <div className="relative z-10 w-full mb-4">
    <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Moon Calendar</h3>
  </div>

  {/* Times Grid (Sunrise, Sunset, Moonrise, Moonset) */}
  <div className="relative z-10 grid grid-cols-2 gap-3 w-full">
    {[
      { label: "Sunrise", value: astro.sunrise },
      { label: "Sunset", value: astro.sunset },
      { label: "Moonrise", value: astro.moonrise },
      { label: "Moonset", value: astro.moonset },
    ].map((item, index) => (
      <div 
        key={index}
        className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-3 border border-white/10 dark:border-slate-800"
      >
        <p className="text-[10px] uppercase tracking-tighter text-gray-500 dark:text-gray-400 font-bold">
          {item.label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
          {item.value}
        </p>
      </div>
    ))}
  </div>

  {/* Moon Phase Highlight */}
  <div
    className="
      relative z-10 mt-5 w-full
      rounded-3xl bg-gray-400/60 dark:bg-slate-950/60 
      p-4 border border-white/20 dark:border-slate-800
      flex flex-col items-center justify-center text-center
    "
  >
    <p className="text-[10px] uppercase tracking-[0.2em] text-rose-500 dark:text-rose-400 font-black mb-1">
      Current Phase
    </p>
    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
      {astro.moon_phase}
    </p>
  </div>
</div>
  );
}