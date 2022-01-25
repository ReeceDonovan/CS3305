/**
 * Route to save login credentials passed through url params
 */

import { Loading } from "carbon-components-react";
import { useEffect } from "react";
import * as api from "../api";

export default function Login() {
  useEffect(() => {
    (async () => {
      //   const query = window.location.search;
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token !== null) {
        api.saveCredentials(token);
        window.location.href = "/";
      } else {
          window.location.href= "http://localhost:8000/login"
      }
    })();
  }, []);
  return (
    <div
      style={{
        background: "inherit",
        height: "calc(100vh - 50px)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Logging in...
      </h1>
      <Loading description="Active loading indicator" withOverlay={false} />
    </div>
  );
}
