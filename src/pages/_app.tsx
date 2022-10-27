import type { AppProps } from "next/app";
import "../../styles/globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/Authcontext";
import { Router } from "next/router";
import nProgress from "nprogress";

function MyApp({ Component, pageProps }: AppProps) {
  Router.events.on("routeChangeStart", () => nProgress.start());
  Router.events.on("routeChangeComplete", () => nProgress.done());
  Router.events.on("routeChangeError", () => nProgress.done());
  return (
    <AuthProvider>
      <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} position={"top-center"} />
    </AuthProvider>
  );
}

export default MyApp;
