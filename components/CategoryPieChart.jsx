import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const CategoryPieChart = ({ categoryData }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (categoryData) {
      const labels = categoryData.map((item) => item.category);
      const data = categoryData.map((item) => item.count);
      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "rgba(255, 99, 232, 0.6)",
              "rgba(54, 262, 735, 0.6)",
              "rgba(255, 206, 186, 0.6)",
              "rgba(75, 192, 492, 0.6)",
              "rgba(453, 02, 855, 0.6)",
            ],
          },
        ],
      });
    }
  }, [categoryData]);
  return (
    <div>
      <h2 className="text-2xl font-semibold mt-4">Category Distribution</h2>
      <Doughnut data={chartData} />
    </div>
  );
};
export default CategoryPieChart;
