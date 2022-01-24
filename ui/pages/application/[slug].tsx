import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  SkeletonPlaceholder,
  TextInput,
} from "carbon-components-react";
import { Tab, Tabs } from "carbon-components-react";
import styles from "../../styles/application.module.css";
import React, { useEffect, useState } from "react";

import * as api from "../../api";

const ApplicationPage: NextPage = () => {
  const [applicationID, setApplicationID] = useState("");
  const [application, setApplication] = useState<any | null>(null);

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [pdf, setPDF] = useState("");

  useEffect(() => {
    (async () => {
      const { slug } = await router.query;
      if (slug !== undefined) {
        console.log(slug);
        setApplicationID(slug as string);
        console.log("check");
      }
    })();
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      console.log("check1");
      if (applicationID !== "") {
        console.log("check1 1");
        api
          .request({
            method: "GET",
            path: `/applications/${applicationID}`,
          })
          .then((resp) => {
            console.log("peggers");
            console.log(resp)
            setApplication(resp.data);
          });
        console.log("applicaion", application);
      }
    })();
  }, [applicationID]);

  useEffect(() => {
    (async () => {
      console.log("check2");
      if (applicationID !== "") {
        console.log("check2 1");
        console.log("app ID", applicationID);
        const data = await api.fetchPDF(applicationID);
        setPDF(
          URL.createObjectURL(new Blob([data], { type: "application/pdf" }))
        );
      }
    })();
  }, [applicationID]);

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
            <>
              <div className={styles.view}>
                <h2>Title: {application?.name}</h2>
                {/* <h4>Author: {application.submitter}</h4>
                <h4>Supervisors: {application.supervisors}</h4>
                <h4>Field of Study: {application.field}</h4>
                <h4>Status: {application.progress}</h4> */}
              </div>
            </>
          )}
          {pdf == null && (
            <SkeletonPlaceholder
              style={{
                width: "100%",
                height: "600px",
              }}
            />
          )}
          {pdf != null && (
            <div
              style={{
                width: "95%",
                height: "600px",
                resize: "vertical",
                overflow: "auto",
                marginBottom: "6em",
              }}
            >
              <object data={pdf} width="100%" height="100%" />
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
