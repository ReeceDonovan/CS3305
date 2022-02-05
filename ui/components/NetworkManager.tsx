import { ToastNotification } from "carbon-components-react";
import React, { createContext } from "react";
import { RequestParams, StandardResponse } from "../api";
import styles from "../styles/networknotif.module.css";

export interface NiceParams extends RequestParams {
  err_msg?: string;
  succ_msg?: string;
  prog_msg?: string;
  show_progress?: boolean;
}

const NetworkManager = createContext({
  request: async (params: NiceParams): Promise<[StandardResponse, number]> => {
    return [{} as StandardResponse, 0];
  },
});

export const NetworkNotification = (props: {
  req_state: [number, string];
  close_fn: () => void;
}) => {
  if (props.req_state[0] === 0) {
    return <></>;
  } else if (props.req_state[0] === 1) {
    return (
      <div className={styles.notif}>
        <ToastNotification
          kind="info"
          timeout={0}
          title={props.req_state[1] ? props.req_state[1] : "In Progress"}
          onClose={(e) => {
            e.preventDefault();
            return true;
          }}
        />
      </div>
    );
  } else if (props.req_state[0] === 2) {
    return (
      <div className={styles.notif}>
        <ToastNotification
          kind="error"
          timeout={0}
          title={props.req_state[1] ? props.req_state[1] : "Error"}
          onClose={(e) => {
            e.preventDefault();
            return true;
          }}
        />
      </div>
    );
  } else if (props.req_state[0] === 3) {
    return (
      <div className={styles.notif}>
        <ToastNotification
          kind="success"
          timeout={0}
          title={props.req_state[1] ? props.req_state[1] : "Success"}
          onClose={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return true;
          }}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default NetworkManager;
