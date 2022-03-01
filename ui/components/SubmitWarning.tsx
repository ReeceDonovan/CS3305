import { Link } from "carbon-components-react";

export default function SubmitWarning() {
  return (
    <>
      <p
        style={{
          margin: "3.6em auto  1.2em auto",
          padding: "2rem",
        }}
      >
        Ensure that the document you are submitting is in PDF format and{" "}
        <Link href="/about#form">
          <a> up to date </a>
        </Link>
        . By submitting an application, you agree to the {"  "}
        <Link href="/about#terms"> terms and conditions </Link>.
      </p>

      <p
        style={{
          margin: "1.2em auto  3.6em auto",
          padding: "0 2rem",
        }}
      >
        Carefully read over your form, ensure all necessary fields are filled.
        Also make sure to include any co-authors and/or supervisors.
      </p>
    </>
  );
}
