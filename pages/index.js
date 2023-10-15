import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from 'next/router';
import Home from "./home";
const inter = Inter({ subsets: ['latin'] })

export default function App() {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return (
    <>
    <main id="__next">{currentUser ? <Home /> : null}</main>
    
    </>
  )
}
