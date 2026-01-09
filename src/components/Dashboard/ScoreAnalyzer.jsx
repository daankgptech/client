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
      }))
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
        group relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border border-rose-50 dark:border-slate-700/50
        p-6 transition-all duration-300
        hover:border-gray-500/40 dark:hover:border-rose-500/50
        hover:shadow-lg hover:shadow-rose-900/20
        w-full
      "
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-rose-100/5 via-transparent to-red-500/5
          dark:from-rose-500/10 dark:to-red-900/10
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        "
      />

      {/* Header */}
      <div className="relative z-10 mb-4 flex justify-between items-center">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold">
          Score Analyzer
        </h3>{" "}
        {/* Info Tooltip */}
        <div className="relative">
          <div className="relative inline-block">
            <span
              className="peer cursor-pointer select-none
          text-gray-500 dark:text-gray-400
          hover:text-gray-900 dark:hover:text-gray-100
          text-sm
      "
            >
              📌
            </span>
            {/* Hover Popup */}
            <div
              className="pointer-events-none
          absolute -right-5 top-0 w-56
          opacity-0 scale-95
          peer-hover:opacity-100 peer-hover:scale-100
          transition-all duration-500 ease-out
          rounded-2xl
          bg-gray-300 dark:bg-slate-900
          border border-white dark:border-slate-800
          px-2 py-1
          text-xs leading-relaxed
          text-gray-900 dark:text-gray-300
          shadow-xl
          z-50"
            >
              <p>
                A basic, not actual, estimated visualization based solely on the
                SGPA values you enter assuming equal weight across semesters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="relative z-10 grid grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {sgpas.map((sgpa, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-400/30 dark:bg-slate-950/40 px-2 py-1 border border-white/10 dark:border-slate-800"
          >
            <p className="text-[10px] uppercase tracking-tight text-gray-500 dark:text-gray-400 font-bold mb-1">
              Sem {i + 1}
            </p>
            <input
              type="number"
              step="0.01"
              min="1"
              max="10"
              // autoFocus
              value={sgpa}
              onChange={(e) => updateSGPA(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSemester();
                }
              }}
              className="
                w-full bg-transparent outline-none
                text-sm font-semibold tabular-nums
                text-gray-900 dark:text-gray-100
              "
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="relative z-10 flex justify-evenly items-center gap-2 mb-5">
        <button
          onClick={addSemester}
          title="Add more SGPAs"
          className="px-3 py-1 rounded-full text-xs bg-green-200 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:scale-110 transition-all duration-300"
        >
          +
        </button>
        <button
          onClick={removeSemester}
          title="Remove Last SGPA"
          className="px-3 py-1 rounded-full text-xs bg-red-200 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:scale-110 transition-all duration-300"
        >
          -
        </button>
      </div>

      {/* Chart */}
      <div className="relative z-10 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />

            {/* Zones */}
            <ReferenceArea
              y1={8}
              y2={10}
              fill="#BBF7D0"
              fillOpacity={0.6}
              label={{ value: "Green Zone", fill: "#16A34A", fontSize: 12 }}
            />
            <ReferenceArea
              y1={6.5}
              y2={8}
              fill="#FEF08A"
              fillOpacity={0.6}
              label={{ value: "Yellow Zone", fill: "#CA8A04", fontSize: 12 }}
            />
            <ReferenceArea
              y1={0}
              y2={6.5}
              fill="#FECACA"
              fillOpacity={0.6}
              label={{ value: "Red Zone", fill: "#DC2626", fontSize: 12 }}
            />

            {/* Threshold lines */}
            <ReferenceLine
              y={8}
              stroke="#EAB308"
              strokeDasharray="5 5"
              label={{ value: "8.0", fill: "#EAB308", fontSize: 12 }}
            />
            <ReferenceLine
              y={6.5}
              stroke="#DC2626"
              strokeDasharray="5 5"
              label={{ value: "6.5", fill: "#DC2626", fontSize: 12 }}
            />

            <Area
              type="monotone"
              dataKey="sgpa"
              stroke="#0284C7"
              fill="#BAE6FD"
              name="SGPA"
            />
            <Area
              type="monotone"
              dataKey="cgpa"
              stroke="#7C3AED"
              fill="#DDD6FE"
              name="CGPA"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
