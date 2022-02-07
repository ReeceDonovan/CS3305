import { Button } from "carbon-components-react";
import { API_URL } from "../api";

export default function Custom404() {
  return (
    <div>
      <p>
        This page is currently not accessible to your account. Maybe consider
        logging in to a different account before trying this webpage again?
      </p>
      <Button href={`${API_URL}/login`}>Log in with UCC Email</Button>
    </div>
  );
}
