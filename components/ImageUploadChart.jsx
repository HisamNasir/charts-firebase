import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Chart from "chart.js/auto";

const ImageUploadChart = () => {
  const [uploadData, setUploadData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const labels = [];
      const data = [];

      for (let i = 0; i <= 6; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const dateString = date.toISOString().split("T")[0];
        const userImagesCollection = collection(
          db,
          "ImageCategory",
          "UserImages",
          "UserImages"
        );
        const q = query(
          userImagesCollection,
          where("timestamp", ">=", dateString)
        );
        const querySnapshot = await getDocs(q);
        labels.push(dateString);
        data.push(querySnapshot.size);
      }
      setUploadData({
        labels: labels.reverse(),
        data: data.reverse(),
      });
    };
    fetchData();
  }, []);
  useEffect(() => {
    const ctx = document.getElementById("imageUploadChart").getContext("2d");
    if (window.myChart) {
      window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: uploadData.labels,
        datasets: [
          {
            label: "Images Uploaded",
            data: uploadData.data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [uploadData]);
  return (
    <div className="flex items-center mt-4 h-full w-full justify-center rounded-xl bg-blue-100  dark:bg-gray-800">
      <div className="flex flex-col h-full w-full lg: gap-2 font-semibold md:text-xl">
        <div className="p-4 h-full bg-blue-100 dark:bg-gray-800 w-full rounded-xl">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Image Uploads in the Last 7 Days
          </h1>
          <canvas id="imageUploadChart" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
};
export default ImageUploadChart;
