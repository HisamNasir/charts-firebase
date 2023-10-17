import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

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

        const dateString = date.toISOString().split('T')[0];

        // Build the collection path
        const userImagesCollection = collection(db, 'ImageCategory', 'UserImages', 'UserImages');

        const q = query(userImagesCollection, where('timestamp', '>=', dateString));

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
    const ctx = document.getElementById('imageUploadChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: uploadData.labels,
        datasets: [
          {
            label: 'Images Uploaded',
            data: uploadData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
    <div className='p-4 bg-blue-100 dark:bg-gray-800 w-full rounded-xl'>
      <h1 className='text-3xl font-semibold mb-4'>Image Uploads in the Last 7 Days</h1>
      <canvas id='imageUploadChart' width='400' height='200'></canvas>
    </div>
  );
};

export default ImageUploadChart;
