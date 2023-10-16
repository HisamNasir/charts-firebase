import React, { useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { AuthContext } from "../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import DarkModButton from "./DarkModButton";

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

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

  return (
    <div className="navbar font-semibold bg-grey-800 min-w-max bg-gray-500 bg-opacity-40 h-[62px]">
      <div className="justify-between px-4 flex items-center h-full">
        <div className="flex gap-2 items-center">
          {currentUser.photoURL ? (
            <img
              className="h-11 w-11 container rounded-full object-cover"
              src={currentUser.photoURL}
              alt=""
            />
          ) : (
            <div className="h-11 w-11 container rounded-full bg-gray-300"></div>
          )}
          <span className="text-4xl col-span-3">
            {currentUser.displayName}
          </span>
        </div>
        <div className="flex justify-end text-end gap-4">
          <DarkModButton />
          <button
            className="text-xl flex gap-2 text-red-500 bg-black rounded-xl px-3 text-center items-center justify-end"
            onClick={() => signOut(auth)}
          >
            <FaSignOutAlt />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
