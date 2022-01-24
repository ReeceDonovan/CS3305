import type { NextPage } from "next";
import { Button, Form, TextInput } from "carbon-components-react";
import { Tab, Tabs } from "carbon-components-react";
import styles from "../styles/application.module.css";
import React, { useEffect, useState } from "react";
import * as faker from "@faker-js/faker";

import * as api from "../api";

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
  const [pdf, setPDF] = useState("");

  useEffect(() => {
    (async () => {
      // setPDF(await api.fetchPDF(13));
      const data = await api.fetchPDF(1);
      data.toString("base64");
      const pdfData = new Buffer(data).toString("base64");

      // setPDF(data);
      // var dataURL = URL.createObjectURL(new Blob([data]));
      setPDF(pdfData);
    })();
  }, []);

  if (pdf == null) {
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

        <Tab
          href="#share"
          style={{ marginTop: "8px" }}
          id="share"
          label="Share"
        >
          <TextInput
            id="url"
            labelText="Shareable URL"
            value="https://localhost:3000/application"
          />
        </Tab>
      </Tabs>
    );
  } else {
    return (
      <>
        <iframe
          src={"data:application/pdf;base64," + pdf}
          width="100%"
          height="900px"
        />
        {/* <iframe
          src={"data:application/pdf;base64," + pdf}
          width="100%"
          height="900px"
        />
        <object data={pdf} type="application/pdf" width="100%" height="900px" />
        <embed
          src={pdf}
          type="application/pdf;base64"
          width="100%"
          height="900px"
        />
        <embed src={pdf} type="application/pdf" width="100%" height="900px" /> */}
      </>
    );
  }
};

export default ApplicationPage;
