import "@/styles/globals.css";
import { AuthContextProvider } from "../context/AuthContext";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  return(

  <ThemeProvider attribute="class">
          <ToastContainer position="top-right" autoClose={5000} />
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  </ThemeProvider>
  )
}
