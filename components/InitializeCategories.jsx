
import { db } from "@/firebase-config"; 
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const initializeCategories = async () => {
  const dummyCategories = [
    {
      name: "Category1",
      subcategories: ["Subcategory1", "Subcategory2"],
    },
    {
      name: "Category2",
      subcategories: ["Subcategory3", "Subcategory4"],
    },
  ];
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
