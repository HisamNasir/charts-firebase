import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { db, storage } from "../firebase-config";
import { collection, doc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaArrowLeft, FaImage, FaSpinner, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const Upload = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleUpload = async () => {
    if (!currentUser || !image || !category) {
      return;
    }

    try {
      setUploading(true);

      const imageRef = ref(storage, `images/${currentUser.uid}/${image.name}`);

      await uploadBytes(imageRef, image);

      const downloadURL = await getDownloadURL(imageRef);
      const timestamp = new Date().toISOString();
      const userImagesCollection = collection(
        db,
        "ImageCategory",
        currentUser.uid,
        "UserImages"
      );

      await addDoc(userImagesCollection, {
        imageId: image.name,
        imageUrl: downloadURL,
        imageOwner: currentUser.uid,
        imageSize: image.size,
        imageCategory: category,
        timestamp: timestamp,
      });

      setImage(null);
      setCategory("");
      setUploading(false);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);

      toast.error("Something went wrong during upload");
    }
  };

  return (
    <Layout>
      <div className="p-4 flex flex-col justify-center h-full  min-w-max">
        <div className="flex justify-start">
          <a
          disabled={uploading}
            href="/home"
            className="flex items-center gap-4 mb-3  hover:bg-blue-800 transition-colors duration-200 bg-blue-500 text-white font-semibold p-2 px-4 rounded-xl my-4 disabled:opacity-30"
          >
            <FaArrowLeft /> Gallery
          </a>
        </div>
        <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-xl">
          <h1 className="text-3xl font-semibold mb-4">Image Upload</h1>
          <label
          disabled={uploading}
            htmlFor="image-upload"
            className="cursor-pointer disabled:cursor-not-allowed obj flex w-full border border-gray-500 rounded-xl items-center justify-center h-[35vh]"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected Image"
                className="h-60 w-60  object-cover disabled:opacity-30"
              />
            ) : (
              <FaImage className="text-6xl" />
            )}
          </label>

          <input
          disabled={uploading}
            type="file"
            id="image-upload"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="flex justify-between">
            <select
              required
              className="my-4 p-2 outline-1 outline-gray-500 outline rounded-xl disabled:opacity-30"
              value={category}
              disabled={uploading}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              <option value="Art">Art</option>
              <option value="Sports">Sports</option>
              <option value="Science">Science</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Gameing">Gameing</option>
              <option value="Nature">Nature</option>
              <option value="Fashion">Fashion</option>
              <option value="Animal">Animal</option>
              <option value="Animation">Animation</option>
              <option value="History">History</option>
            </select>
            {uploading && (
              <div className="mt-4">
                <div className=" flex justify-center items-center animate-spin text-3xl">
                  <FaSpinner />
                </div>
              </div>
            )}

            <button
              className="flex items-center gap-4 mb-3  hover:bg-blue-800 transition-colors duration-200 bg-blue-500 text-white font-semibold p-2 px-4 rounded-xl my-4 disabled:opacity-30"
              onClick={handleUpload}
              disabled={uploading}
            >
              <FaUpload /> Upload
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
