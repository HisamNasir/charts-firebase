import React from "react";

const DisplayImages = ({ images }) => {
  return (
    <>
    {images.map((image) => (
      <div key={image.id} className="dark:bg-gray-900 bg-slate-300  p-4 rounded-lg shadow">
        <img
          src={image.imageUrl}
          alt="Uploaded"
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <div className="">
          <p><span className=" font-semibold">Category:</span>  {image.category}</p>
          <p><span className=" font-semibold">Owner:</span>  {image.name}</p>
        </div>
      </div>
    ))}
    
    
    </>
  );
};

export default DisplayImages;
