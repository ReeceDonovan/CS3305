import { Button } from "carbon-components-react";

export default function Custom404() {
  return (
    <div>
      <p>
        This page is currently not accessible to your account. Maybe consider
        logging in to a different account before trying this webpage again?
      </p>
      <Button href="http://localhost:8000/login">Log in with UCC Email</Button>
    </div>
  );
}
