import "../styles/globals.css";
import type { AppProps } from "next/app";

import "../styles/style.scss";
import Layout from "../layout/Layout";
import NetworkManager from "../components/NetworkManager";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NetworkManager>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NetworkManager>
    </>
  );
}

export default MyApp;
