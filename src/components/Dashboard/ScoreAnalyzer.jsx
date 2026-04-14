import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

const STORAGE_KEY = "score_analyzer_data";

const calculateCGPA = (sgpas) => {
  let sum = 0;
  return sgpas.map((sgpa, index) => {
    sum += sgpa;
    return +(sum / (index + 1)).toFixed(2);
  });
};

export default function ScoreAnalyzer() {
  const [sgpas, setSgpas] = useState(["7.50"]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSgpas(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const numeric = sgpas.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    const cgpas = calculateCGPA(numeric);

    setData(
      numeric.map((sgpa, i) => ({
        semester: `Sem ${i + 1}`,
        sgpa,
        cgpa: cgpas[i],
      })),
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sgpas));
  }, [sgpas]);

  const updateSGPA = (index, value) => {
    if (value === "") {
      const next = [...sgpas];
      next[index] = "";
      setSgpas(next);
      return;
    }

    const num = Number(value);
    if (isNaN(num) || num < 1 || num > 10) return;

    const next = [...sgpas];
    next[index] = value;
    setSgpas(next);
  };

  const addSemester = () => setSgpas([...sgpas, ""]);
  const removeSemester = () => sgpas.length > 1 && setSgpas(sgpas.slice(0, -1));

  return (
    <div
      className="
    w-full
    flex flex-col gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    transition-colors duration-150
  "
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          Score Analyzer
        </h3>

        {/* Tooltip */}
        <div className="relative group">
          <span className="text-xs text-gray-400 cursor-pointer">📌</span>

          <div
            className="
          absolute right-0 top-5 w-56
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-200
          rounded-lg
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          px-2 py-1
          text-[10px]
          text-gray-700 dark:text-gray-300
          shadow-md
          z-50
        "
          >
            A basic, estimated visualization based on SGPA values assuming equal
            weight.
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
        {sgpas.map((sgpa, i) => (
          <div
            key={i}
            className="
          rounded-lg
          bg-gray-50 dark:bg-gray-800
          px-2 py-1
          border border-gray-200 dark:border-gray-700
        "
          >
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              Sem {i + 1}
            </p>

            <input
              type="number"
              step="0.01"
              min="1"
              max="10"
              value={sgpa}
              onChange={(e) => updateSGPA(i, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSemester()}
              className="
            w-full bg-transparent outline-none
            text-sm font-medium tabular-nums
            text-gray-900 dark:text-gray-100
          "
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={addSemester}
          className="
        px-3 py-1 text-xs rounded-md
        bg-green-100 dark:bg-green-900/30
        text-green-600 dark:text-green-400
        hover:opacity-80 transition
      "
        >
          +
        </button>

        <button
          onClick={removeSemester}
          className="
        px-3 py-1 text-xs rounded-md
        bg-red-100 dark:bg-red-900/30
        text-red-600 dark:text-red-400
        hover:opacity-80 transition
      "
        >
          -
        </button>
      </div>

      {/* Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />

            {/* Zones */}
            <ReferenceArea y1={8} y2={10} fill="#DCFCE7" />
            <ReferenceArea y1={6.5} y2={8} fill="#FEF9C3" />
            <ReferenceArea y1={0} y2={6.5} fill="#FEE2E2" />

            {/* Lines */}
            <ReferenceLine y={8} strokeDasharray="4 4" />
            <ReferenceLine y={6.5} strokeDasharray="4 4" />

            <Area
              type="monotone"
              dataKey="sgpa"
              stroke="#6366F1"
              fill="#C7D2FE"
            />
            <Area
              type="monotone"
              dataKey="cgpa"
              stroke="#8B5CF6"
              fill="#E9D5FF"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
