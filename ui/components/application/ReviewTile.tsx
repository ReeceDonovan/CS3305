import { Checkmark24, Close24 } from "@carbon/icons-react";
import { Tile } from "carbon-components-react";
import { Review } from "../../api/types";

const ReviewTile = (props: { review: Review }) => {
  const review = props.review;
  return (
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
            {review.user?.name ? review.user.name : review.user?.email}
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
  );
};

export default ReviewTile;
