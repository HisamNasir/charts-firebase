import GalleryPieChart from "@/components/GalleryPieChart";
import ImageCounter from "@/components/ImageCounter";
import ImageUploadChart from "@/components/ImageUploadChart";
import Layout from "@/components/Layout";
import React from "react";

const Stats = () => {
  return (
    <Layout>
      <div className=" flex flex-col p-8 min-w-max gap-4 mb-4">
        <div className="flex items-center   rounded-xl bg-blue-100 dark:bg-gray-800">
          <div className="flex flex-col h-full w-full  lg: gap-2 p-4 ">
            <GalleryPieChart />
          </div>
        </div>

        <div className="flex items-center justify-center  rounded-xl bg-blue-100  dark:bg-gray-800 w-full">
          <div className="flex flex-col lg: gap-2 w-full font-semibold md:text-xl">
            <ImageUploadChart />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
