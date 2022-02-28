import { Tile } from "carbon-components-react";
import { Review } from "../../api/types";
import styles from "../../styles/application.module.css";

const ReviewTile = (props: { review: Review }) => {
  const review = props.review;
  return (
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
  );
};

export default ReviewTile;
