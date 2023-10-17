// seedFirestore.js
import { db } from "@/firebase-config"; // Import your Firebase configuration
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const initializeCategories = async () => {
  // Define your dummy categories and subcategories here
  const dummyCategories = [
    {
      name: "Category1",
      subcategories: ["Subcategory1", "Subcategory2"],
    },
    {
      name: "Category2",
      subcategories: ["Subcategory3", "Subcategory4"],
    },
    // Add more categories and subcategories as needed
  ];

  // Iterate through the dummy categories and add them to Firestore
  for (const category of dummyCategories) {
    const categoryRef = doc(db, "ImageCategory", category.name);

    await setDoc(categoryRef, {
      Subcategories: category.subcategories,
    });

    console.log(`Category "${category.name}" and subcategories added.`);
  }
};


import React from "react";

const InitializeCategories = () => {
  const handleInitialize = () => {
    initializeCategories();
  };

  return (
    <div>
      <h2>Initialize Categories</h2>
      <button onClick={handleInitialize}>Initialize</button>
    </div>
  );
};

export default InitializeCategories;
