/* eslint-disable @next/next/no-img-element */
import { Button, ComboBox, InlineLoading, Tag } from "carbon-components-react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NetworkManagerContext } from "../../components/NetworkManager";
import styles from "../../styles/coordinatorAssignReviewers.module.css";

export default function CoordinatorAssignReviewers() {
  const router = useRouter();
  const nm_ctx = useContext(NetworkManagerContext);

  const [loading, setLoading] = useState<boolean>(true);

  const [comboReviewers, setComboReviewers] = useState<any[]>([]);
  const [tagReviewers, setTagReviewers] = useState<any[]>([]);

  const [reviewerIds, setReviewerIds] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (loading) {
        const [res] = await nm_ctx.request({
          method: "GET",
          path: `/users/reviewers`,
        });
        if (res.data) {
          setComboReviewers(res.data);
        }
        setLoading(false);
      }
    })();
  }, [nm_ctx, loading]);

  return (
    <>
      {!loading ? (
        <div className={styles.container}>
          <div className={styles.dropdown}>
            <ComboBox
              id={""}
              placeholder={"Assign Reviewer"}
              items={comboReviewers}
              // itemToString={(item) => (item ? item.email : "No data")}
              itemToElement={(item) => (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    alt={item.email + "'s avatar"}
                    src={item?.avatar}
                    width="20px"
                    height="20px"
                    style={{ borderRadius: "50%", marginRight: "1rem" }}
                  />
                  <p>{item.email}</p>
                </span>
              )}
              onChange={(e) => {
                if (e.selectedItem) {
                  comboReviewers.splice(
                    comboReviewers.indexOf(e.selectedItem.email),
                    1
                  );
                  setComboReviewers([...comboReviewers]);
                  setTagReviewers([...tagReviewers, e.selectedItem.email]);
                  setReviewerIds([...reviewerIds, { id: e.selectedItem.id }]);
                }
              }}
            />
          </div>
          <div className={styles.listReviewers}>
            {tagReviewers.map((elem, i) => (
              <Tag
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  const t = tagReviewers.splice(i, 1);
                  setTagReviewers([...tagReviewers]);
                  setComboReviewers([...comboReviewers, t[0]]);
                  setReviewerIds([...reviewerIds.splice(i, 1)]);
                }}
              >
                {elem}
              </Tag>
            ))}
          </div>
          <div className={styles.assignBtn}>
            <Button
              onClick={() => {
                nm_ctx.request({
                  method: "PUT",
                  path: `/applications/${router.query.slug}/reviewers`,
                  data: [...reviewerIds],
                });
              }}
            >
              Assign
            </Button>
          </div>
        </div>
      ) : (
        <InlineLoading />
      )}
    </>
  );
}
