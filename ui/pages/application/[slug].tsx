import {
  Button,
  Dropdown,
  Form,
  ModalWrapper,
  SkeletonPlaceholder,
  Tab,
  Tabs,
  TextArea,
  TextInput,
  Tile,
} from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import * as api from "../../api";
// import { Application } from "../../api/types";
import styles from "../../styles/application.module.css";

import type { NextPage } from "next";
import { Review, User } from "../../api/types";
import { Add16, Chat16 } from "@carbon/icons-react";
import Link from "next/link";

const ApplicationPage: NextPage = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const [application, setApplication] = useState<any>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisors, setSupervisors] = useState("");
  const [description, setDescription] = useState("");

  const [copyStatus, setCopyStatus] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");

  const [reviewStatus, setReviewStatus] = useState("");
  const [statusErrMsg, setstatusErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      const user = await api.getToken();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

  useEffect(() => {
    const slug = router.query.slug as string;
    if (slug && slug.length > 0) {
      api
        .request({
          path: `/applications/${slug}`,
          method: "GET",
        })
        .then((response) => {
          console.log(response.data);
          setApplication(response.data);
          setAuthor(response.data.submitter?.email);
          setSupervisors(
            response.data.supervisors ? response.data.supervisors[0]?.email : ""
          );
          setDescription(response.data.description);
          setName(response.data.name);

          setReviews(response.data.reviews);
        });
      api.fetchPDF(slug).then((response) => {
        setPDF(response);
      });
    }
  }, [router.query.slug]);

  const sendReview = async () => {
    if (reviewStatus && reviewStatus !== "" && comment && comment !== "") {
      try {
        console.log(application.id);
        const resp = await api.request({
          path: `/applications/${application?.id}/reviews`,
          method: "POST",
          data: {
            comment,
            status: reviewStatus,
          },
        });

        if (resp.status == 201) {
          console.log("Success");
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

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
        <Tab href="#view" id="view" label="View">
          <div>
            {application && (
              <div className={styles.view}>
                <h2>
                  Title: {application.name ? application.name : "No data"}
                </h2>
                <h4>
                  Author:{" "}
                  {application.submitter?.email
                    ? application.submitter.email
                    : "No data"}
                </h4>
                <h4>
                  Supervisors:{" "}
                  {application.supervisors?.length > 0
                    ? application.supervisors
                        ?.map((supervisor: User) =>
                          supervisor.name ? supervisor.name : supervisor.email
                        )
                        .join(", ")
                    : "No data"}
                </h4>
                <h4>
                  Coauthors:{" "}
                  {application.coauthors
                    ? application.coauthors
                        ?.map((coauthor: User) =>
                          coauthor.name ? coauthor.name : coauthor.email
                        )
                        .join(", ")
                    : "No data"}
                </h4>
                <h4>
                  Field of Study:{" "}
                  {application.field ? application.field : "No data"}
                </h4>
              </div>
            )}
          </div>
          {!pdf && (
            <SkeletonPlaceholder
              style={{
                width: "100%",
                height: "600px",
                marginBottom: "20px",
              }}
            />
          )}
          {pdf && (
            <div
              style={{
                width: "95%",
                height: "800px",
                resize: "vertical",
                overflow: "auto",
                margin: "auto",
              }}
            >
              <iframe
                src={URL.createObjectURL(
                  new Blob([pdf], { type: "application/pdf" })
                )}
                style={{
                  width: "92%",
                  height: "99%",
                  margin: "auto",
                  position: "relative",
                  left: "7%",
                }}
              />
            </div>
          )}
        </Tab>

        {user?.email == application.submitter?.email && (
          <Tab href="#edit" id="edit" label="Edit">
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
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
              />

              <TextArea
                id="description"
                labelText="Description"
                placeholder="Description"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              />

              <TextInput
                id="supervisor"
                labelText="Supervisors"
                placeholder="Supervisor"
                value={supervisors ? supervisors : ""}
                onChange={(e) => setSupervisors(e.target.value)}
              />

              <Button
                type="submit"
                disabled={(name === "" || author === "") && supervisors === ""}
              >
                Update
              </Button>
            </Form>
          </Tab>
        )}

        {user?.role == "COORDINATOR" ||
        user?.email == application.submitter?.email ||
        user?.role == "REVIEWER" ? (
          <Tab href="#review" id="review" label="Review">
            <div className="form">
              <Dropdown
                style={{
                  right: 0,
                }}
                size="md"
                label="Status"
                items={["APPROVED", "DECLINED"]}
                id={""}
                onChange={(e) =>
                  setReviewStatus(e.selectedItem ? e.selectedItem : "")
                }
              />
              <TextArea
                placeholder="Comment"
                rows={20}
                labelText="Comment"
                onChange={(e) => setComment(e.target.value)}
              ></TextArea>
              <Button
                style={{
                  marginTop: "2em",
                }}
                onClick={(_e) => {
                  (async () => {
                    await sendReview();
                  })();
                }}
              >
                Submit
              </Button>
            </div>
          </Tab>
        ) : null}
      </Tabs>
    </>
  );
};

export default ApplicationPage;
