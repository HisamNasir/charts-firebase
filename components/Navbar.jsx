import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { FaSignOutAlt } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import DarkModButton from "./DarkModButton";
const Navbar = () => {
  const { currentUser, signOutUser } = useContext(AuthContext);
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
    <nav className="bg-blue-700 font-semibold p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/home" className="text-white hover:border p-3 rounded-xl">
            Gallery
          </Link>
          <Link
            href="/stats"
            className="text-white hover:border p-3 rounded-xl"
          >
            Stats
          </Link>
          <Link
            href="/settings"
            className="text-white hover:border p-3 rounded-xl"
          >
            Settings
          </Link>
        </div>
        <div className="flex justify-end text-end gap-4">
          <DarkModButton />
          <button
            className="text-xl flex gap-2 text-white rounded-xl px-3 text-center items-center justify-end"
            onClick={() => signOut(auth)}
          >
            <FaSignOutAlt />{" "}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
