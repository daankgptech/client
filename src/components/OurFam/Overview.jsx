import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/Secure/api";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";
import { useAuth } from "../../utils/Secure/AuthContext";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { Wrench } from "lucide-react";
import { LuLayers } from "react-icons/lu";

const REDS = ["#f43f5e", "#fb7185", "#e11d48", "#be123c"];

const Overview = ({ batchDataMap, goToYear }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({
    BranchWise: [],
    HallWise: [],
    BatchWise: [],
    GenderWise: [],
    COEWise: [],
  });
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const [sortHallAsc, setSortHallAsc] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/our-fam/overview")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const sortedBranch = useMemo(() => {
    return [...data.BranchWise].sort((a, b) =>
      sortAsc ? a.count - b.count : b.count - a.count,
    );
  }, [data.BranchWise, sortAsc]);

  const totalBranch = data.BranchWise.reduce(
    (sum, b) => sum + Number(b.count),
    0,
  );

  const sortedHall = useMemo(() => {
    return [...data.HallWise].sort((a, b) =>
      sortHallAsc ? a.count - b.count : b.count - a.count,
    );
  }, [data.HallWise, sortHallAsc]);

  const totalHall = data.HallWise.reduce((sum, h) => sum + Number(h.count), 0);

  if (loading) return <LoaderOverlay />;

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300 px-4 py-8 container">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <LuLayers className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Overview
          </h1>
        </div>
      </div>

      {/* Gender & Batch Wise Strength Pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto mb-10 px-2 md:container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
    w-full h-full
    flex flex-col items-center justify-between
    p-3 sm:p-4
    rounded-xl
    border border-gray-200 dark:border-gray-800
    bg-white dark:bg-gray-900
    transition-all duration-150
  "
        >
          {/* Header */}
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">
            Gender Distribution
          </h2>

          {/* Chart */}
          <div className="w-full flex justify-center items-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={data.GenderWise}
                  dataKey="count"
                  nameKey="gender"
                  outerRadius={70}
                  innerRadius={35} // donut style (cleaner)
                  paddingAngle={2}
                >
                  {data.GenderWise.map((_, i) => (
                    <Cell key={i} fill={REDS[i % REDS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend (minimal inline) */}
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-[10px] text-gray-500 dark:text-gray-400">
            {data.GenderWise.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: REDS[i % REDS.length] }}
                />
                <span>{item.gender}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
    w-full
    p-3 sm:p-4
    rounded-xl
    border border-gray-200 dark:border-gray-800
    bg-white dark:bg-gray-900
    transition-all duration-150
  "
        >
          {/* Header */}
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
            Batch Wise Strength
          </h2>

          {/* Chart */}
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.BatchWise}>
                <XAxis
                  dataKey="batch"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* Hidden Y-axis */}
                <YAxis hide domain={[0, 60]} />

                <Tooltip
                  cursor={{ fill: "rgba(244,63,94,0.08)" }}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />

                {/* subtle reference lines */}
                {[15, 30, 45, 60].map((value) => (
                  <ReferenceLine
                    key={value}
                    y={value}
                    stroke="#fda4af"
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                ))}

                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* COE Distribution  */}
      <div className="w-full px-2 md:container mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="
      w-full
      rounded-xl
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      p-3
    "
        >
          {/* Header */}
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            COE Wise Distribution
          </h2>

          {/* Chart */}
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.COEWise}>
                <XAxis
                  dataKey="coe"
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickFormatter={(v) =>
                    v.length > 10 ? v.slice(0, 10) + "…" : v
                  }
                />

                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />

                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                  cursor={{ stroke: "#ef4444", strokeWidth: 1 }}
                />

                {/* subtle reference lines */}
                {[20, 40, 60].map((value) => (
                  <ReferenceLine
                    key={value}
                    y={value}
                    stroke="#e5e7eb"
                    strokeDasharray="3 3"
                  />
                ))}

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Branch & Hall Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:container">
        {/* Branch */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="
    w-full
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    p-3
  "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Branch Wise
            </h2>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="
        px-2 py-0.5
        text-xs
        rounded-md
        border border-gray-300 dark:border-gray-700
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors
      "
            >
              {sortAsc ? "↑" : "↓"}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="py-1.5 px-2 text-left font-medium">Branch</th>
                  <th className="py-1.5 px-2 text-left font-medium">Count</th>
                </tr>
              </thead>

              <tbody>
                {sortedBranch.map((b, i) => (
                  <tr
                    key={i}
                    className="
              border-b border-gray-100 dark:border-gray-800
              hover:bg-gray-50 dark:hover:bg-gray-800/60
              transition-colors
            "
                  >
                    <td className="py-1.5 px-2 text-gray-800 dark:text-gray-200">
                      {b.branch}
                    </td>

                    <td className="py-1.5 px-2">
                      <span
                        className="
                  px-2 py-0.5
                  text-[10px]
                  rounded-md
                  bg-gray-100 dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                "
                      >
                        {b.count}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="text-gray-700 dark:text-gray-300 font-medium">
                  <td className="py-2 px-2">Total</td>
                  <td className="py-2 px-2">{totalBranch}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Hall */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="
    w-full
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    p-3
  "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Hall Wise
            </h2>

            <button
              onClick={() => setSortHallAsc(!sortHallAsc)}
              className="
        px-2 py-0.5
        text-xs
        rounded-md
        border border-gray-300 dark:border-gray-700
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors
      "
            >
              {sortHallAsc ? "↑" : "↓"}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="py-1.5 px-2 text-left font-medium">Hall</th>
                  <th className="py-1.5 px-2 text-left font-medium">Count</th>
                </tr>
              </thead>

              <tbody>
                {sortedHall.map((h, i) => (
                  <tr
                    key={i}
                    className="
              border-b border-gray-100 dark:border-gray-800
              hover:bg-gray-50 dark:hover:bg-gray-800/60
              transition-colors
            "
                  >
                    <td className="py-1.5 px-2 text-gray-800 dark:text-gray-200">
                      {h.hall}
                    </td>

                    <td className="py-1.5 px-2">
                      <span
                        className="
                  px-2 py-0.5
                  text-[10px]
                  rounded-md
                  bg-gray-100 dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                "
                      >
                        {h.count}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="text-gray-700 dark:text-gray-300 font-medium">
                  <td className="py-2 px-2">Total</td>
                  <td className="py-2 px-2">{totalHall}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Batches */}
      <div className="w-full text-center mt-4 flex flex-col">
        {isAuthenticated ? (
          <>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Select Year
            </h2>

            {/* horizontal scroll */}
            <div className="flex gap-2 justify-start md:justify-center overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {Object.keys(batchDataMap)
                .sort((a, b) => b - a)
                .map((y) => (
                  <button
                    key={y}
                    onClick={() => goToYear(Number(y))}
                    className="
                shrink-0
                px-4 py-1.5
                text-xs font-medium
                rounded-md
                border border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-900
                text-gray-700 dark:text-gray-300
                transition-all duration-150

                hover:bg-rose-500 hover:text-white
                hover:border-rose-500
                active:scale-95 
              "
                  >
                    {batchDataMap[y].label}
                  </button>
                ))}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 italic">
              Detailed access restricted to DAAN-KGPians
            </p>

            <Link
              to="/signin"
              className="
          inline-block
          px-3 py-1.5
          text-xs font-medium
          rounded-md
          border border-rose-400
          text-rose-600
          bg-white dark:bg-gray-900
          transition-all duration-150

          hover:bg-rose-500 hover:text-white
          active:scale-95
        "
            >
              🔒 Sign In
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Overview;
