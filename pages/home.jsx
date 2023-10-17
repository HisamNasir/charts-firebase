import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { db, storage } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { FaUpload } from "react-icons/fa";
const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [userImages, setUserImages] = useState([]);

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
        .then(async (querySnapshot) => {
          const images = [];

          for (const doc of querySnapshot.docs) {
            const imageData = doc.data();
            const imageUrl = await getDownloadURL(
              ref(storage, imageData.imageUrl)
            );

            images.push({
              ...imageData,
              imageUrl,
            });
          }

          setUserImages(images);
        })
        .catch((error) => {
          console.error("Error getting images:", error);
        });
    }
  }, [currentUser]);

  return (
    <Layout>
      <div className="p-4 ">
        <div className="bg-blue-100 dark:bg-gray-800 w-full p-4 rounded-xl">
          <h1 className="text-3xl font-semibold mb-4">Gallery</h1>
          {userImages.length === 0 ? (
            <p>No images found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.imageUrl}
                    alt="Please wait.."
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <a
        href="/upload"
        className="fixed flex items-center gap-4 hover:bg-blue-800 transition-colors duration-200 bottom-5 p-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg right-5 z-10"
      >
        <FaUpload /> Upload Image
      </a>
    </Layout>
  );
};

export default Home;
