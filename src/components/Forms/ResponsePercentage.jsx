// ResponsePercentage.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Reusable component
// Props: formData (object with responsePercentage array),
//        batchKey (string), valueKey (string)
const ResponsePercentage = ({
  formData,
  batchKey = "batch",
  valueKey = "percentage",
}) => {
  // Extract the nested responsePercentage array
  const chartData = formData?.responsePercentage || [];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={batchKey} />
          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(val) => `${val}%`} />
          <Legend />
          <Bar dataKey={valueKey} fill="#DC2626" name="Response %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponsePercentage;