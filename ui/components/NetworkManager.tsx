import { CheckmarkOutline32,  DataError32, InProgress32 } from "@carbon/icons-react";
import React, { createContext } from "react";
import { RequestParams, StandardResponse } from "../api";
import styles from "../styles/networknotif.module.css";

export interface NiceParams extends RequestParams{
    err_msg?: string
    show_progress?: boolean
}

const NetworkManager = createContext({
    request: async (params: NiceParams)=>{return {} as StandardResponse}
})

export const NetworkNotification = (props: { req_state: [number, string]; }) => {
  if(props.req_state[0] === 0){
    return <></>
  }else if (props.req_state[0] === 1){
    return <div className={styles.notif}>
      <InProgress32 />
    </div>
  }else if (props.req_state[0] === 2){
    return <div className={styles.notif}>
        <DataError32 />
        <p>{props.req_state[1]}</p>
    </div>
  }else if (props.req_state[0] === 3){
    return <div className={styles.notif}>
        <CheckmarkOutline32 />
    </div>
  }else{
    return <></>
  }
}

export default NetworkManager;