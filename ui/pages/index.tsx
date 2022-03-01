import * as api from "../api";
import { User } from "../api/types";
import { useEffect, useState } from "react";
import CoordinatorDashboard from "../components/coordinator/CoordinatorDashboard";
import ResearcherDashboard from "../components/researcher/ResearcherDashboard";
import ReviewerDashboard from "../components/reviewer/ReviewerDashboard";
import style from "../styles/index.module.css";
import About from "./about";

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
      {user?.role == "COORDINATOR" && (
        <div className={style.panel}>
          <CoordinatorDashboard />
        </div>
      )}
      {user?.role == "REVIEWER" && (
        <div className={style.panel}>
          <ReviewerDashboard />
        </div>
      )}
      {user?.role && (
        <div className={style.panel}>
          <ResearcherDashboard />
        </div>
      )}
      <About content="" />
    </>
  );
}
