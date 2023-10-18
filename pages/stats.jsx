import ImageTableCharts from "@/components/ImageTableCharts";
import ImageCounter from "@/components/ImageCounter";
import ImageUploadChart from "@/components/ImageUploadChart";
import Layout from "@/components/Layout";
import React from "react";
import ImageTimestamps from "@/components/ImageTimestamps";

const Stats = () => {
  return (
    <Layout>
      <div className=" flex flex-col items-center p-2 gap-4 mb-4">

            <ImageTableCharts />


        <div className="lg:flex w-full  gap-2">

            <ImageUploadChart />


            <ImageTimestamps />

        </div>
      </div>
      
    </Layout>
  );
};

export default Stats;
