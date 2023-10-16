import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "../firebase-config";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase-config"; // Import Firebase auth
import Layout from "@/components/Layout";
import { FaImage, FaSpinner } from "react-icons/fa";

const Category = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Function to fetch categories and subcategories from Firestore
  const fetchCategories = async () => {
    const categoriesRef = collection(db, "ImageCategory");
    const categoriesQuery = query(categoriesRef);

    const snapshot = await getDocs(categoriesQuery);
    const categoryData = [];

    snapshot.forEach((doc) => {
      categoryData.push(doc.id);
    });

    setCategories(categoryData);
  };

  // Function to fetch subcategories based on the selected category
  const fetchSubcategories = async (selectedCategory) => {
    if (selectedCategory) {
      const subcategoriesRef = collection(
        db,
        "ImageCategory",
        selectedCategory,
        "Subcategories"
      );
      const subcategoriesQuery = query(subcategoriesRef);

      const subcategorySnapshot = await getDocs(subcategoriesQuery);
      const subcategoryData = [];

      subcategorySnapshot.forEach((doc) => {
        subcategoryData.push(doc.id);
      });

      setSubcategories(subcategoryData);
    } else {
      setSubcategories([]);
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Event handler for when a category is selected
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    setSubcategoryDropdownOpen(false); // Close subcategory dropdown
    fetchSubcategories(selectedCategory); // Fetch subcategories based on the selected category
  };

  // Event handler for when a subcategory is selected
  const handleSubcategoryChange = (event) => {
    const selectedSubcategory = event.target.value;
    setSelectedSubcategory(selectedSubcategory);
    setCategoryDropdownOpen(false); // Close category dropdown
    setSubcategoryDropdownOpen(false); // Close subcategory dropdown
    console.log("Selected Subcategory: ", selectedSubcategory);
  };
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

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Display the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
  };
  const uploadImage = async () => {
    if (selectedFile && selectedSubcategory) {
      const user = auth.currentUser;

      if (user) {
        setUploading(true); // Show "Uploading Image" message

        const date = new Date().getTime();
        const storageRef = ref(storage, `${user.displayName + date}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on("state_changed", (snapshot) => {
          // Handle upload progress if needed
        });

        uploadTask
          .then(async () => {
            const downloadURL = await getDownloadURL(storageRef);

            const imageInfo = {
              id: user.uid + date,
              name: user.displayName,
              timestamp: new Date(),
              imageUrl: downloadURL,
              category: selectedSubcategory,
            };

            const imageDocRef = doc(db, "userImages", imageInfo.id);

            await setDoc(imageDocRef, imageInfo);

            setUploadSuccess(true);
            setUploading(false);
            toast.success("Image uploaded successfully!", {
              autoClose: 2000,
              position: "top-center",
              onClose: () => {
                setSelectedFile(null);
                setSelectedSubcategory("");
                setSelectedImageUrl(null);
                setUploadSuccess(false);
              },
            });
          })
          .catch((error) => {
            setUploading(false);
            console.error("Error adding image to Firestore:", error);
          });
      } else {
        console.error("User not authenticated.");
      }
    } else {
      console.error("Please select an image and enter a subcategory.");
    }
  };

  return (
    <div className="flex p-3 justify-between flex-col items-center mb-4 rounded bg-gray-50 dark:bg-gray-800">
      {uploading && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h1 className="text-xl font-bold">Uploading Image</h1>
          <div className="flex items-center justify-center">
            <FaSpinner className=" animate-spin m-4" />
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 rounded-lg bg-green-400 dark:bg-green-800">
          <h1 className="text-xl font-bold text-white">
            Uploaded Successfully
          </h1>
        </div>
      )}

      {!uploading && !uploadSuccess && (
        <div className="flex p-3 justify-between flex-col items-center mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <h1 className="text-xl font-bold">Upload Image</h1>
          <div className="flex m-6 h-40 gap-5 items-center">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              {selectedImageUrl ? (
                <img
                  src={selectedImageUrl}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-xl"
                />
              ) : (
                <label
                  htmlFor="fileInput"
                  className="image-upload-button p-4 text-8xl border mx-2 rounded-xl"
                >
                  <FaImage className="image-icon" />
                </label>
              )}
            </div>
            <input
              required
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="relative gap-7 flex">
              <div className="relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="text-white bg-slate-400 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-slate-600 dark:hover-bg-slate-400 dark:focus:ring-slate-600"
                  type="button"
                >
                  {selectedCategory ? selectedCategory : "Select Category"}{" "}
                  <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    categoryDropdownOpen ? "" : "hidden"
                  } absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-400`}
                >
                  <ul className="py-2 text-sm dark:">
                    {categories.map((category) => (
                      <li key={category}>
                        <a
                          href="#"
                          onClick={() => {
                            handleCategoryChange({
                              target: { value: category },
                            });
                          }}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover-bg-gray-600 dark:hover-"
                        >
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {selectedCategory && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setSubcategoryDropdownOpen(!subcategoryDropdownOpen)
                    }
                    className="text-white bg-slate-400 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-slate-600 dark:hover-bg-slate-400 dark:focus:ring-slate-600"
                    type="button"
                  >
                    {selectedSubcategory
                      ? selectedSubcategory
                      : "Select Subcategory"}{" "}
                    <svg
                      className="w-2.5 h-2.5 ml-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <div
                    className={`${
                      subcategoryDropdownOpen ? "" : "hidden"
                    } absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-400`}
                  >
                    <ul className="py-2 text-sm dark:">
                      {subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <a
                            href="#"
                            onClick={() => {
                              handleSubcategoryChange({
                                target: { value: subcategory },
                              });
                            }}
                            className="block px-4 py-2 hover:bg-slate-800  dark:hover-"
                          >
                            {subcategory}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            className="text-white bg-slate-500 hover:bg-slate-900 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 transition-colors duration-150"
            onClick={uploadImage}
          >
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
