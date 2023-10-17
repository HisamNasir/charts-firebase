import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUpload } from "react-icons/fa";

const GalleryPieChart = () => {
  const { currentUser } = useContext(AuthContext);
  const [imageData, setImageData] = useState([]);
  const [imagesUploadedToday, setImagesUploadedToday] = useState(0);
  const [categoryData, setCategoryData] = useState([]);

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

          // Initialize an object to count images for each category
          const categoryCount = {};

          querySnapshot.forEach((doc) => {
            const imageData = doc.data();
            images.push(imageData);

            // Check if the image was uploaded today
            const timestampDate = new Date(imageData.timestamp);
            const todayDate = new Date();
            if (
              timestampDate.getDate() === todayDate.getDate() &&
              timestampDate.getMonth() === todayDate.getMonth() &&
              timestampDate.getFullYear() === todayDate.getFullYear()
            ) {
              todayCount++;
            }

            // Count images for each category
            if (categoryCount[imageData.imageCategory]) {
              categoryCount[imageData.imageCategory]++;
            } else {
              categoryCount[imageData.imageCategory] = 1;
            }
          });

          setImageData(images);
          setImagesUploadedToday(todayCount);

          // Convert categoryCount object to an array for rendering in the table
          const categoryDataArray = Object.entries(categoryCount).map(
            ([category, count]) => ({
              category,
              count,
            })
          );
          setCategoryData(categoryDataArray);
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
    <div className="p-4 w-full">
      <div className="bg-blue-100 dark:bg-gray-800 w-full p-4 rounded-xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Image Gallery
        </h1>
        <p className=" text-center opacity-60">
          Images Uploaded Today: {imagesUploadedToday}
        </p>
        {imageData.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="w-full">
            <div className="p-4 border border-gray-500 rounded-xl mt-4">
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-center my-4">
                  Image Data
                </h2>
                <div className="">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-blue-100 dark:bg-gray-700">
                        <th className="px-4 py-2">Timestamp</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imageData.map((data, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "bg-gray-300 bg-opacity-20"
                              : "bg-gray-200 bg-opacity-20"
                          }
                        >
                          <td className="px-4 py-2">{data.timestamp}</td>
                          <td className="px-4 py-2">{data.imageCategory}</td>
                          <td className="px-4 py-2">
                            <button
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                              onClick={() => openImageInNewTab(data.imageUrl)}
                            >
                              View Image
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 border border-gray-500 rounded-xl mt-4">
                <h2 className="text-2xl font-semibold text-center my-4">
                  Category Counts
                </h2>
                <div className="">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-blue-100 dark:bg-gray-700">
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((category, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "bg-gray-300 bg-opacity-20"
                              : "bg-gray-200 bg-opacity-20"
                          }
                        >
                          <td className="px-4 py-2">{category.category}</td>
                          <td className="px-4 py-2">{category.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPieChart;
