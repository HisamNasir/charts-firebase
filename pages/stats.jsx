import GalleryPieChart from "@/components/GalleryPieChart";
import ImageCounter from "@/components/ImageCounter";
import ImageUploadChart from "@/components/ImageUploadChart";
import Layout from "@/components/Layout";
import React from "react";

const Stats = () => {
  return (
    <Layout>
      <div className=" flex flex-col items-center p-2 gap-4 mb-4">

            <GalleryPieChart />


        <div className="lg:flex w-full  gap-2">

            <ImageUploadChart />


            <ImageUploadChart />


        </div>
      </div>
      
    </Layout>
  );
};

export default Stats;
