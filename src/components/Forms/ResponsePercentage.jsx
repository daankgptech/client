import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ResponsePercentage = ({
  formData,
  batchKey = "batch",
  valueKey = "percentage",
}) => {
  const chartData = formData?.responsePercentage || [];

  return (
    <div className="w-full h-72 sm:h-80 md:h-96">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          {/* X Axis */}
          <XAxis
            dataKey={batchKey}
            tick={{ fontSize: 12, fill: "#6B7280" }} // gray-500
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            domain={[0, 100]}
            tickFormatter={(val) => `${val.toFixed(2)}%`}
            tick={{ fontSize: 12, fill: "#9CA3AF" }} // gray-400
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            cursor={{ fill: "rgba(244, 63, 94, 0.08)" }} // rose-500 soft
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
            formatter={(val) => `${Number(val).toFixed(2)}%`}
          />

          {/* Bars */}
          <Bar
            dataKey={valueKey}
            fill="#F43F5E" // rose-500
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponsePercentage;