import type { AppProps } from "next/app";
import "../../styles/globals.scss";
import { AuthProvider } from "../contexts/Authcontext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
