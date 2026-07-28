import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";
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
import { LuLayers } from "react-icons/lu";
import { FiChevronDown } from "react-icons/fi";
import { Breadcrumbs, seoConfig } from "../../utils/SEO";

const REDS = ["#e11d48", "#f43f5e", "#fb7185", "#be123c", "#9f1239"];

const Overview = ({ batchDataMap, goToYear }) => {
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
  const [showAllBranch, setShowAllBranch] = useState(false);
  const [showAllHall, setShowAllHall] = useState(false);
  const [isBranchExpanded, setIsBranchExpanded] = useState(false);
  const [isHallExpanded, setIsHallExpanded] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const cached = cache.get("/our-fam/overview");
        if (cached && cached.BatchWise) {
          setData(cached);
          setLoading(false);
          return;
        }
        const res = await api.get("/our-fam/overview");
        if (res.data && res.data.BatchWise) {
          setData(res.data);
          cache.set("/our-fam/overview", res.data, 10 * 60 * 1000);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
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
    <div className="min-h-screen transition-colors duration-300">
      <section className="container mx-auto py-12">
        {/* Header matching Forms / Toolkit page layout */}
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.ourFam.breadcrumbs} />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Overview
          </h1>
        </div>

        {/* Gender & Batch Wise Strength Pie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-between p-5 bg-transparent border-[0.5px] border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Header */}
            <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-2 text-center">
              Gender Distribution
            </h2>

            {/* Chart */}
            <div className="w-full flex justify-center items-center py-2">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={data.GenderWise}
                    dataKey="count"
                    nameKey="gender"
                    outerRadius={75}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {data.GenderWise.map((_, i) => (
                      <Cell key={i} fill={REDS[i % REDS.length]} stroke="rgba(255,255,255,0.1)" />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#000",
                      border: "0.5px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "12px",
                      fontFamily: "Space Grotesk",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs font-space-grotesk text-white/60">
              {data.GenderWise.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2"
                    style={{ backgroundColor: REDS[i % REDS.length] }}
                  />
                  <span>{item.gender}: {item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-5 bg-transparent border-[0.5px] border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Header */}
            <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-3 text-center">
              Batch Wise Strength
            </h2>

            {/* Chart */}
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.BatchWise}>
                  <XAxis
                    dataKey="batch"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Space Grotesk" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />

                  <YAxis hide domain={[0, 60]} />

                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      background: "#000",
                      border: "0.5px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "12px",
                      fontFamily: "Space Grotesk",
                    }}
                  />

                  {[15, 30, 45, 60].map((value) => (
                    <ReferenceLine
                      key={value}
                      y={value}
                      stroke="rgba(255,255,255,0.1)"
                      strokeDasharray="3 3"
                    />
                  ))}

                  <Bar dataKey="count" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* COE Distribution */}
        <div className="w-full mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-transparent border-[0.5px] border-white/10 hover:border-white/20 p-5 transition-all duration-300"
          >
            {/* Header */}
            <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-3">
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
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Space Grotesk" }}
                    tickFormatter={(v) =>
                      v.length > 10 ? v.slice(0, 10) + "…" : v
                    }
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />

                  <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Space Grotesk" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />

                  <Tooltip
                    contentStyle={{
                      background: "#000",
                      border: "0.5px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "12px",
                      fontFamily: "Space Grotesk",
                    }}
                    cursor={{ stroke: "#e11d48", strokeWidth: 1 }}
                  />

                  {[20, 40, 60].map((value) => (
                    <ReferenceLine
                      key={value}
                      y={value}
                      stroke="rgba(255,255,255,0.1)"
                      strokeDasharray="3 3"
                    />
                  ))}

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#e11d48"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#e11d48" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Branch & Hall Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Branch */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-transparent border-[0.5px] border-white/10 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setIsBranchExpanded(!isBranchExpanded)}
              className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors border-b border-white/10"
            >
              <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white">
                Branch Wise
              </h2>
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortAsc(!sortAsc);
                  }}
                  className="px-2.5 py-1 text-xs border-[0.5px] border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {sortAsc ? "↑ Asc" : "↓ Desc"}
                </div>
                <FiChevronDown
                  className={`text-white/60 transition-transform duration-200 ${isBranchExpanded ? "rotate-180 text-primary" : ""
                    }`}
                  size={18}
                />
              </div>
            </button>

            {/* Collapsible Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${isBranchExpanded
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-xs font-space-grotesk">
                  <thead>
                    <tr className="text-white/60 border-b border-white/10">
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Branch</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Count</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4 border-l border-white/10">Branch</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const displayData = sortedBranch.slice(
                        0,
                        showAllBranch ? sortedBranch.length : 10
                      );
                      const half = Math.ceil(displayData.length / 2);
                      const col1 = displayData.slice(0, half);
                      const col2 = displayData.slice(half);

                      return col1.map((b1, i) => {
                        const b2 = col2[i];
                        return (
                          <tr
                            key={i}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-2 px-2 text-white/80 font-medium">
                              {b1.branch}
                            </td>
                            <td className="py-2 px-2">
                              <span className="px-2 py-0.5 text-[10px] border-[0.5px] border-white/10 bg-white/5 text-white/90">
                                {b1.count}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-white/80 font-medium border-l border-white/10">
                              {b2 ? b2.branch : ""}
                            </td>
                            <td className="py-2 px-2">
                              {b2 && (
                                <span className="px-2 py-0.5 text-[10px] border-[0.5px] border-white/10 bg-white/5 text-white/90">
                                  {b2.count}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}

                    {!showAllBranch && sortedBranch.length > 10 && (
                      <tr>
                        <td colSpan="4" className="py-3 px-2 text-center">
                          <button
                            onClick={() => setShowAllBranch(true)}
                            className="text-xs text-primary hover:text-white font-medium transition-colors"
                          >
                            Show All ({sortedBranch.length}) →
                          </button>
                        </td>
                      </tr>
                    )}

                    <tr className="text-white font-semibold border-t border-white/20">
                      <td className="py-2.5 px-2" colSpan="3">Total</td>
                      <td className="py-2.5 px-2">{totalBranch}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Hall */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-transparent border-[0.5px] border-white/10 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setIsHallExpanded(!isHallExpanded)}
              className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-colors border-b border-white/10"
            >
              <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white">
                Hall Wise
              </h2>
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortHallAsc(!sortHallAsc);
                  }}
                  className="px-2.5 py-1 text-xs border-[0.5px] border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {sortHallAsc ? "↑ Asc" : "↓ Desc"}
                </div>
                <FiChevronDown
                  className={`text-white/60 transition-transform duration-200 ${isHallExpanded ? "rotate-180 text-primary" : ""
                    }`}
                  size={18}
                />
              </div>
            </button>

            {/* Collapsible Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${isHallExpanded
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-xs font-space-grotesk">
                  <thead>
                    <tr className="text-white/60 border-b border-white/10">
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Hall</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Count</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4 border-l border-white/10">Hall</th>
                      <th className="py-2 px-2 text-left font-semibold uppercase tracking-wider w-1/4">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const displayData = sortedHall.slice(
                        0,
                        showAllHall ? sortedHall.length : 10
                      );
                      const half = Math.ceil(displayData.length / 2);
                      const col1 = displayData.slice(0, half);
                      const col2 = displayData.slice(half);

                      return col1.map((h1, i) => {
                        const h2 = col2[i];
                        return (
                          <tr
                            key={i}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-2 px-2 text-white/80 font-medium">
                              {h1.hall}
                            </td>
                            <td className="py-2 px-2">
                              <span className="px-2 py-0.5 text-[10px] border-[0.5px] border-white/10 bg-white/5 text-white/90">
                                {h1.count}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-white/80 font-medium border-l border-white/10">
                              {h2 ? h2.hall : ""}
                            </td>
                            <td className="py-2 px-2">
                              {h2 && (
                                <span className="px-2 py-0.5 text-[10px] border-[0.5px] border-white/10 bg-white/5 text-white/90">
                                  {h2.count}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}

                    {!showAllHall && sortedHall.length > 10 && (
                      <tr>
                        <td colSpan="4" className="py-3 px-2 text-center">
                          <button
                            onClick={() => setShowAllHall(true)}
                            className="text-xs text-primary hover:text-white font-medium transition-colors"
                          >
                            Show All ({sortedHall.length}) →
                          </button>
                        </td>
                      </tr>
                    )}

                    <tr className="text-white font-semibold border-t border-white/20">
                      <td className="py-2.5 px-2" colSpan="3">Total</td>
                      <td className="py-2.5 px-2">{totalHall}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Batches */}
        <div className="w-full text-center mt-6 flex flex-col">
          {isAuthenticated ? (
            <>
              <h2 className="text-sm font-bold font-space-grotesk uppercase tracking-wider text-white mb-4">
                Select Year
              </h2>

              {/* horizontal scroll matching Toolkit category box design */}
              <div className="flex gap-2.5 justify-start md:justify-center overflow-x-auto pb-2 no-scrollbar select-none">
                {Object.keys(batchDataMap)
                  .sort((a, b) => b - a)
                  .map((y) => (
                    <button
                      key={y}
                      onClick={() => goToYear(Number(y))}
                      className="
                      shrink-0
                      px-5 py-2.5
                      text-xs md:text-sm font-medium font-space-grotesk
                      border-[0.5px] border-white/10 bg-transparent text-white/60
                      transition-all duration-200
                      hover:bg-primary hover:text-white hover:border-primary
                      active:scale-95
                    "
                    >
                      {batchDataMap[y].label}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-white/50 italic font-space-grotesk">
                Detailed access restricted to DAAN-KGPians
              </p>

              <Link
                to="/signin"
                className="
                inline-block
                px-5 py-2.5
                text-xs font-medium font-space-grotesk
                border-[0.5px] border-primary text-white bg-primary/20
                hover:bg-primary hover:border-primary
                transition-all duration-200
                active:scale-95
              "
              >
                🔒 Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;
