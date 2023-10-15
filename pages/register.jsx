import React, { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DarkModButton from "@/components/DarkModButton";
import { FaCircleNotch, FaUser } from "react-icons/fa";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const [err, setErr] = useState(false);
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setSelectedImageUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setLoadingText("Please wait...");
    e.preventDefault();
    const file = profilePicture;
    const displayName = name;
    const userEmail = email;
    const userPassword = password;

    try {
      toast.info("Loading", { position: "bottom-right", autoClose: false });

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        // Handle upload progress if needed
      });

      uploadTask.then(async () => {
        try {
          const downloadURL = await getDownloadURL(storageRef);

          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});

          toast.success("Signup successful!", { position: "bottom-right", autoClose: 3000 });

          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } catch (err) {
          console.error(err);
          setErr(true);
          toast.error("An error occurred.");
        }
      });
    } catch (err) {
      setErr(true);
      toast.error("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-w-max flex-col h-screen justify-center items-center">
      <div className=" fixed top-2 right-2">
        <DarkModButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-200 dark:bg-slate-900 p-5 text-sm w-full max-w-lg rounded-xl space-y-4"
      >
        <h1 className="text-lg font-bold">Sign Up</h1>
        <div className="space-y-1">
          <div className="flex justify-center items-center space-x-2">
            <label
              htmlFor="file"
              className="cursor-pointer rounded-full outline text-white"
            >
              {selectedImageUrl ? (
                <img
                  src={selectedImageUrl}
                  alt="Profile"
                  className="w-20 h-20 sm:h-40 sm:w-40 rounded-full object-cover"
                />
              ) : (
                <FaUser className=" text-8xl m-4" />
              )}
            </label>
            <input
              required
              type="file"
              id="file"
              name="profilePicture"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-base">Name</div>
          <div>
            <input
              required
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:outline focus:outline-1 focus:outline-slate-500 rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-base">Email</div>
          <div>
            <input
              type="email"
              required
              placeholder="Email"
              id="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline focus:outline-1 focus:outline-slate-500 rounded-md p-2 w-full"
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-base">Password</div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline focus:outline-1 focus:outline-slate-500 rounded-md p-2 w-full"
            />
          </div>
        </div>
        <div>
          <p className="text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:text-black transition-colors delay-75"
            >
              Login
            </Link>
          </p>
        </div>
        <div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full rounded-md p-2 text-center bg-slate-600 text-white hover:bg-slate-700 duration-500 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              {loadingText}
              <ClipLoader color={"#ffffff"} loading={true} css={override} size={25} />
            </div>
          ) : (
            "Sign up"
          )}
        </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
