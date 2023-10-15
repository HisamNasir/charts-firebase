import React, { useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { AuthContext } from "../context/AuthContext";
import { FaAddressBook, FaSignOutAlt } from "react-icons/fa";
import Modal from "react-modal";
import { collection, addDoc, query, getDocs } from "firebase/firestore";

import { db } from "../firebase-config";
import DarkModButton from "./DarkModButton";

Modal.setAppElement("#__next");

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      const q = collection(db, "users");
      try {
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    getUsers();
  }, []);

  const handleSelect = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(user.uid)) {
        return prevSelectedUsers.filter((userId) => userId !== user.uid);
      } else {
        return [...prevSelectedUsers, user.uid];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleAccept = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user for the group chat.");
      return;
    }
  
    if (!groupChatName) {
      alert("Please enter a name for the group chat.");
      return;
    }
  
    try {
      const groupChatRef = await addDoc(collection(db, "GroupChats"), {
        name: groupChatName,
        participants: [...selectedUsers, currentUser.uid],
      });
      const groupChatId = groupChatRef.id;
  
      // Create a "messages" subcollection for the group chat
      await setDoc(doc(db, "GroupChats", groupChatId, "messages", { messages: [] }));
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  
    closeModal();
  };

  return (
    <div className="navbar font-semibold bg-grey-800 bg-gray-500 bg-opacity-40 h-[62px]">
      <div className=" justify-between px-4 flex items-center h-full">
        <div className="flex gap-2">
        <img
          className="h-11 w-11 container rounded-full object-cover"
          src={currentUser.photoURL}
          alt=""
        />
        <span className=" text-4xl col-span-3">
          {currentUser.displayName}
        </span>
        </div>
        <div className="flex justify-end text-end">
        <DarkModButton/>
          <button
            className="block focus:ring-4 text-xl focus:outline-none font-medium rounded-lg  px-5 py-2.5 text-center"
            type="button"
            onClick={openModal}
          >
            <FaAddressBook />
          </button>
          <button
            className="text-xl flex gap-2 text-red-500 bg-black rounded-xl px-3 text-center items-center justify-end"
            onClick={() => signOut(auth)}
          >
            <FaSignOutAlt />{" "}
          </button>
          
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Default Modal"
        overlayClassName="fixed top-0 left-0 right-0 z-50 w-full h-full bg-black bg-opacity-60 flex items-center justify-center"
        className="relative w-full max-w-2xl max-h-full  rounded-lg shadow bg-gray-700"
      >
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
          <h3 className="text-xl font-semibold ">
            Create a group
            <span className="text-gray-400 text-sm ml-2">
              ({selectedUsers.length} selected)
            </span>
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
            onClick={closeModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="relative w-[98%]">
        <input
          type="text"
          placeholder="Enter group chat name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          className="block border w-full p-2 m-2 bg-slate-700 text-white focus:outline-none focus:ring focus:border-blue-300"
        />

        </div>

        <div className="space-y-6 h-[50vh] overflow-y-scroll">
          <div className="search w-full border-gray-400">
          {users.map((user) => (
  <div
    key={user.uid}
    className="userChat flex gap-4 bg-slate-600 hover:bg-slate-700 border-b-[1px] border-slate-800 text-white items-center p-2"
    onClick={() => handleSelect(user)}
  >
    <img
      className="w-16 h-16 object-cover rounded-full"
      src={user.photoURL}
      alt=""
    />
    <div className="userChatInfo w-full">
      <span>{user.displayName}</span>
    </div>
    <div className="block w-24 py-2 px-3 text-white">
      {selectedUsers.includes(user.uid) ? "Selected" : "Unselected"}
    </div>
  </div>
))}
          </div>
        </div>
        <div className="flex items-center p-6 space-x-2 border-t rounded-b border-gray-600">
          <button
            type="button"
            className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-slate-600 hover:bg-slate-700 focus:ring-slate-800"
            onClick={handleAccept}
          >
            I accept
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
