import {
  Button,
  Dropdown,
  Form,
  SkeletonPlaceholder,
  Tab,
  Tabs,
  TextArea,
  TextInput,
  Tile,
} from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import * as api from "../../api";
import styles from "../../styles/application.module.css";

import type { NextPage } from "next";
import { Review, User } from "../../api/types";
import { NetworkManagerContext } from "../../components/NetworkManager";
import {
  Checkmark16,
  Checkmark24,
  Close16,
  Close24,
} from "@carbon/icons-react";
import CoordinatorAssignReviewers from "../../components/coordinator/CoordinatorAssignReviewers";

const ApplicationPage: NextPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [application, setApplication] = useState<any>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [supervisors, setSupervisors] = useState("");
  const [description, setDescription] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");

  const [reviewStatus, setReviewStatus] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  const commentRef = React.useRef<HTMLTextAreaElement>();

  useEffect(() => {
    (async () => {
      const user = await api.getToken();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isLoading) {
        const slug = router.query.slug as string;
        if (slug && slug.length > 0) {
          const [res, err_code] = await nm_ctx.request({
            path: `/applications/${slug}`,
            method: "GET",
          });
          if (err_code === 0) {
            console.log(res.data);
            setApplication(res.data);
            setAuthor(res.data.submitter?.email);
            setSupervisors(
              res.data.supervisors ? res.data.supervisors[0]?.email : ""
            );
            setDescription(res.data.description);
            setName(res.data.name);

            setReviews(res.data.reviews);
          }
          api.fetchPDF(slug).then((response) => {
            setPDF(response);
          });
          setIsLoading(false);
        }
      }
    })();
  }, [isLoading, nm_ctx, router.query.slug]);

  const sendReview = async () => {
    console.log("sending review");
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
          setReviews([...reviews, resp.data]);
          setComment("");
          setReviewStatus("");
          if (commentRef.current) {
            commentRef.current.value = "";
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!application) {
    return <div>Loading...</div>;
  }

  let submitterEmail = "";
  let reviewers = [];
  for(const useridx in application.user_connection){
    if(application.user_connection[useridx].role == "SUBMITTER"){
      submitterEmail = application.user_connection[useridx].user.email;
    }else if(application.user_connection[useridx].role == "REVIEWER"){
      reviewers.push(application.user_connection[useridx].user.email);
    }
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
        {/* View Tab */}
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

        {/* Edit Tab */}
        {user?.email == submitterEmail && (
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
              <Button
                disabled={application.id ? false : true}
                onClick={() => {
                  nm_ctx.request({
                    method: "PATCH",
                    path: `/applications/${application.id}`,
                    data: { app_status: "SUBMITTED" },
                    show_progress: true,
                  });
                }}
              >
              Submit Your Application
            </Button>
            </Form>
          </Tab>
        )}

        {/* Reviewer Tab */}
        { user?.role == "REVIEWER" && reviewers.includes(user?.email) ? (
          <Tab href="#review" id="review" label="Review">
            {reviews?.map((review: Review) => (
              <Tile
                style={{
                  padding: "2rem",
                  margin: "2rem",
                }}
                key={review.id}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#fffa",
                      }}
                    >
                      {review.user?.name
                        ? review.user.name
                        : review.user?.email}
                    </span>
                    <span>
                      {review.status === "APPROVED" ? (
                        <Checkmark24 />
                      ) : review.status === "REJECTED" ? (
                        <Close24 />
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>

                  <p style={{ whiteSpace: "pre-wrap" }}>{review.comment}</p>
                </div>
              </Tile>
            ))}

            <TextArea
              style={{
                width: "calc(100% - 4rem)",
                margin: "auto",
              }}
              // @ts-expect-error
              // react moment
              ref={commentRef}
              rows={12}
              labelText="Review Comment"
              helperText="Summary of thoughts that motivated your review choice"
              onChange={(e) => setComment(e.target.value)}
            />

            <div
              style={{
                marginTop: "3em",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "150px",
              }}
            >
              <Dropdown
                style={{
                  width: "200px",
                  margin: "0px 50px",
                }}
                id="review-status"
                items={[
                  { id: "option-1", text: "APPROVED", icon: Checkmark16 },
                  { id: "option-2", text: "REJECTED", icon: Close16 },
                ]}
                itemToString={(item) => (item ? item.text : "")}
                itemToElement={(item) => (
                  <>
                    {React.createElement(item.icon)}
                    <span
                      style={{
                        paddingLeft: "1rem",
                        paddingBottom: "1rem",
                      }}
                    >
                      {item.text}
                    </span>
                  </>
                )}
                // @ts-expect-error
                renderSelectedItem={(item) => (
                  <>
                    {React.createElement(item.icon)}
                    <span
                      style={{
                        paddingLeft: "1rem",
                        paddingBottom: "1rem",
                      }}
                    >
                      {item.text}
                    </span>
                  </>
                )}
                label={"Status"}
                onChange={(e) => {
                  if (e.selectedItem) setReviewStatus(e.selectedItem.text);
                }}
              />

              <Button
                style={{
                  margin: "0px 50px",
                }}
                onClick={() => sendReview()}
              >
                Submit Review
              </Button>
            </div>
          </Tab>
        ) : null}
        
        {/* Coordinator Tab */}
        {user?.role == "COORDINATOR" ? (
          <Tab href="#coordinator" id="coordinator" label="Coordinator">
            {reviews?.map((review: Review) => (
              <Tile
                style={{
                  padding: "2rem",
                  margin: "2rem",
                }}
                key={review.id}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#fffa",
                      }}
                    >
                      {review.user?.name
                        ? review.user.name
                        : review.user?.email}
                    </span>
                    <span>
                      {review.status === "APPROVED" ? (
                        <Checkmark24 />
                      ) : review.status === "REJECTED" ? (
                        <Close24 />
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>

                  <p style={{ whiteSpace: "pre-wrap" }}>{review.comment}</p>
                </div>
              </Tile>
            ))}

            {application.app_status == "DRAFT" ? (
              <>
                <h1>This Application is still in draft mode</h1>
                <p>Please wait for the application to be submitted before assigning it for review.</p>
              </>
            ) : null}

            {application.app_status == "SUBMITTED" ? (
              <>
                <h1>Needs Reviewers Assigned</h1>
                <p>Please assign reviewers to this application.</p>
                <div style={{
                    marginTop: "3em",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "150px",
                  }}
                >
                  <CoordinatorAssignReviewers/>
                </div>
              </>
            ) : null}

            {application.app_status == "REVIEWING" ? (
              <>
                <h1>Being Reviewed</h1>
                <p>This application is currently under review.</p>
              </>
            ) : null}

            {application.app_status == "PENDING" ? (
              <>
                <h1>Pending Outcome</h1>
                <p>Please Accept or Reject this application based on the reviews.</p>
                  <div style={{
                    marginTop: "3em",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "150px",
                  }}
                  >
                  <Dropdown
                    style={{
                      width: "200px",
                      margin: "0px 50px",
                    }}
                    id="review-status"
                    items={[
                      { id: "option-1", text: "ACCEPT", icon: Checkmark16 },
                      { id: "option-2", text: "REJECT", icon: Close16 },
                    ]}
                    itemToString={(item) => (item ? item.text : "")}
                    itemToElement={(item) => (
                      <>
                        {React.createElement(item.icon)}
                        <span
                          style={{
                            paddingLeft: "1rem",
                            paddingBottom: "1rem",
                          }}
                        >
                          {item.text}
                        </span>
                      </>
                    )}
                    // @ts-expect-error
                    renderSelectedItem={(item) => (
                      <>
                        {React.createElement(item.icon)}
                        <span
                          style={{
                            paddingLeft: "1rem",
                            paddingBottom: "1rem",
                          }}
                        >
                          {item.text}
                        </span>
                      </>
                    )}
                    label={"Status"}
                    onChange={(e) => {
                      if (e.selectedItem) setReviewStatus(e.selectedItem.text);
                    }}
                  />

                  <Button
                    style={{
                      margin: "0px 50px",
                    }}
                    onClick={() => sendReview()}
                  >
                    Submit Review
                  </Button>
                </div>
              </>
            ) : null}

          </Tab>
        ) : null}

      </Tabs>
    </>
  );
};

export default ApplicationPage;
