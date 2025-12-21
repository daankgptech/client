import {
  COEWise,
  HallWise,
  BranchWise,
  BatchWise,
  GenderWise,
} from "./JSFiles/Overview";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "recharts";
import { useState, useMemo } from "react";
import ProtectedRoute from "../Secure/ProtectedRoute";
const REDS = ["#f43f5e", "#fb7185", "#e11d48", "#be123c"]; // rose/red shades

const Overview = ({ batchDataMap, goToYear }) => {
  const [sortAsc, setSortAsc] = useState(false);
  const [sortHallAsc, setSortHallAsc] = useState(false);
  const navigate = useNavigate();

  // Sorted data
  const sortedData = useMemo(() => {
    return [...BranchWise].sort((a, b) =>
      sortAsc ? a.count - b.count : b.count - a.count
    );
  }, [BranchWise, sortAsc]);

  // Total count
  const totalCount = BranchWise.reduce((sum, b) => sum + Number(b.count), 0);
  // Sorted hall data
  const sortedHallData = useMemo(() => {
    return [...HallWise].sort((a, b) =>
      sortHallAsc ? a.count - b.count : b.count - a.count
    );
  }, [HallWise, sortHallAsc]);

  // Total hall count
  const totalHallCount = HallWise.reduce(
    (sum, hall) => sum + Number(hall.count),
    0
  );
  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300 px-4 py-8 container">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-10"
      >
        Overview
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
        {/* Gender Wise */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Gender Distribution
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={GenderWise}
                  dataKey="count"
                  nameKey="gender"
                  // innerRadius={70}
                  outerRadius={100}
                >
                  {GenderWise.map((_, i) => (
                    <Cell key={i} fill={REDS[i % REDS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Batch Wise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Batch Wise Strength
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={BatchWise}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="container ">
        {/* COE Wise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-10 w-full"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            COE Wise Distribution
          </h2>

          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={COEWise}>
              <XAxis
                dataKey="coe"
                angle={-45}
                textAnchor="end"
                tickLine={false}
                axisLine={true}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                height={80}
                interval={0}
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip cursor={{ stroke: "#fb7185", strokeWidth: 1 }} />
              <Line
                // type="monotone"
                type="natural"
                dataKey="count"
                stroke="#fb7185"
                strokeWidth={3}
                dot={{ r: 3, fill: "#f43f5e" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
        {/* Branch Wise Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-center flex-1">
              Branch Wise
            </h2>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-red-300 dark:bg-rose-700 hover:bg-rose-400 dark:hover:bg-rose-500 text-gray-900 dark:text-gray-100 transition-all"
            >
              {/* Sort */}
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
                {sortedData.map((b, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                  group cursor-pointer
                  ${
                    i % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-900/40"
                      : "bg-rose-100/40 dark:bg-rose-900/20"
                  }
                  hover:bg-rose-300/60 dark:hover:bg-rose-800/40
                  transition-all duration-200
                `}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      <span className="group-hover:text-red-700 dark:group-hover:text-rose-300 transition-colors">
                        {b.branch}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 dark:bg-red-900 dark:text-rose-200">
                        {b.count}
                      </span>
                    </td>
                  </motion.tr>
                ))}

                {/* Total row */}
                <tr className="bg-gray-300 dark:bg-gray-700 font-semibold">
                  <td className="py-3 px-4 text-left">Total</td>
                  <td className="py-3 px-4">{totalCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Hall Wise Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-10"
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
                {sortedHallData.map((h, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                  group cursor-pointer
                  ${
                    i % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-900/40"
                      : "bg-rose-100/40 dark:bg-rose-900/20"
                  }
                  hover:bg-rose-300/60 dark:hover:bg-rose-800/40
                  transition-all duration-200
                `}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      <span className="group-hover:text-red-700 dark:group-hover:text-rose-300 transition-colors">
                        {h.hall}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 dark:bg-red-900 dark:text-rose-200">
                        {h.count}
                      </span>
                    </td>
                  </motion.tr>
                ))}

                {/* Total row */}
                <tr className="bg-gray-300 dark:bg-gray-700 font-semibold">
                  <td className="py-3 px-4 text-left">Total</td>
                  <td className="py-3 px-4">{totalHallCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Year Selector */}
      <h2 className="text-xl font-bold text-center mb-4">Select a Year</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {Object.keys(batchDataMap)
          .sort((a, b) => b - a)
          .map((y) => (
            <ProtectedRoute
              fallback={
                <button
                  onClick={() => navigate("/signin")}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 bg-gray-300 text-gray-800 hover:bg-rose-400 hover:text-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-rose-600"
              >
                  {batchDataMap[y].label}
                </button>
              }
            >
              <button
                key={y}
                onClick={() => goToYear(Number(y))}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 bg-gray-300 text-gray-800 hover:bg-rose-400 hover:text-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-rose-600"
              >
                {batchDataMap[y].label}
              </button>
            </ProtectedRoute>
          ))}
      </div>
    </section>
  );
};

export default Overview;
