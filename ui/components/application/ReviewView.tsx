import { Checkmark16, Close16 } from "@carbon/icons-react";
import {
  Button,
  Dropdown,
  InlineLoading,
  TextArea,
} from "carbon-components-react";
import React from "react";
import { useContext, useState } from "react";
import { Application, Review } from "../../api/types";
import { NetworkManagerContext } from "../NetworkManager";
import ReviewTile from "./ReviewTile";

const ReviewView = (props: { application: Application }) => {
  const application = props.application;

  const [reviews, setReviews] = useState<null | Review[]>(null);
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [statusErrMsg, setStatusErrMsg] = useState("");

  const nm_ctx = useContext(NetworkManagerContext);

  if (reviews === null) return <InlineLoading />;

  return (
    <>
      {application.reviews?.map((review: Review) => {
        <ReviewTile review={review} />;
      })}

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
        >
          Submit Review
        </Button>
      </div>

      <h1>Coordinator stuff</h1>
      <h1>Pending Outcome</h1>
      <p>Please Accept or Reject this application based on the reviews.</p>
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
  );
};

export default ReviewView;
