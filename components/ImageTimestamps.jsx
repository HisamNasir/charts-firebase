import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUpload } from "react-icons/fa";
import ImageCounterBarChart from "./ImageCounterBarChart";

const ImageTableCharts = () => {
  const { currentUser } = useContext(AuthContext);
  const [imageData, setImageData] = useState([]);
  const [imagesUploadedToday, setImagesUploadedToday] = useState(0);
  const [imagesUploadedLast6Days, setImagesUploadedLast6Days] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (currentUser) {
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

          setImageData(images);
          setImagesUploadedToday(todayCount);
          setImagesUploadedLast6Days(last6DaysCount);
        })
        .catch((error) => {
          console.error("Error getting images:", error);
        });
    }
  }, [currentUser]);

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="flex items-center sm:w-full rounded-xl bg-blue-100 min-h-max dark:bg-gray-800">
      <div className="flex flex-col h-full w-full lg:gap-2">
        <div className="w-full min-w-max">
          <div className="w-full rounded-xl">
            <div className="w-full min-w-max">
              <div className="p-4 border-t border-gray-500 rounded-xl mt-4">
                <div className="">
                  <div className="min-w-max flex flex-col">
                    <table className="table-auto w-full">
                      <thead>
                        <tr>
                          <th>Today</th>
                          <th>6 Days Ago</th>
                          <th>5 Days Ago</th>
                          <th>4 Days Ago</th>
                          <th>3 Days Ago</th>
                          <th>2 Days Ago</th>
                          <th>1 Day Ago</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{imagesUploadedToday}</td>
                          {imagesUploadedLast6Days.map((count, index) => (
                            <td key={index}>{count}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <ImageCounterBarChart/>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTableCharts;
