/* eslint-disable @next/next/no-img-element */
import { UserAvatar32 } from "@carbon/icons-react";
import {
  Button,
  InlineLoading,
  Modal,
  MultiSelect
} from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import { User } from "../../api/types";
import { NetworkManagerContext } from "../../components/NetworkManager";

export default function CoordinatorAssignReviewers() {
  const router = useRouter();
  const nm_ctx = useContext(NetworkManagerContext);

  const [loading, setLoading] = useState<boolean>(true);

  const [tempReviewers, setTempReviewers] = useState<Array<User>>([]);
  const [reviewers, setReviewers] = useState<Array<User>>([]);
  const [suggestedReviewers, setSuggestedReviewers] = useState<Array<User>>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (loading) {
        const [res] = await nm_ctx.request({
          method: "GET",
          path: `/users/reviewers`,
        });
        if (res.data) {
          const reviewers = res.data as User[];
         
          setTempReviewers(reviewers);
        }

        const [res2] = await nm_ctx.request({
          method: "GET",
          path: `/users/reviewers?t=suggested`,
        });
        if (res2.data) {
          setSuggestedReviewers(res2.data as User[]);
        }

        setLoading(false);
      }
    })();
  }, [nm_ctx, loading]);

  return (
    <>
      {!loading ? (
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}>
          <Button
            onClick={() => {
              setModalOpen(true)
            }}
          >
            Manually assign reviewers</Button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "auto"
              }}
            >
          <Button
            disabled={suggestedReviewers.length < 1}
            onClick={() => {
              nm_ctx.request({
                method: "PUT",
                path: `/applications/${router.query.id}/reviewers`,
                data: suggestedReviewers as User[],
                show_progress: true,
              });
            }}
          >Automatically assign reviewers</Button>
          {suggestedReviewers.length < 1 && (
            <small>Not enough suggested reviewers to automatically assign reviewers</small>
          )}
          </div>
          <Modal
            open={modalOpen}
            onRequestClose={() => {
              setModalOpen(false)
            }}

            title="Manually assign reviewers"
            primaryButtonText="Assign"
            secondaryButtonText="Cancel"
            preventCloseOnClickOutside={false}

            onRequestSubmit={async () => {
              await nm_ctx.request({
                path: `/applications/${router.query.slug}/reviewers`,
                method: "PUT",
                data: reviewers as User[],
                show_progress: true,
              });
            }}
          >
            <div
              style={{
                height: "400px",
              }}
            >
            <h1>Assign Reviewers</h1>
            <MultiSelect
              id={""}
              label={"Assign Reviewers"}
              light
              items={tempReviewers}
              itemToString={(item) => item?.email}
              translateWithId={(id) => id}
              itemToElement={(item) => (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                      />
                  ) : <UserAvatar32 style={{marginRight: "8px"}} />}
                  <p>{item?.email}</p>
                </span>
              )}
              onChange={(e) => {
                if (e.selectedItems) {
                  console.log(e.selectedItems);
                  setReviewers(e.selectedItems);
                }
              }}
            />
            </div>
          </Modal>
        </div>
      ) : (
        <InlineLoading />
      )}
    </>
  );
}
