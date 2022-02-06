import "../styles/globals.css";
import type { AppProps } from "next/app";

import "../styles/style.scss";
import Layout from "../layout/Layout";
import NetworkManager, {
  NetworkNotification,
  NiceParams,
} from "../components/NetworkManager";
import { RequestParams, StandardResponse } from "../api";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { NotificationActionButton } from "carbon-components-react";

function MyApp({ Component, pageProps }: AppProps) {
  // 0 is nothing, 1 is in progress, 2 is failure, 3 is success, the extra string is for auxiliary messages such as error messages
  const [req_state, setReq_state] = useState<[number, string, any]>([
    0,
    "",
    null,
  ]);

  const nm_ctx = {
    request: async (
      params: NiceParams
    ): Promise<[StandardResponse, number]> => {
      let res = null;
      let loc_req_state: [number, string, any] = [0, "", null];
      try {
        if (params.show_progress === true) {
          loc_req_state = [1, params.prog_msg ? params.prog_msg : "", null];
        }

        res = await axios(`${API_URL}${params.path}`, {
          ...(params as RequestParams),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (params.show_progress === true) {
          loc_req_state = [3, params.succ_msg ? params.succ_msg : "", null];
        }
        setReq_state(loc_req_state);
        return [res as unknown as StandardResponse, 0];
      } catch (e: any) {
        loc_req_state = [2, "", null];

        if (e?.response) {
          console.log("err: ", e.response);
          if (e.response.message) {
            loc_req_state[1] = e.response.message;
          } else if (e.response.status === 401) {
            loc_req_state[1] = "You are not authenticated to access such data";

            // ignore type error it works atm
            loc_req_state[2] = (
              <NotificationActionButton href={"http://localhost:8000/login"}>
                Try login with a different account?
              </NotificationActionButton>
            );
          } else if (params?.err_msg) {
            loc_req_state[1] = params.err_msg;
          }
        }
        setReq_state(loc_req_state);
        const err_code = 2;
        return [res as unknown as StandardResponse, err_code];
      }
    },
  };

  return (
    <>
      <NetworkManager.Provider value={nm_ctx}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NetworkManager.Provider>
      <NetworkNotification
        req_state={req_state}
        close_fn={(e: any) => {
          setReq_state([0, "", null]);
          return false;
        }}
      />
    </>
  );
}

export default MyApp;
