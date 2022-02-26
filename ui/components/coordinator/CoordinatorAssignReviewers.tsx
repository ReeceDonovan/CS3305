import { Button, ComboBox, InlineLoading, Tag } from "carbon-components-react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NetworkManagerContext } from "../../components/NetworkManager";
import styles from "../../styles/coordinatorAssignReviewers.module.css";

export default function CoordinatorAssignReviewers() {
  const router = useRouter();
  const nm_ctx = useContext(NetworkManagerContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [comboReviewers, setComboReviewers] = useState<any[]>([]);
  const [tagReviewers, setTagReviewers] = useState<any[]>([]);

  useEffect(()=> {
    (async () => {
      const [res, err_code] = await nm_ctx.request({
        method: "GET",
        path: `/users/reviewers`,
      });
      let reviewerEmails = [];
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          reviewerEmails.push(res.data[i].email);
        }
      }
      setComboReviewers(reviewerEmails);
      setLoading(false);
  })()}, []);

  return (
    <>
      {!loading? 
      <div className={styles.container}>
        <div className={styles.dropdown}>
          <ComboBox id={""} placeholder={"Assign Reviewer"} items={comboReviewers} onChange={(e) => {
            if (e.selectedItem) {
              comboReviewers.splice(comboReviewers.indexOf(e.selectedItem), 1);
              setComboReviewers([...comboReviewers]);
              setTagReviewers([...tagReviewers, e.selectedItem]);
            }
          }}/>
        </div>
        <div className={styles.listReviewers}>
          {tagReviewers.map((elem, i) => (
            <Tag
              key={i}
              onClick={(e) => {
                e.preventDefault();
                const t = tagReviewers.splice(i, 1);
                setTagReviewers([...tagReviewers]);
                setComboReviewers([...comboReviewers, t[0]])
              }}
            >
              {elem}
            </Tag>
          ))}
        </div>
        <div className={styles.assignBtn}>
          <Button
            onClick={() => {
              setSubmitting(true);
              nm_ctx.request({
                method: "PUT",
                path: `/applications/${router.query.slug}/reviewers`,
                data: {tagReviewers}
              });
              nm_ctx.request({
                method: "PATCH",
                path: `/applications/${router.query.slug}`,
                data: { app_status: "REVIEW" },
                show_progress: true,
              });
              setSubmitting(false);
            }}
            disabled={submitting}
          >
            Assign
          </Button>
        </div>
      </div>
      : <InlineLoading />}
    </>
  );
}
