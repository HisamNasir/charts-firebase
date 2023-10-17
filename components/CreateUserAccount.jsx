// import { collection, addDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase-config';

// const CreateUserAccount = async (userData) => {
//   try {
//     const userAccountRef = collection(db, 'UserAccountInfo');
//     const userDocRef = await addDoc(userAccountRef, {}); // Create an empty user document
//     const userSubcollectionRef = collection(userDocRef, 'UserData'); // Create a subcollection for user data
//     await addDoc(userSubcollectionRef, userData); // Add user data to the subcollection

//     console.log('User account created with ID: ', userDocRef.id);
//     return userDocRef;
//   } catch (error) {
//     console.error('Error creating user account: ', error);
//     return null;
//   }
// };

// export default CreateUserAccount;

import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';

export const createUserAccount = async (userEmail, userData) => {
  try {
    const userAccountRef = collection(db, 'UserAccountInfo');
    const userDocRef = await addDoc(userAccountRef, { email: userEmail }); // Create a user document with the email as a property
    const userSubcollectionRef = collection(userDocRef, 'UserData');
    await addDoc(userSubcollectionRef, userData);

    console.log('User account created with email: ', userEmail);
    return userDocRef;
  } catch (error) {
    console.error('Error creating user account: ', error);
    return null;
  }
};