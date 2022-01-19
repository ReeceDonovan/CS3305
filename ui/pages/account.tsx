import type { NextPage } from "next";
import { Button, Form, TextInput } from "carbon-components-react";
import React, { useState } from "react";

const AccountPage: NextPage = () => {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [school, setSchool] = useState("");

  return (
    <>
      <Form
        style={{
          height: "90vh",
          width: "100%",
        }}
      >
        <TextInput
          id="name"
          labelText="Name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <TextInput
          id="bio"
          labelText="Job Title"
          placeholder="Job Title"
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <TextInput
          id="school"
          labelText="School"
          placeholder="School"
          onChange={(e) => setSchool(e.target.value)}
        />

        <Button
          type="submit"
          disabled={name === "" && jobTitle === "" && school === ""}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AccountPage;
