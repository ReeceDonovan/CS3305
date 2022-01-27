import {
  Button,
  ComposedModal,
  Dropdown,
  Form,
  Modal,
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

const ApplicationPage: NextPage = () => {
  const router = useRouter();
  const [application, setApplication] = useState<any>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisors, setSupervisors] = useState("");
  const [description, setDescription] = useState("");

  const [copyStatus, setCopyStatus] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);

  const [modalCommentOpen, setModalCommentOpen] = useState(false);
  const [comment, setComment] = useState("");

  const [reviewStatus, setReviewStatus] = useState("");
  const [statusErrMsg, setstatusErrMsg] = useState("");

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
          setSupervisors(response.data.supervisors[0]?.email);
          setDescription(response.data.description);
          setName(response.data.name);

          setReviews(response.data.reviews);
        });
      api.fetchPDF(slug).then((response) => {
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
        <Tab href="#share" id="share" label="Share">
          <span>
            <p>Shareable URL (only to co-authors and supervisors):</p>
            <br />
            <p>
              <a
                href={`http://localhost:3000/application/${application.id}`}
              >{`http://localhost:3000/application/${application.id}`}</a>
            </p>
            <br />
            <Button
              small
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `http://localhost:3000/application/${application.id}`
                  )
                  .then(() => {
                    setCopyStatus("Copied to clipboard!");
                  });
              }}
            >
              Click to Copy
            </Button>
            <p>{copyStatus}</p>
          </span>
        </Tab>
        <Tab href="#review" id="review" label="Review">
          {application.reviews.map((review: Review, i: Number) => (
            <Tile className={styles.reviewTile}>
              {i == 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  <h2>Application submitted</h2>
                </div>
              ) : (
                <>
                  <div>{review.comment ? review.comment : ""}</div>
                  <div>
                    {review.reviewer
                      ? review.reviewer?.name
                        ? review.reviewer.name
                        : review.reviewer.email
                      : "No data"}
                  </div>
                </>
              )}
            </Tile>
          ))}
          <div className={styles.reviewControls}>
            <ModalWrapper
              shouldSubmitOnEnter={false}
              handleSubmit={(): boolean => {
                api
                  .request({
                    path: `/reviews/${application.id}`,
                    method: "POST",
                    data: {
                      comment: comment,
                    },
                  })
                  .then((resp) => {
                    if (resp.status == 201) {
                      setComment("");
                      setModalCommentOpen(false);
                    }
                  });
                return true;
              }}
              onSubmit={(_e) => {
                api
                  .request({
                    path: `/review/${application.id}`,
                    method: "POST",
                    data: {
                      comment: comment,
                    },
                  })
                  .then((resp) => {
                    if (resp.status == 201) {
                      setComment("");
                      setModalCommentOpen(false);
                      setReviews([...reviews, resp.data]);
                    }
                  });
              }}
              buttonTriggerText="Add Comment"
              renderTriggerButtonIcon={Chat16}
              triggerButtonIconDescription="Add Comment"
              modalHeading="Add Comment"
              modalLabel="Add Comment"
            >
              <div style={{ maxHeight: "60vh" }}>
                <TextArea
                  labelText="Add Comment"
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </ModalWrapper>
            <ModalWrapper
              shouldSubmitOnEnter={false}
              handleSubmit={(): boolean => {
                if (reviewStatus === "") {
                  setstatusErrMsg("Please select a status");
                  return false;
                }

                api
                  .request({
                    path: `/reviews/${application.id}`,
                    method: "POST",
                    data: {
                      status: reviewStatus,
                    },
                  })
                  .then();

                return true;
              }}
              buttonTriggerText="Update status"
              renderTriggerButtonIcon={Add16}
              triggerButtonIconDescription="Update status"
              modalHeading="Update status"
              modalLabel="Update status"
            >
              <Dropdown
                label="Status"
                items={["Pending", "In Review", "Accepted", "Rejected"]}
                id={""}
                onChange={(e) =>
                  setReviewStatus(e.selectedItem ? e.selectedItem : "")
                }
              />
              {statusErrMsg && <div>{statusErrMsg}</div>}
            </ModalWrapper>
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default ApplicationPage;
