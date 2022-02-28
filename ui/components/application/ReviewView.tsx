import { InlineLoading, ModalWrapper, Tile } from "carbon-components-react";
import { useContext, useState } from "react";
import { Application, Review } from "../../api/types";
import styles from "../../styles/application.module.css"; 
import { NetworkManagerContext } from "../NetworkManager";

const ReviewView = (props: { application: Application }) => {
  const [reviews, setReviews] = useState<null | Review[]>(null);

  const nm_ctx = useContext(NetworkManagerContext);

  if (reviews === null) return <InlineLoading />;

  return (
    <>
      {application.reviews.map((review: Review, i: Number) =>
        review.comment ? (
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
        ) : (
          <h3 style={{ textAlign: "center" }}>
            Added {review.status} status
          </h3>
        )
      )}
      <div className={styles.reviewControls}>
        <ModalWrapper
          shouldSubmitOnEnter={false}
          handleSubmit={(): boolean => {
            nm_ctx
              .request({
                path: `/reviews/${application.id}`,
                method: "POST",
                data: {
                  comment: comment,
                },
              })
              .then(([res, err_code]) => {
                if (err_code == 0) {
                  setComment("");
                }
              });
            return true;
          }}
          onSubmit={async (_e) => {
            const [res, err_code] = await nm_ctx.request({
              path: `/review/${application.id}`,
              method: "POST",
              data: {
                comment: comment,
              },
            });
            if (err_code === 0) {
              setComment("");
              setReviews([...reviews, res.data]);
            }
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

            nm_ctx.request({
              path: `/reviews/${application.id}`,
              method: "POST",
              data: {
                status: reviewStatus,
              },
            });
            return true;
          }}
        >
          Submit
        </Button>
      </div>
  );

export default ReviewView;
