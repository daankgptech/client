// DeptDonutChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

// Reusable Donut Chart component
// Props: data (array of students), deptKey (field name for department, e.g. "dept")
const DeptDonutChart = ({ data, deptKey = "dept" }) => {
  // Count students per department
  const chartData = useMemo(() => {
    const counts = {};
    data.forEach((student) => {
      const dept = student[deptKey];
      if (dept) {
        counts[dept] = (counts[dept] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data, deptKey]);

  // High-contrast 20-color palette
  const COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#66FF66", "#FF6666",
    "#00C49F", "#FFBB28", "#FF8042", "#A569BD",
    "#5DADE2", "#52BE80", "#F4D03F", "#DC7633",
    "#7DCEA0", "#E74C3C", "#2E86C1", "#AF7AC5"
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}   // 👈 this makes it a donut
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="diamond"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeptDonutChart;