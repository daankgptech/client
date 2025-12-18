import React, { useState } from "react";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const searchWord = async () => {
    // Prevent empty searches
    if (!word.trim()) return;

    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!res.ok) throw new Error("Word not found");

      const data = await res.json();
      // The API returns an array, we take the first object
      setResult(data[0]);
    } catch (err) {
      setError("No definition found");
    }
  };

  return (
   <div
  className="
    group relative overflow-hidden
    rounded-3xl
    bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    border border-rose-50
    dark:border-slate-700/50
    px-3 py-6 md:p-6
    transition-all duration-300
    hover:border-gray-500/40
    dark:hover:border-rose-500/50
    hover:shadow-lg hover:shadow-rose-900/20 
    w-full h-full flex flex-col items-start
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
    <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">Dictionary</h3>
  </div>

  {/* Search Row */}
  <div className="relative z-10 w-full flex gap-2 mb-4">
    <input
      type="text"
      value={word}
      onChange={(e) => setWord(e.target.value)}
      placeholder="Search a word"
      className="
        flex-1 bg-gray-400/40 dark:bg-slate-950/40 
        border border-white/20 dark:border-slate-800
        rounded-2xl px-2 md:px-4 py-1 md:py-2 text-sm
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-500 dark:placeholder:text-gray-600
        focus:outline-none focus:ring-2 focus:ring-rose-400/50
      "
    />
    <button 
      onClick={searchWord}
      className="
        bg-rose-400 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500
        text-white px-2 md:px-4 py-1 md:py-2 rounded-2xl text-sm font-medium
        transition-colors duration-200 shadow-sm
      "
    >
      Go
    </button>
  </div>

  {/* Error Message */}
  {error && (
    <p className="relative z-10 text-xs text-red-500 dark:text-red-400 italic mb-2">
      {error}
    </p>
  )}

  {/* Result Display */}
  {result && (
    <div 
      className="
        relative z-10 w-full
        rounded-2xl 
        bg-gray-400/40 dark:bg-slate-950/40 
        p-4 border border-white/20 dark:border-slate-800
      "
    >
      <p className="text-lg font-bold text-gray-900 dark:text-rose-400 uppercase tracking-tight">
        {result.word}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {result.meanings?.[0]?.definitions?.[0]?.definition}
      </p>
    </div>
  )}
</div>
  );
}
