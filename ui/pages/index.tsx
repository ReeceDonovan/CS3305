import * as api from "../api";
import { User } from "../api/types";
import { useEffect, useState } from "react";
import CoordinatorDashboard from "../components/coordinator/CoordinatorDashboard";
import ResearcherDashboard from "../components/researcher/ResearcherDashboard";
import ReviewerDashboard from "../components/reviewer/ReviewerDashboard";

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
        <CoordinatorDashboard />
      )}
      {user?.role == "REVIEWER" && (
        <ReviewerDashboard />
      )}
        <ResearcherDashboard />
    </>
  );
}
