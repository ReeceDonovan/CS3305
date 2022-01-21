import type { NextPage } from "next";
import { Button, Form, TextInput } from "carbon-components-react";
import { Tab, Tabs } from "carbon-components-react";
import styles from "../styles/application.module.css";
import React, { useState } from "react";
import * as faker from "@faker-js/faker";

const fakeName = faker.name.findName();
const fakeSupervisor = faker.name.findName();
const fakeTitle = faker.lorem.words(4);
const fakeSchool = faker.word.noun();
const fakeStatus = faker.random.arrayElement([
  "In Review",
  "Inactive",
  "Reviewed",
]);

const ApplicationPage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisor, setSupervisor] = useState("");

  return (
    <Tabs
      style={{
        margin: "0px",
      }}
      type="container"
      scrollIntoView={false}
    >
      <Tab href="#view" style={{ marginTop: "8px" }} id="view" label="View">
        <div className={styles.view}>
          <h2>Title: {fakeTitle}</h2>
          <h4>Author: {fakeName}</h4>
          <h4>Supervisor: {fakeSupervisor}</h4>
          <h4>School: {fakeSchool}</h4>
          <h4>Status: {fakeStatus}</h4>

          <Button type="submit">Download PDF</Button>
        </div>
      </Tab>
      <Tab href="#edit" style={{ marginTop: "8px" }} id="edit" label="Edit">
        <Form
          className={styles.edit}
          style={{
            height: "90vh",
            width: "100%",
          }}
        >
          <TextInput
            id="title"
            labelText="Application Title"
            placeholder="Title"
            value={fakeTitle}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextInput
            id="author"
            labelText="Application Author"
            placeholder="Author"
            value={fakeName}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <TextInput
            id="supervisor"
            labelText="Application Supervisor"
            placeholder="Supervisor"
            value={fakeSupervisor}
            onChange={(e) => setSupervisor(e.target.value)}
          />

          <Button
            type="submit"
            disabled={title === "" && author === "" && supervisor === ""}
          >
            Update
          </Button>
        </Form>
      </Tab>

      <Tab href="#share" style={{ marginTop: "8px" }} id="share" label="Share">
        <TextInput
          id="url"
          labelText="Shareable URL"
          value="https://localhost:3000/application"
        />
      </Tab>
    </Tabs>
  );
};

export default ApplicationPage;
