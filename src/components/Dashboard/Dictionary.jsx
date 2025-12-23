import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaSpinner,
  FaTimes,
  FaVolumeUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meaningIndex, setMeaningIndex] = useState(0);
  const [recent, setRecent] = useState([]);

  /* load recent searches */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentWords") || "[]");
    setRecent(saved);
  }, []);

  const saveRecent = (w) => {
    const updated = [w, ...recent.filter((r) => r !== w)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recentWords", JSON.stringify(updated));
  };

  const searchWord = async () => {
    if (!word.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setMeaningIndex(0);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data[0]);
      saveRecent(data[0].word);
    } catch {
      setError("No definition found");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const audioUrl = result?.phonetics?.find((p) => p.audio)?.audio;
    if (audioUrl) new Audio(audioUrl).play();
  };

  const meanings = result?.meanings || [];
  const currentMeaning = meanings[meaningIndex];

  return (
    <div className="
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
    w-full h-full flex flex-col justify-evenly items-start">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0
      bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5
      dark:from-rose-500/10 dark:to-red-900/10
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500" />

      {/* Header */}
      <h3 className="relative z-10 text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold mb-4">
        Dictionary
      </h3>

      {/* Search */}
      <div className="relative z-10 w-full flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            value={word}
            disabled={loading}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchWord()}
            placeholder="Search a word"
            className="flex-1 bg-gray-400/40 dark:bg-slate-950/40 
        border border-white/20 dark:border-slate-800
        rounded-2xl px-2 md:px-4 py-1 md:py-2 text-sm
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-500 dark:placeholder:text-gray-600
        focus:outline-none focus:ring-2 focus:ring-rose-400/50 w-full transition-all duration-300
      "
          />
          {word && (
            <button
              onClick={() => setWord("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-500"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <button
          onClick={searchWord}
          disabled={loading}
          className="bg-rose-400 hover:bg-rose-500 dark:bg-rose-600 text-white px-3 rounded-2xl transition"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
        </button>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 mb-3 text-xs">
          {recent.map((r) => (
            <button
              key={r}
              onClick={() => {
                setWord(r);
                setTimeout(searchWord, 0);
              }}
              className="px-3 py-1 rounded-full bg-gray-300/60 dark:bg-slate-800 hover:bg-rose-400/30 transition"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Loader bar */}
      {loading && (
        <div className="w-full h-1 rounded-full bg-gray-300 dark:bg-slate-700 overflow-hidden mb-3">
          <div className="h-full w-1/3 bg-gradient-to-r from-rose-400 to-red-500 animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 italic mb-2 relative z-10">
          {error}
        </p>
      )}

      {/* Result */}
      {result && currentMeaning && (
        <div className="relative z-10 w-full rounded-2xl bg-gray-400/40 dark:bg-slate-950/40 p-4 border border-white/20 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900 dark:text-rose-400 uppercase">
              {result.word}
            </p>
            {result.phonetics?.some((p) => p.audio) && (
              <button
                onClick={playAudio}
                className="text-rose-500 hover:scale-110 transition"
              >
                <FaVolumeUp />
              </button>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {currentMeaning.definitions?.[0]?.definition}
          </p>

          {/* Carousel */}
          {meanings.length > 1 && (
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <button
                disabled={meaningIndex === 0}
                onClick={() => setMeaningIndex((i) => i - 1)}
              >
                <FaChevronLeft />
              </button>
              <span>
                {meaningIndex + 1} / {meanings.length}
              </span>
              <button
                disabled={meaningIndex === meanings.length - 1}
                onClick={() => setMeaningIndex((i) => i + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
