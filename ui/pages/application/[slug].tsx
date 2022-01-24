import {
  Button,
  Form,
  SkeletonPlaceholder,
  Tab,
  Tabs,
  TextInput,
} from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import * as api from "../../api";
import { Application } from "../../api/types";
import styles from "../../styles/application.module.css";

import type { NextPage } from "next";
const ApplicationPage: NextPage = () => {
  const router = useRouter();
  const [application, setApplication] = useState<Application>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisor, setSupervisor] = useState("");

  useEffect(() => {
    const slug = router.query.slug as string;
    if (slug && slug.length > 0) {
      api
        .request({
          path: `/applications/${slug}`,
          method: "GET",
        })
        .then((response) => {
          setApplication(response.data);
        });
      api.fetchPDF(slug).then((response) => {
        console.log(response);
        setPDF(response);
      });
    }
  }, [router.query.slug]);

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tabs
        style={{
          margin: "0px",
        }}
        type="container"
        scrollIntoView={false}
      >
        <Tab href="#view" style={{ marginTop: "8px" }} id="view" label="View">
          {application && (
            <div className={styles.view}>
              <h2>Title: {application.name}</h2>
              <h4>Author: {application.submitter}</h4>
              <h4>Supervisors: {application.supervisors}</h4>
              <h4>Field of Study: {application.field}</h4>
              {/* <h4>Status: {application.progress}</h4> */}
            </div>
          )}
          {!pdf && (
            <SkeletonPlaceholder
              style={{
                width: "100%",
                height: "600px",
              }}
            />
          )}
          {pdf && (
            <div
              style={{
                width: "95%",
                height: "600px",
                resize: "vertical",
                overflow: "auto",
                margin: "6em auto 0px auto",
              }}
            >
              <iframe
                src={URL.createObjectURL(
                  new Blob([pdf], { type: "application/pdf" })
                )}
                style={{
                  width: "90%",
                  height: "90%",
                  margin: "auto",
                  position: "relative",
                  left: "7%",
                }}
              />
            </div>
          )}
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
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextInput
              id="author"
              labelText="Application Author"
              placeholder="Author"
              onChange={(e) => setAuthor(e.target.value)}
            />

            <TextInput
              id="supervisor"
              labelText="Application Supervisor"
              placeholder="Supervisor"
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
    </>
  );
};

export default ApplicationPage;
