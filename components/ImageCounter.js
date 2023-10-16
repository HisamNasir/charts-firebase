import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Images Uploaded",
        data: [],
        backgroundColor: "rgba(75,192,192,0.5)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const last6Days = new Date(today);
      last6Days.setDate(today.getDate() - 6);

      const imageRef = collection(db, "userImages");
      const q = query(
        imageRef,
        where("timestamp", ">=", last6Days),
        where("timestamp", "<=", today)
      );

      const snapshot = await getDocs(q);

      const dates = [];
      const imageCount = Array(7).fill(0);

      snapshot.forEach((doc) => {
        const imageTimestamp = doc.data().timestamp.toDate();
        const diff = Math.floor(
          (today - imageTimestamp) / (1000 * 60 * 60 * 24)
        );
        imageCount[6 - diff]++;
      });

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - 6 + i);
        dates.push(date.toLocaleDateString());
      }

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Images Uploaded",
            data: imageCount,
            backgroundColor: "#67755c",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div className="h-[40vh]  px-20 py-8">
      <h2>Images Uploaded in the Last 6 Days</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
