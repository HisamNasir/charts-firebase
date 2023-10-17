import React, { useEffect } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

function CategoryCreator() {
  useEffect(() => {
    // Initialize the Firestore collection reference
    const categoriesCollectionRef = collection(db, "ImagesCategory");

    // Define the main categories and their subcategories
    const categories = [
      {
        name: "Nature",
        subcategories: ["Mountains", "Beaches", "Forests"],
      },
      {
        name: "Gaming",
        subcategories: ["Action", "Adventure", "RPG"],
      },
      {
        name: "Vehicle",
        subcategories: ["Cars", "Trains", "Boats"],
      },
      {
        name: "Tech",
        subcategories: ["Gadgets", "Software", "Hardware"],
      },
      {
        name: "Fashion",
        subcategories: ["Clothing", "Accessories", "Footwear"],
      },
      {
        name: "Designs",
        subcategories: ["Graphics", "Web", "UI/UX"],
      },
    ];

    // Loop through the categories and add them to Firestore
    categories.forEach(async (category) => {
      const docRef = doc(categoriesCollectionRef, category.name);

      // Check if the document already exists
      if ((await docRef.get()).exists()) {
        console.log(`Category "${category.name}" already exists.`);
      } else {
        try {
          // If the document doesn't exist, create it and set its data
          await setDoc(docRef, {
            name: category.name,
            subcategories: category.subcategories,
          });

          console.log(`Category "${category.name}" created successfully.`);
        } catch (error) {
          console.error(`Error creating category "${category.name}":`, error);
        }
      }
    });
  }, []);

  return null;
}

export default CategoryCreator;
