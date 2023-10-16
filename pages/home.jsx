import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase-config";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Layout from "@/components/Layout";
import Category from "@/components/ImageCategory";
import DisplayImages from "@/components/DisplayImages";
import ImageCategoryPieChart from "@/components/ImageCategoryPieChart";
import ImageSizeChart from "@/components/ImageCounter";
import ImageCounter from "@/components/ImageCounter";
import { Chart as ChartJS } from 'chart.js/auto';

const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // Define the uploadedImages state


  useEffect(() => {
    const fetchImages = async () => {
      const imageRef = collection(db, "userImages");
      const imageQuery = query(imageRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(imageQuery);
      const images = [];

      snapshot.forEach((doc) => {
        images.push(doc.data());
      });
      setUploadedImages(images);
    };
    fetchImages();
  }, []);
  return (
    <Layout>
      <div className="p-4 w-screen">
        <div className=" border-gray-200 rounded-lg dark:border-gray-700">
          <div className=" flex overflow-x-scroll py-5 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col lg:text-center gap-2 p-4 text-gray-400 dark:text-gray-500">
                <ImageCategoryPieChart/>
                Image Categories
              </div>
            </div>

            <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800 w-full">
              <div className="flex flex-col lg:text-center gap-2 p-4 w-full text-gray-400 dark:text-gray-500">

                <ImageCounter/>

              </div>
            </div>


          </div>









         
            <Category/>


            <div className="flex items-center justify-center rounded bg-gray-50  p-8 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <DisplayImages images={uploadedImages}  />
</div>
            </div>


        </div>
      </div>
    </Layout>
  );
};

export default Home;
