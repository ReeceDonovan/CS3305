import {
  InlineNotification,
  NotificationActionButton,
  ToastNotification,
} from "carbon-components-react";
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

export default NetworkManager;
