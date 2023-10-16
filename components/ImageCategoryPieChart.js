import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";

const ImageCategoryPieChart = () => {
    const [imageData, setImageData] = useState({
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
            "#1a3d00",
            "#67755c",
            "#3361FF",
            "#3d3005",
            "#FF5733", 
            "#33FFB8", 
            ],
          },
        ],
      });
    
      useEffect(() => {
        // Your data fetching code remains the same
      }, []);
    
  useEffect(() => {
    const fetchData = async () => {
      const imagesRef = collection(db, "userImages");
      const snapshot = await getDocs(imagesRef);
      const subcategoryCounts = new Map();
      snapshot.forEach((doc) => {
        const data = doc.data();
        const subcategory = data.category;
        if (subcategoryCounts.has(subcategory)) {
          subcategoryCounts.set(
            subcategory,
            subcategoryCounts.get(subcategory) + 1
          );
        } else {
          subcategoryCounts.set(subcategory, 1);
        }
      });
      const labels = Array.from(subcategoryCounts.keys());
      const data = Array.from(subcategoryCounts.values());
      setImageData({
        labels,
        datasets: [
          {
            data
          },
        ],
      });
    };
    fetchData();
  }, []);
  return (
    <div className="h-60 w-60">
      <Pie data={imageData} className=""/>
    </div>
  );
};
export default ImageCategoryPieChart;
