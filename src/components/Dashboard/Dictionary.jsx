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
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
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
    <div
      className="
    w-full h-full flex flex-col gap-3
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    rounded-xl p-4
  "
    >
      {/* header */}
      <h3 className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
        Dictionary
      </h3>

      {/* search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={word}
            disabled={loading}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchWord()}
            placeholder="Search"
            className="
          w-full px-3 py-1.5 text-[12px]
          rounded-md
          bg-gray-50 dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          text-gray-800 dark:text-gray-100
          outline-none
          focus:border-rose-500
        "
          />

          {word && (
            <button
              onClick={() => setWord("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <button
          onClick={searchWord}
          disabled={loading}
          className="
        px-3 py-1.5
        rounded-md
        bg-rose-500 text-white
        hover:bg-rose-600
        text-[12px]
      "
        >
          {loading ? "..." : <FaSearch size={12} />}
        </button>
      </div>

      {/* recent */}
      {recent.length > 0 && (
        <div className="flex flex-wrap gap-1 text-[11px]">
          {recent.map((r) => (
            <button
              key={r}
              onClick={() => {
                setWord(r);
                setTimeout(searchWord, 0);
              }}
              className="
            px-2 py-0.5 rounded-md
            bg-gray-100 dark:bg-gray-800
            text-gray-600 dark:text-gray-300
          "
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* loading */}
      {loading && (
        <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="w-1/3 h-full bg-rose-500 animate-pulse" />
        </div>
      )}

      {/* error */}
      {error && <p className="text-[11px] text-rose-500">{error}</p>}

      {/* result */}
      {result && currentMeaning && (
        <div
          className="
        border border-gray-200 dark:border-gray-800
        rounded-md p-3
        bg-gray-50 dark:bg-gray-800
        space-y-2
      "
        >
          <div className="flex justify-between items-center">
            <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
              {result.word}
            </p>

            {result.phonetics?.some((p) => p.audio) && (
              <button
                onClick={playAudio}
                className="text-gray-400 hover:text-rose-500"
              >
                <FaVolumeUp size={12} />
              </button>
            )}
          </div>

          <p className="text-[12px] text-gray-600 dark:text-gray-300">
            {currentMeaning.definitions?.[0]?.definition}
          </p>

          {/* meanings */}
          {meanings.length > 1 && (
            <div className="flex justify-between items-center text-[11px] text-gray-400">
              <button
                disabled={meaningIndex === 0}
                onClick={() => setMeaningIndex((i) => i - 1)}
              >
                <FaChevronLeft size={10} />
              </button>

              <span>
                {meaningIndex + 1}/{meanings.length}
              </span>

              <button
                disabled={meaningIndex === meanings.length - 1}
                onClick={() => setMeaningIndex((i) => i + 1)}
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
