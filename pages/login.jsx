import React from 'react';
import { auth } from '../firebase-config';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if a user with the same UID exists in UserProfileInfo
      const userProfileDocRef = doc(db, 'UserProfileInfo', user.uid);
      const userProfileDocSnapshot = await getDoc(userProfileDocRef);

      if (!userProfileDocSnapshot.exists()) {
        // User document does not exist, create it with the UID as the document ID
        await setDoc(userProfileDocRef, {
          Email: user.email,
          Name: user.displayName,
          ID: user.uid,
          ProfilePictureURL: user.photoURL,
          Age: '',
          Gender: '',
          NumberOfImageUpload: 0,
          StorageConsumed: 0,
          RemainingStorage: 0,
          TotalStorage: 0,
        });
      }

      console.log('User signed in:', user.displayName);

      // Redirect to the homepage after a successful login
      router.push('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="flex p-10 flex-col h-screen justify-center items-center min-w-max loginContainer">
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-500 rounded-md p-2 text-center bg-slate-600 text-white hover:bg-slate-700 duration-500 transition-colors"
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default Login;
