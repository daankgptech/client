import React, { useEffect, useState, useRef } from "react";
import { Search, Thermometer, Wind, Droplets, Sun } from "lucide-react";

const API_KEY = "fb5cc961147f431e800115848251712";

export default function Weather({ location: defaultLocation = "Kharagpur" }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(defaultLocation);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(null);
        // Using 'forecast.json' instead of 'current.json' to get Min/Max temp
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes`
        );
        if (!res.ok) throw new Error("Location not found");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeather();
  }, [city]);

  const triggerSearch = (e) => {
    if (e) e.preventDefault();
    const val = inputRef.current.value.trim();
    if (val) {
      setCity(val);
      inputRef.current.value = "";
    }
  };

  const CardWrapper = ({ children }) => (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-50 dark:border-slate-700/50 p-6 transition-all duration-300 hover:border-gray-500/40 dark:hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-900/20 w-full h-full flex flex-col justify-evenly items-start">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5 dark:from-rose-500/10 dark:to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </div>
  );

  return (
    <CardWrapper>
      <div className="relative z-10 w-full flex justify-between items-start gap-2">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Weather</h3>
          <p className="mt-1 text-gray-800 dark:text-gray-300 text-sm font-medium">
            {weather ? `${weather.location.name}, ${weather.location.region}` : "Loading..."}
          </p>
        </div>
        
        <form onSubmit={triggerSearch} className="relative flex items-center">
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="w-24 sm:w-32 bg-white/20 dark:bg-slate-950/40 border border-white/10 dark:border-slate-800 rounded-xl pl-2 pr-8 py-1.5 text-[11px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all"
          />
          <button type="submit" className="absolute right-2 text-gray-500 hover:text-rose-500 transition-colors">
            <Search size={14} />
          </button>
        </form>
      </div>

      {error ? (
        <div className="relative z-10 w-full mt-2">
          <p className="text-[10px] text-red-500 font-bold uppercase italic">{error}</p>
          <button onClick={() => setCity(defaultLocation)} className="text-[9px] underline text-gray-400">Back to {defaultLocation}</button>
        </div>
      ) : weather ? (
        <>
          <div className="relative z-10 mt-4 flex items-center gap-4 w-full">
            <img src={weather.current.condition.icon} alt="icon" className="w-16 h-16 drop-shadow-lg" />
            <div className="flex-1">
              <p className="text-4xl sm:text-5xl font-semibold text-rose-400 dark:text-rose-500 tabular-nums tracking-tight leading-none">
                {Math.round(weather.current.temp_c)}°C
              </p>
              {/* Min/Max Temperature Display */}
              <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mt-1">
                H: {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}° • 
                L: {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°
              </p>
            </div>
          </div>

          <p className="relative z-10 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2">
            Feels {Math.round(weather.current.feelslike_c)}°C • {weather.current.condition.text}
          </p>

          <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 w-full">
            <div className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
              <p className="text-gray-900 dark:text-gray-100 font-bold text-[10px]">{weather.current.humidity}%</p>
              <p className="text-[8px] text-gray-500 uppercase">Humid</p>
            </div>
            <div className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
              <p className="text-gray-900 dark:text-gray-100 font-bold text-[10px]">{weather.current.uv}</p>
              <p className="text-[8px] text-gray-500 uppercase">UV</p>
            </div>
            <div className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800">
              <p className="text-gray-900 dark:text-gray-100 font-bold text-[10px]">{weather.current.pressure_mb}</p>
              <p className="text-[8px] text-gray-500 uppercase">hPa</p>
            </div>
            <div className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800 col-span-1">
              <p className="text-gray-900 dark:text-gray-100 font-bold text-[10px]">{weather.current.wind_kph} <span className="text-[7px]">kmh</span></p>
              <p className="text-[8px] text-gray-500 uppercase">Wind</p>
            </div>
            <div className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 p-2 text-center border dark:border-slate-800 col-span-2 flex items-center justify-center gap-2">
              <span className="text-[8px] text-gray-500 uppercase">Wind Dir:</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-[10px]">{weather.current.wind_dir}</span>
            </div>
          </div>
        </>
      ) : null}
    </CardWrapper>
  );
}