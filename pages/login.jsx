import React, { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import Link from "next/link";
import Layout from "@/components/Layout";
import DarkModButton from "@/components/DarkModButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className="flex p-10 flex-col h-screen justify-center items-center min-w-max loginContainer">
      <div className="fixed top-2 right-2">
        <DarkModButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-200 dark:bg-slate-900 p-5 text-sm w-full max-w-lg rounded-xl space-y-4"
      >
        <h1 className="text-lg font-bold">Login</h1>
        <div className="space-y-1">
          <div className="text-base">Email</div>
          <div>
            <input
              type="email"
              placeholder="email"
              id="Email"
              name="email"
              className="focus:outline focus:outline-1 focus:outline-slate-500 rounded-md p-2 w-full"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-base">Password</div>
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              className="focus:outline focus:outline-1 focus:outline-slate-500 rounded-md p-2 w-full"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div>
          <p className="text-slate-500">
            Don't have an account{" "}
            <Link href="/register" className="hover:text-black transition-colors delay-75">
              Signup
            </Link>
          </p>
        </div>
        <div>
          {err && <span>Something went wrong</span>}
          <button
            type="submit"
            className="w-full rounded-md p-2 text-center duration-500 transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
