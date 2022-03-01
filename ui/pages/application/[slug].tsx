// TODO: Further cleanup
import {
  Checkmark16,
  Checkmark24,
  Close16,
  Close24,
} from "@carbon/icons-react";
import {
  Button,
  Dropdown,
  Form,
  SkeletonPlaceholder,
  Tab,
  Tabs,
  Tag,
  TextArea,
  TextInput,
  Tile,
} from "carbon-components-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import * as api from "../../api";
import { Application, AppStatus, Review, User } from "../../api/types";
import CoordinatorAssignReviewers from "../../components/coordinator/CoordinatorAssignReviewers";
import CustomFileUploader from "../../components/CustomFileUploader";
import { NetworkManagerContext } from "../../components/NetworkManager";
import SubmitWarning from "../../components/SubmitWarning";
import styles from "../../styles/application.module.css";

const ApplicationPage: NextPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [application, setApplication] = useState<Application | undefined>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [name, setName] = useState<string>("No name");
  const [description, setDescription] = useState<string>("No description");

  const [submitter, setSubmitter] = useState<User | undefined>();
  const [reviewers, setReviewers] = useState<User[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStatus, setReviewStatus] = useState<string>("No status");

  const [comment, setComment] = useState<string>("No comment");
  const commentRef = React.useRef<HTMLTextAreaElement>();

  const [editApp, setEditApp] = useState<Partial<Application>>();
  const [supervisors, setSupervisors] = useState<string[]>([]);
  const [coauthors, setCoauthors] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  const emailRegexp = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );

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
      // if (isLoading) {
      if (router.isReady) {
        const slug = router.query.slug as string;
        if (slug && slug.length > 0) {
          const [res, err_code] = await nm_ctx.request({
            path: `/applications/${slug}`,
            method: "GET",
          });
          if (err_code === 0) {
            console.log(res.data);
            const application = res.data as Application;

            // make sure application and all other data is not undefined

            setApplication(application);
            setEditApp(application);
            setName(application.name);
            setDescription(
              application.description
                ? application.description
                : "No description"
            );

            setSubmitter(
              application.user_connection?.find((u) => u.role === "SUBMITTER")
                ?.user
            );

            console.log(application.user_connection);
            const coauthors = application.user_connection
              ?.filter((u) => u.role === "COAUTHOR")
              ?.map((u) => (u.user?.email ? u.user.email : ""));
            setCoauthors(coauthors ? coauthors : []);

            const supervisors = application.user_connection
              ?.filter((u) => u.role === "SUPERVISOR")
              ?.map((u) => (u.user?.email ? u.user.email : ""));
            setSupervisors(supervisors ? supervisors : []);

            const reviewers = application.user_connection
              ?.filter((u) => u.role === "REVIEWER")
              ?.map((u) => u.user as User);

            setReviewers(reviewers ? reviewers : []);

            const reviews = application.reviews?.map((r) => r as Review);
            setReviews(reviews ? reviews : []);
          }
        }
        api.fetchPDF(slug).then((response) => {
          setPDF(response);
        });
        setIsLoading(false);
      } else {
        console.log("ROUTER IS NOT READY");
        // }
      }
    })();
  }, [router.query.slug]);

  const sendReview = async () => {
    console.log("sending review");
    if (reviewStatus && reviewStatus !== "" && comment && comment !== "") {
      try {
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

  if (!application || !user || !submitter) {
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
        {/* View Tab */}
        <Tab href="#view" id="view" label="View">
          <div>
            {application !== null && (
              <div className={styles.view}>
                <h2>
                  Title: {application.name ? application.name : "No name"}
                </h2>
                <h4>Author: {submitter?.email}</h4>
                <h4>
                  Supervisors:{" "}
                  {supervisors && supervisors.length > 0
                    ? supervisors
                    : "No supervisors"}
                </h4>
                <h4>
                  Coauthors:{" "}
                  {coauthors && coauthors.length > 0
                    ? coauthors
                    : "No coauthors"}
                </h4>
                <h4>
                  Field of Study:{" "}
                  {application.field ? application.field : "No data"}
                </h4>
              </div>
            )}
          </div>
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
        {user &&
          submitter &&
          user.email == submitter.email &&
          application.app_status == AppStatus.DRAFT && (
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
                  value={editApp?.name ? editApp.name : ""}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextArea
                  id="description"
                  labelText="Description"
                  placeholder="Description"
                  value={editApp?.description ? editApp.description : ""}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <TextInput
                  id="coauthors"
                  name="coauthors"
                  labelText="Co-authors"
                  placeholder="Co-authors"
                  style={{
                    marginBottom: "1em",
                  }}
                  onKeyDown={(e) => {
                    const t = e.target as HTMLInputElement;
                    if ((e.code === "Enter" || e.code === "Tab") && t.value) {
                      const t = e.target as HTMLInputElement;
                      if (t.value && t.value.length > 0) {
                        if (emailRegexp.test(t.value)) {
                          setCoauthors([...coauthors, t.value]);
                          t.value = "";
                        }
                      }
                      e.preventDefault();
                    }
                  }}
                />

                <div
                  style={{
                    marginLeft: "1em",
                  }}
                >
                  {coauthors.map((elem, i) => (
                    <Tag
                      style={{
                        margin: "0.4em ",
                      }}
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        coauthors.splice(i, 1);
                        setCoauthors([...coauthors]);
                      }}
                    >
                      {elem}
                    </Tag>
                  ))}
                </div>

                <TextInput
                  id="supervisors"
                  name="supervisors"
                  labelText="Supervisors"
                  placeholder="Supervisors"
                  style={{
                    marginBottom: "1em",
                  }}
                  onKeyDown={(e) => {
                    const t = e.target as HTMLInputElement;
                    if ((e.code === "Enter" || e.code === "Tab") && t.value) {
                      if (t && t.value.length > 0) {
                        if (emailRegexp.test(t.value)) {
                          setSupervisors([...supervisors, t.value]);
                          t.value = "";
                        }
                      }
                      e.preventDefault();
                    }
                  }}
                />

                <div>
                  {supervisors.map((elem, i) => (
                    <Tag
                      key={i}
                      onClick={async (e) => {
                        e.preventDefault();
                        supervisors.splice(i, 1);
                        setSupervisors([...supervisors]);
                      }}
                    >
                      {elem}
                    </Tag>
                  ))}
                </div>

                <CustomFileUploader
                  init_file={pdf ? "form.pdf" : null}
                  add_remote_file_url={
                    application.id
                      ? `/applications/${application.id}/form`
                      : null
                  }
                  get_add_remote_file_url={async () => {
                    return `/applications/${application.id}/form`;
                  }}
                />

                <SubmitWarning />

                <Button
                  type="submit"
                  onClick={async (e) => {
                    await nm_ctx.request({
                      path: `/applications/${application.id}`,
                      method: "PATCH",
                      data: {
                        ...editApp,
                        coauthors: coauthors.length > 0 ? coauthors : null,
                        supervisors:
                          supervisors.length > 0 ? supervisors : null,
                      },
                      show_progress: true,
                    });
                  }}
                >
                  Update
                </Button>
                <Button
                  style={{
                    marginBottom: "2rem",
                  }}
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
        {user?.role == "REVIEWER" && reviewers && reviewers.includes(user) ? (
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
            {application.app_status == AppStatus.DRAFT ? (
              <>
                <h1>This Application is still in draft mode</h1>
                <p>
                  Please wait for the application to be submitted before
                  assigning it for review.
                </p>
              </>
            ) : null}

            {application.app_status == AppStatus.SUBMITTED ? (
              <>
                <h1>Needs Reviewers Assigned</h1>
                <p>Please assign reviewers to this application.</p>
              </>
            ) : null}

            {application.app_status == AppStatus.REVIEW ? (
              <>
                <h1>Being Reviewed</h1>
                <p>This application is currently under review.</p>
              </>
            ) : null}

            {!reviewers || reviewers.length < 2 ? (
              <>
                <h2 style={{ marginTop: "2rem" }}>
                  Currently Assigned Reviewers:{" "}
                  {reviewers ? reviewers.length : 0}
                </h2>
                <p>Please assign at least two reviewers to this application.</p>
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
                  <CoordinatorAssignReviewers />
                </div>
              </>
            ) : null}

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

            {application.app_status == AppStatus.PENDING ? (
              <>
                <h1>Pending Outcome</h1>
                <p>
                  Please Accept or Reject this application based on the reviews.
                </p>
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
