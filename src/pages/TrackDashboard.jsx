import React, { useEffect, useState } from "react";
import { api } from "../utils/Secure/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Users, Activity, Clock, Calendar, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const TrackDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryRes, timeseriesRes, topPagesRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/timeseries"),
        api.get("/analytics/top-pages")
      ]);
      setSummary(summaryRes.data.data);
      setTimeseries(timeseriesRes.data.data);
      setTopPages(topPagesRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !summary) {
    return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading Analytics Data...</div>;
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time traffic overview across the platform.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          Refresh Now
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard 
          title="Live (< 5m)" 
          value={summary?.liveUsers || 0} 
          icon={Activity} 
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
        />
        <StatCard 
          title="Last 24 Hours" 
          value={summary?.last24Hours || 0} 
          icon={Clock} 
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
        />
        <StatCard 
          title="Last 7 Days" 
          value={summary?.last7Days || 0} 
          icon={Calendar} 
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
        />
        <StatCard 
          title="Last 30 Days" 
          value={summary?.last30Days || 0} 
          icon={BarChart2} 
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
        />
        <StatCard 
          title="Total Visitors" 
          value={summary?.totalVisitors || 0} 
          icon={Users} 
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Timeseries Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Traffic - Last 30 Days</h2>
          <div className="h-80 w-full">
            {timeseries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 6 }} 
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                Not enough data to display chart.
              </div>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Top Visited Pages</h2>
          <div className="space-y-4">
            {topPages.length === 0 ? (
              <p className="text-gray-500 text-sm">No pages tracked yet.</p>
            ) : (
              topPages.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={item.page}>
                      {item.page === '/' ? '/ (Home)' : item.page}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDashboard;
