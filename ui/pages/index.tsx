import { Tab, Tabs } from "carbon-components-react";

import styles from "../styles/index.module.css";

import About from "./about";
import ReviewerDashboard from "../components/reviewer/ReviewerDashboard";

import * as api from "../api";
import { User } from "../api/types";
import { useEffect, useState } from "react";

export default function Index() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const user = await api.getToken();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

  return (
    <>
      {user?.role == "REVIEWER" ? (
        <Tabs
          className={styles.tabs}
          tabIndex={undefined}
          scrollIntoView={false}
        >
          <Tab href="#review" id="review" label="Review">
            <ReviewerDashboard />
          </Tab>
          <Tab href="#research" id="research" label="Research">
            <About content={""} />
          </Tab>
        </Tabs>
      ) : (
        <div
          style={{
            height: "calc(100vh - 50px)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
            }}
          >Not a Reviewer</h1>
        </div>
      )}
    </>
  );
}
