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
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes`,
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
    <div
      className="
    w-full h-full flex flex-col gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    hover:border-gray-400 dark:hover:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
  "
    >
      {children}
    </div>
  );

  return (
    <div
      className="
    w-full h-full flex flex-col justify-between gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    hover:border-rose-400
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
  "
    >
      {/* top */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
            Weather
          </h3>

          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            {weather
              ? `${weather.location.name}, ${weather.location.region}`
              : "Loading..."}
          </p>
        </div>

        <form onSubmit={triggerSearch} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="
          w-20 bg-gray-100 dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-md px-2 py-1 text-[10px]
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400
          focus:outline-none
        "
          />
          <button
            type="submit"
            className="absolute right-1 text-gray-400 hover:text-rose-500"
          >
            <Search size={12} />
          </button>
        </form>
      </div>

      {/* error */}
      {error && <p className="text-[10px] text-red-500">{error}</p>}

      {/* main */}
      {weather && (
        <>
          <div className="flex items-center gap-3">
            <img
              src={weather.current.condition.icon}
              alt="icon"
              className="w-10 h-10"
            />

            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(weather.current.temp_c)}°
              </p>

              <p className="text-[10px] text-gray-500">
                H {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}° •
                L {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°
              </p>
            </div>
          </div>

          {/* condition */}
          <p className="text-[10px] text-gray-500">
            {weather.current.condition.text}
          </p>

          {/* mini stats */}
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>{weather.current.humidity}%</span>
            <span>•</span>
            <span>{weather.current.wind_kph} km/h</span>
            <span>•</span>
            <span>UV {weather.current.uv}</span>
          </div>
        </>
      )}
    </div>
  );
}
