import * as faker from "@faker-js/faker";
import { Button, Form, Tab, Tabs, TextInput } from "carbon-components-react";
import React, { useEffect, useState } from "react";

import { fetchPDF } from "../api";
import styles from "../styles/application.module.css";

const fakeName = faker.name.findName();
const fakeSupervisor = faker.name.findName();
const fakeTitle = faker.lorem.words(4);
const fakeSchool = faker.word.noun();
const fakeStatus = faker.random.arrayElement([
  "In Review",
  "Inactive",
  "Reviewed",
]);

import type { NextPage } from "next";

const ApplicationPage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [pdf, setPdf] = useState<ArrayBuffer | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    fetchPDF(2 /* Dynamically assign from url query param(?) */).then((res) => {
      setPdf(res);
    });
  }, []);

  if (pdf == null || !showPDF) {
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

            <Button
              className={styles.button}
              onClick={() => {
                setShowPDF(true);
              }}
            >
              View PDF
            </Button>
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
      <div className={styles.view} style={{ height: "90vh", maxWidth: "100%" }}>
        {pdf && showPDF && (
          <>
            <Button
              style={{
                position: "absolute",
                right: "5%",
                zIndex: "99",
              }}
              type="button"
              onClick={() => {
                setShowPDF(false);
              }}
            >
              Close
            </Button>
            <iframe
              src={URL.createObjectURL(
                new Blob([pdf], { type: "application/pdf" })
              )}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
            />
          </>
        )}
      </div>
    );
  }
};

export default ApplicationPage;
