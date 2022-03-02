// TODO: Further cleanup
import {
  Checkmark16,
  Checkmark24,
  Close16,
  Close24,
} from "@carbon/icons-react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Modal,
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

import tableStyles from "../../styles/permissions.module.css";

const ApplicationPage: NextPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [application, setApplication] = useState<Application | undefined>();
  const [pdf, setPDF] = useState<ArrayBuffer>();

  const [submitter, setSubmitter] = useState<User | undefined>();
  const [reviewers, setReviewers] = useState<string[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStatus, setReviewStatus] = useState<string>("No status");

  const [comment, setComment] = useState<string>("No comment");
  const commentRef = React.useRef<HTMLTextAreaElement>();

  const [editApp, setEditApp] = useState<Partial<Application>>({
    name: "No name",
    description: "No description",
  } as Partial<Application>);
  const [supervisors, setSupervisors] = useState<string[]>([]);
  const [coauthors, setCoauthors] = useState<string[]>([]);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

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
              ?.map((u) => (u.user?.email ? u.user.email : ""));

            setReviewers(reviewers ? reviewers : []);

            const reviews = application.reviews?.map((r) => r as Review);
            setReviews(reviews ? reviews : []);
          }
        }
        api.fetchPDF(slug).then((response) => {
          setPDF(response);
        });
      } else {
        console.log("ROUTER IS NOT READY");
        // }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  const renderStatusSwitch = () => {
    switch (application?.app_status) {
      case "PENDING":
        return (
          <p>
            Pending &rarr; Your application has passed the review process, and
            is awaiting feedback from an SREC coordinator
          </p>
        );
      case AppStatus.DRAFT:
        return (
          <p>
            Draft &rarr; Your application has not been submitted yet, and you
            can make changes before submitting
          </p>
        );
      case AppStatus.SUBMITTED:
        return (
          <p>
            Submitted &rarr; Your application has been submitted and is awaiting
            review.
          </p>
        );
      case AppStatus.REVIEW:
        return (
          <p>Review &rarr; Your application is currently being reviewed.</p>
        );
    }
  };

  const sendReview = async (): Promise<any> => {
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

        return true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
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
              <table className={tableStyles.descriptiontable}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Outcome</strong>
                    </td>
                    <td>
                      <p>
                        {application.status
                          ? application.status
                          : "Not reviewed"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Status</strong>
                    </td>
                    <td>{renderStatusSwitch()}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Name</strong>
                    </td>
                    <td>
                      <p>{application.name ? application.name : "No name"}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Description</strong>
                    </td>
                    <td>
                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {application.description
                          ? application.description
                          : "No description"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Supervisors</strong>
                    </td>
                    <td>
                      {/* paragraph for each supervisor */}
                      {supervisors && supervisors.length > 0 ? (
                        supervisors.map((s) => <p key={s}>{s}</p>)
                      ) : (
                        <p>No supervisors</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Coauthors</strong>
                    </td>
                    <td>
                      {/* paragraph for each coauthor */}
                      {coauthors && coauthors.length > 0 ? (
                        coauthors.map((c) => <p key={c}>{c}</p>)
                      ) : (
                        <p>No coauthors</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          {pdf ? (
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
          ) : (
            <div>
              <h2>No PDF</h2>
            </div>
          )}
        </Tab>

        {/* Edit Tab */}
        {user &&
          submitter &&
          user.email == submitter.email &&
          application.app_status == AppStatus.DRAFT && (
            <Tab href="#edit" id="edit" label="Edit">
              <>
                <Form
                  className={styles.edit}
                  style={{
                    height: "90vh",
                    width: "100%",
                  }}
                >
                  <TextInput
                    id="name"
                    labelText="Application Name"
                    placeholder="Name of your application"
                    defaultValue={application.name}
                    onChange={(e) => {
                      const updatedApp = { ...editApp };
                      updatedApp.name = e.target.value;
                      setEditApp(updatedApp);
                    }}
                  />

                  <TextArea
                    id="description"
                    labelText="Description"
                    placeholder="Description"
                    defaultValue={application.description}
                    onChange={(e) => {
                      const updatedApp = { ...editApp };
                      updatedApp.description = e.target.value;
                      setEditApp(updatedApp);
                    }}
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
                    init_file={pdf ? "form.pdf" : undefined}
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
                    kind="danger--tertiary"
                    onClick={() => {
                      setEditModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    kind="tertiary"
                    type="submit"
                    onClick={async () => {
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
                    onClick={async () => {
                      const [_, err] = await nm_ctx.request({
                        method: "PATCH",
                        path: `/applications/${application.id}`,
                        data: { app_status: "SUBMITTED" },
                        show_progress: true,
                      });
                      if (!err) {
                        window.location.href = "/";
                      }
                    }}
                  >
                    Submit Your Application
                  </Button>
                </Form>

                <Modal
                  open={editModalOpen}
                  primaryButtonDisabled={!deleteConfirm}
                  primaryButtonText="Delete"
                  secondaryButtonText="Cancel"
                  danger
                  preventCloseOnClickOutside={false}
                  onRequestClose={() => {
                    setEditModalOpen(false);
                  }}
                  onRequestSubmit={async () => {
                    await nm_ctx.request({
                      method: "DELETE",
                      path: `/applications/${application.id}`,
                      show_progress: true,
                    });
                  }}
                >
                  <h1>Delete Application</h1>
                  <p style={{ margin: "2em 0" }}>
                    By continuing, your application will be lost, including any
                    uploaded form(s).
                  </p>
                  <Checkbox
                    id={"delete-checkbox"}
                    onChange={() => {
                      setDeleteConfirm(!deleteConfirm);
                    }}
                    labelText={"I understand"}
                  />
                </Modal>
              </>
            </Tab>
          )}

        {/* Reviewer Tab */}
        {user?.role == "REVIEWER" &&
        reviewers &&
        reviewers.includes(user.email) ? (
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

            {application.app_status == AppStatus.SUBMITTED ? (
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
                <Dropdown
                  style={{
                    width: "200px",
                    margin: "50px 0px 20px 0px",
                  }}
                  id="review-status"
                  items={[
                    { id: "option-1", text: AppStatus.APPROVED, icon: Checkmark16 },
                    { id: "option-2", text: AppStatus.REJECTED, icon: Close16 },
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "150px",
                    width: "100%",
                  }}
                >
                  <TextArea
                    style={{
                      width: "70vw",
                    }}
                    placeholder="Feedback"
                    rows={10}
                    cols={70}
                    onChange={(e) => setComment(e.target.value)}
                    labelText={"Feedback to send to researcher(s)"}
                  />

                  <Button
                    style={{
                      margin: "50px 0px",
                    }}
                    onClick={async () => {
                      if (await sendReview()) {
                        await nm_ctx.request({
                          method: "PATCH",
                          path: `/applications/${application.id}`,
                          data: {app_status: "DRAFT", status: "APPROVED"},
                        })
                      };
                    }}
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
