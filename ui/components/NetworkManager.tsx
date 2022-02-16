import axios from "axios";
import {
  InlineNotification,
  NotificationActionButton,
} from "carbon-components-react";
import React, { createContext, useState } from "react";
import { API_URL, RequestParams, StandardResponse } from "../api";
import styles from "../styles/networknotif.module.css";

export interface NiceParams extends RequestParams {
  err_msg?: string;
  succ_msg?: string;
  prog_msg?: string;
  show_progress?: boolean;
}

export const NetworkManagerContext = createContext({
  request: async (params: NiceParams): Promise<[StandardResponse, number]> => {
    return [{} as StandardResponse, 0];
  },
});

export const NetworkNotification = (props: {
  req_state: [number, string, any];
  close_fn: (e: any) => boolean;
}) => {
  if (props.req_state[0] === 0) {
    return <></>;
  } else if (props.req_state[0] === 1) {
    return (
      <div className={styles.notif}>
        <InlineNotification
          kind="info"
          title={props.req_state[1] ? props.req_state[1] : "In Progress"}
          onClose={props.close_fn}
          hideCloseButton={true}
        />
      </div>
    );
  } else if (props.req_state[0] === 2) {
    return (
      <div className={styles.notif}>
        <InlineNotification
          kind="error"
          title={props.req_state[1] ? props.req_state[1] : "Error"}
          onClose={props.close_fn}
          actions={props.req_state[2]}
        />
      </div>
    );
  } else if (props.req_state[0] === 3) {
    return (
      <div className={styles.notif}>
        <InlineNotification
          kind="success"
          title={props.req_state[1] ? props.req_state[1] : "Success"}
          onClose={props.close_fn}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export const NetworkManager = (props: any) => {
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
        console.log(res);
        if (params.show_progress === true) {
          loc_req_state = [3, params.succ_msg ? params.succ_msg : "", null];
        }
        setReq_state(loc_req_state);
        return [res.data as StandardResponse, 0];
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
              <NotificationActionButton href={`${API_URL}/login`}>
                Try login with a different account?
              </NotificationActionButton>
            );
          } else if (params?.err_msg) {
            loc_req_state[1] = params.err_msg;
          }
        }

        setReq_state(loc_req_state);
        const err_code = 2;
        return [e.response.data as StandardResponse, err_code];
      }
    },
  };

  return (
    <>
      <NetworkManagerContext.Provider value={nm_ctx}>
        {props.children}
      </NetworkManagerContext.Provider>
      <NetworkNotification
        req_state={req_state}
        close_fn={(e: any) => {
          setReq_state([0, "", null]);
          return false;
        }}
      />
    </>
  );
};

export default NetworkManager;
