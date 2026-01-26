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
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-semibold container">
          Overview
        </h1>
      </div>

      {/* Gender Pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  mx-auto mb-10 md:container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-transparent p-6 flex flex-col justify-start items-center  h-full"
          // className="bg-gray-200 dark:bg-gray-800 rounded-3xl p-6 flex flex-col items-center"
        >
          <h2 className="text-xl font-semibold mb-4 text-center ">
            Gender Distribution
          </h2>

          <div className="flex justify-end items-center  h-full">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={data.GenderWise}
                  dataKey="count"
                  nameKey="gender"
                  outerRadius={100}
                  cx="50%"
                  cy="50%"
                >
                  {data.GenderWise.map((_, i) => (
                    <Cell key={i} fill={REDS[i % REDS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent p-6"
          // className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Batch Wise Strength
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.BatchWise}>
              <XAxis dataKey="batch" />
              {/* Hidden Y-axis for scaling */}
              <YAxis hide domain={[0, 60]} />
              <Tooltip />
              {/* Measuring lines */}
              {[15, 30, 45, 60].map((value) => (
                <ReferenceLine
                  key={value}
                  y={value}
                  stroke="#DC2626"
                  strokeDasharray="4 4"
                  label={{
                    value,
                    position: "right",
                    fill: "#DC2626",
                    opacity: 1.0,
                    fontSize: 12,
                    textAnchor: "Shani",
                  }}
                  name={value}
                />
              ))}
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:container mx-auto mb-10">
        {/* COE Line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent rounded-2xl p-2 md:p-4 lg:p-6 w-full max-w-6xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            COE Wise Distribution
          </h2>
          <div className="w-full overflow-x-hidden">
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={data.COEWise}>
                <XAxis
                  dataKey="coe"
                  angle={-30}
                  textAnchor="middle"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(v) =>
                    v.length > 10 ? v.slice(0, 10) + "…" : v
                  }
                />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip cursor={{ stroke: "#fb7185", strokeWidth: 1 }} />
                {[20, 40, 60].map((value) => (
                  <ReferenceLine
                    key={value}
                    y={value}
                    stroke="#DC2626"
                    strokeDasharray="4 4"
                    label={{
                      value,
                      position: "right",
                      fill: "#DC2626",
                      opacity: 1.0,
                      fontSize: 12,
                      textAnchor: "start",
                    }}
                    name={value}
                  />
                ))}
                <Line
                  type="natural"
                  dataKey="count"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#f43f5e" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Branch & Hall Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
        {/* Branch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-center flex-1">
              Branch Wise
            </h2>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-red-300 dark:bg-rose-700 hover:bg-rose-400 dark:hover:bg-rose-500 text-gray-900 dark:text-gray-100 transition-all"
            >
              {sortAsc ? "⬆" : "⬇"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Branch</th>
                  <th className="py-3 px-4 text-left rounded-tr-lg">Count</th>
                </tr>
              </thead>
              <tbody>
                {sortedBranch.map((b, i) => (
                  <tr
                    key={i}
                    className={`group cursor-pointer ${
                      i % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-900/40"
                        : "bg-rose-100/40 dark:bg-rose-900/20"
                    } hover:bg-rose-300/60 dark:hover:bg-rose-800/40 transition-all duration-200`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {b.branch}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 dark:bg-red-900 dark:text-rose-200">
                        {b.count}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 dark:bg-gray-700 font-semibold">
                  <td className="py-3 px-4 text-left">Total</td>
                  <td className="py-3 px-4">{totalBranch}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Hall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex-1 text-center">
              Hall Wise
            </h2>
            <button
              onClick={() => setSortHallAsc(!sortHallAsc)}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-red-300 dark:bg-rose-700 hover:bg-rose-400 dark:hover:bg-rose-500 text-gray-900 dark:text-gray-100 transition-all"
            >
              {sortHallAsc ? "⬆" : "⬇"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Hall</th>
                  <th className="py-3 px-4 text-left rounded-tr-lg">Count</th>
                </tr>
              </thead>
              <tbody>
                {sortedHall.map((h, i) => (
                  <tr
                    key={i}
                    className={`group cursor-pointer ${
                      i % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-900/40"
                        : "bg-rose-100/40 dark:bg-rose-900/20"
                    } hover:bg-rose-300/60 dark:hover:bg-rose-800/40 transition-all duration-200`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {h.hall}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 dark:bg-red-900 dark:text-rose-200">
                        {h.count}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 dark:bg-gray-700 font-semibold">
                  <td className="py-3 px-4 text-left">Total</td>
                  <td className="py-3 px-4">{totalHall}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <div className="w-full text-center mt-4">
      {isAuthenticated ? (
        <>
          {" "}
          {/* Wrapping in a Fragment fixes the "multiple root elements" error */}
          <h2 className="text-xl font-bold text-center mt-6 mb-4">
            Select a Year
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.keys(batchDataMap)
              .sort((a, b) => b - a)
              .map((y) => (
                <button
                  key={y}
                  onClick={() => goToYear(Number(y))}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
            bg-gray-300 text-gray-800
            hover:bg-rose-400 hover:text-white
            dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-rose-600"
                >
                  {batchDataMap[y].label}
                </button>
              ))}
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 italic">
            Detailed access restricted to DAAN-KGPians
          </p>
          <Link
            to="/signin"
            className="inline-block p-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            🔒 Sign In to View More
          </Link>
        </div>
      )}</div>
    </section>
  );
};

export default Overview;
