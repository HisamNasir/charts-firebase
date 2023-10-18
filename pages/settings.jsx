import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "@/components/Layout";
import { FaHandPointRight, FaEdit, FaSave } from "react-icons/fa";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    if (currentUser) {
      const fetchUserProfile = async () => {
        try {
          const userProfileDocRef = doc(db, "UserProfileInfo", currentUser.uid);
          const userProfileDocSnapshot = await getDoc(userProfileDocRef);
          if (userProfileDocSnapshot.exists()) {
            const userData = userProfileDocSnapshot.data();
            setUserProfile(userData);
            setNameInput(userData.Name);
            setAgeInput(userData.Age);
            setGenderInput(userData.Gender);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
      const intervalId = setInterval(() => {
        const now = new Date();
        setCurrentDate(now.toLocaleString());
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentUser]);
  const updateProfile = async () => {
    if (!currentUser || !userProfile) {
      return;
    }
    try {
      const userProfileDocRef = doc(db, "UserProfileInfo", currentUser.uid);
      await updateDoc(userProfileDocRef, {
        Name: nameInput,
        Age: ageInput,
        Gender: genderInput,
        LastUpdated: serverTimestamp(),
      });
      setIsEditingName(false);
      setIsEditingAge(false);
      setIsEditingGender(false);
      const userProfileDocSnapshot = await getDoc(userProfileDocRef);
      const userData = userProfileDocSnapshot.data();
      setUserProfile(userData);
      setNameInput(userData.Name);
      setAgeInput(userData.Age);
      setGenderInput(userData.Gender);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  if (!currentUser || !userProfile) {
    return <div>Loading...</div>;
  }

  const { Email, Name, ID, ProfilePictureURL, Age, Gender } = userProfile;

  return (
    <Layout>
      <section className="body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 ">
              User Settings
            </h1>
            <div className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
              View Your settings account settings.
            </div>
          </div>
          <div className="flex flex-wrap -m-3">
            <div id="section1" className="p-2 xl:w-1/3 md:w-1/2 w-full">
              <div className="h-full p-6 rounded-lg border-[1px]  border-blue-300 flex flex-col relative overflow-hidden">
                <h2 className="text-sm trackingWidest title-font mb-1 font-medium">
                  Profile Picture
                </h2>
                <h1 className="text-5xl  pb-4 mb-4 border-b border-gray-200 leading-none"></h1>
                <div>
                  <img
                    src={ProfilePictureURL || "default-profile-picture.jpg"} // Use a default picture if not found
                    alt="User Profile"
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div id="section2" className="p-2 xl:w-1/3 md:w-1/2 w-full">
              <div className="h-full p-6 rounded-lg border-[1px] border-blue-300 flex flex-col relative overflow-hidden">
                <h2 className="text-sm trackingWidest title-font mb-1 font-medium">
                  User Info
                </h2>
                <h1 className="text-5xl  leading-none flex items-center pb-4 mb-4 border-b border-gray-200"></h1>

                <div>
                  <label className="block w-full text-sm font-medium text-gray-700 mb-2">
                    Name:
                    {isEditingName ? (
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                      />
                    ) : (
                      <span>{Name}</span>
                    )}
                    <button
                      onClick={() => setIsEditingName(!isEditingName)}
                      className="inline-block  ml-2 text-blue-500"
                    >
                      {isEditingName ? <FaSave /> : <FaEdit />}
                    </button>
                  </label>
                </div>

                <div className="flex items-center  mb-2">
                  <div className="text-gray-500">
                    {Email || "user@example.com"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age:
                    {isEditingAge ? (
                      <input
                        type="text"
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                      />
                    ) : (
                      <span>{Age}</span>
                    )}
                    <button
                      onClick={() => setIsEditingAge(!isEditingAge)}
                      className="inline-block ml-2 text-blue-500"
                    >
                      {isEditingAge ? <FaSave /> : <FaEdit />}
                    </button>
                  </label>
                </div>

                <div>
                  <label className="block text- font-medium text-gray-700 mb-2">
                    Gender:
                    {isEditingGender ? (
                      <input
                        type="text"
                        value={genderInput}
                        onChange={(e) => setGenderInput(e.target.value)}
                      />
                    ) : (
                      <span>{Gender}</span>
                    )}
                    <button
                      onClick={() => setIsEditingGender(!isEditingGender)}
                      className="inline-block ml-2 text-blue-500"
                    >
                      {isEditingGender ? <FaSave /> : <FaEdit />}
                    </button>
                  </label>
                </div>

                <button
                  onClick={updateProfile}
                  className="flex items-center mt-auto text-white bg-blue-500 border-0 py-2 px-4 mt-4 w-full focus:outline-none hover:bg-blue-800 transition-colors duration-200 rounded"
                >
                  Update
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-auto"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
                <div className="text-xs text-gray-500 mt-3">
                  Literally you probably haven't heard of them jean shorts.
                </div>
              </div>
            </div>
            <div id="section3" className="p-2 xl:w-1/3 md:w-1/2 w-full">
              <div className="h-full p-6 rounded-lg border-[1px] border-blue-300 flex flex-col relative overflow-hidden">
                <h2 className="text-sm trackingWidest title-font mb-1 font-medium">
                  Data
                </h2>
                <div className="text-lg  leading-none  items-center pb-4 mb-4 border-b border-gray-200">
                  Time and Date:
                  <span className="text-blue-500 text-sm">{currentDate}</span>
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Literally you probably haven't heard of them jean shorts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Settings;
