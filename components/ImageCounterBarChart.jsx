import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Chart from 'chart.js/auto';
import { FaUpload } from "react-icons/fa";


const ImageCounterBarChart = () => {
    const { currentUser } = useContext(AuthContext);
    const [imageData, setImageData] = useState([]);
    const [imagesUploadedToday, setImagesUploadedToday] = useState(0);
    const [imagesUploadedLast6Days, setImagesUploadedLast6Days] = useState([0, 0, 0, 0, 0, 0]);
    const chartRef = useRef(null); // Reference to the chart
  
    useEffect(() => {
      // Check if chart data is stored in localStorage
      const storedData = localStorage.getItem("chartData");
  
      if (currentUser && storedData) {
        const chartData = JSON.parse(storedData);
        setImageData(chartData.imageData);
        setImagesUploadedToday(chartData.imagesUploadedToday);
        setImagesUploadedLast6Days(chartData.imagesUploadedLast6Days);
  
        // Update the existing chart if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }
  
        // Create and render the bar chart
        drawBarChart(chartData);
      } else if (currentUser) {
        const userImagesCollection = collection(
          db,
          "ImageCategory",
          currentUser.uid,
          "UserImages"
        );
        const q = query(
          userImagesCollection,
          where("imageOwner", "==", currentUser.uid)
        );
  
        getDocs(q)
          .then((querySnapshot) => {
            const images = [];
            let todayCount = 0;
            const last6DaysCount = [0, 0, 0, 0, 0, 0];
  
            querySnapshot.forEach((doc) => {
              const imageData = doc.data();
              images.push(imageData);
  
              // Check if the image was uploaded today
              const timestampDate = new Date(imageData.timestamp);
              const todayDate = new Date();
  
              // Check if it's today
              if (
                timestampDate.toDateString() === todayDate.toDateString()
              ) {
                todayCount++;
              }
  
              // Check if it's one of the last 6 days
              for (let i = 1; i <= 6; i++) {
                const dayToCheck = new Date();
                dayToCheck.setDate(todayDate.getDate() - i);
                if (timestampDate.toDateString() === dayToCheck.toDateString()) {
                  last6DaysCount[i - 1]++;
                }
              }
            });
  
            // Store chart data in localStorage
            const chartData = {
              imageData: images,
              imagesUploadedToday: todayCount,
              imagesUploadedLast6Days: last6DaysCount
            };
            localStorage.setItem("chartData", JSON.stringify(chartData));
  
            setImageData(images);
            setImagesUploadedToday(todayCount);
            setImagesUploadedLast6Days(last6DaysCount);
  
            // Update the existing chart if it exists
            if (chartRef.current) {
              chartRef.current.destroy();
            }
  
            // Create and render the bar chart
            drawBarChart(chartData);
          })
          .catch((error) => {
            console.error("Error getting images:", error);
          });
      }
    }, [currentUser]);
  
    const openImageInNewTab = (imageUrl) => {
      window.open(imageUrl, "_blank");
    };
  
    const drawBarChart = (chartData) => {
      const ctx = document.getElementById('barChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Today',
            '1 Days Ago',
            '2 Days Ago',
            '3 Days Ago',
            '4 Days Ago',
            '5 Days Ago',
            '6 Day Ago'
          ],
          datasets: [
            {
              label: 'Number of Images',
              data: [
                chartData.imagesUploadedToday, 
                ...chartData.imagesUploadedLast6Days
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };
  
  return (

                    <canvas id="barChart" width="400" height="200"></canvas>

  );
};

export default ImageCounterBarChart;
