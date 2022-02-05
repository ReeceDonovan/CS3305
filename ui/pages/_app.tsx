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

function MyApp({ Component, pageProps }: AppProps) {
  // 0 is nothing, 1 is in progress, 2 is failure, 3 is success, the extra string is for auxiliary messages such as error messages
  const [req_state, setReq_state] = useState<[number, string]>([0, ""]);
  const [notif_list, setNotif_list] = useState<any>();

  const nm_ctx = {
    request: async (
      params: NiceParams
    ): Promise<[StandardResponse, number]> => {
      setNotif_list(
        <NetworkNotification
          req_state={req_state}
          close_fn={() => {
            setNotif_list(null);
          }}
        />
      );
      let res = null;
      let loc_req_state: [number, string] = [0, ""];
      try {
        if (params.show_progress === true) {
          loc_req_state = [1, params.prog_msg ? params.prog_msg : ""];
        }

        res = await axios(`${API_URL}${params.path}`, {
          ...(params as RequestParams),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (params.show_progress === true) {
          loc_req_state = [3, params.succ_msg ? params.succ_msg : ""];
        }
        setReq_state(loc_req_state);
        return [res as unknown as StandardResponse, 0];
      } catch (e: any) {
        loc_req_state = [2, ""];

        if (e?.response) {
          console.log("err: ", e.response);
          if (e.response.message) {
            loc_req_state[1] = e.response.message;
          } else if (e.response.status === 401) {
            loc_req_state[1] = "You are not authenticated to access such data";
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
      {notif_list}
    </>
  );
}

export default MyApp;
