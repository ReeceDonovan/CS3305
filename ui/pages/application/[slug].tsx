import {
  Button,
  Form,
  Loading,
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

import { Application, Review, User } from "../../api/types";
import { Chat16 } from "@carbon/icons-react";
import Link from "next/link";
import { NetworkManagerContext } from "../../components/NetworkManager";
import Draft_view from "../../components/application/Draft_view";
import StaticApplication from "../../components/application/StaticApplication";
import ReviewView from "../../components/application/ReviewView";

// const ApplicationPage: NextPage = () => {
//   const [user, setUser] = useState<User>();
//   const router = useRouter();
//   const [application, setApplication] = useState<any>();
//   const [pdf, setPDF] = useState<ArrayBuffer>();

//   const [name, setName] = useState("");
//   const [author, setAuthor] = useState("");
//   const [supervisors, setSupervisors] = useState("");
//   const [description, setDescription] = useState("");

//   const [comment, setComment] = useState("");

//   const [reviewStatus, setReviewStatus] = useState("");

//   const nm_ctx = useContext(NetworkManagerContext);

//   useEffect(() => {
//     (async () => {
//       const user = await api.getToken();
//       if (user) {
//         setUser(user);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       const slug = router.query.slug as string;
//       if (slug && slug.length > 0) {
//         const [res, err_code] = await nm_ctx.request({
//           path: `/applications/${slug}`,
//           method: "GET",
//         });
//         if (err_code === 0) {
//           console.log(res.data);
//           setApplication(res.data);
//           setAuthor(res.data.submitter?.email);
//           setSupervisors(
//             res.data.supervisors ? res.data.supervisors[0]?.email : ""
//           );
//           setDescription(res.data.description);
//           setName(res.data.name);

//           setReviews(res.data.reviews);
//         }
//         api.fetchPDF(slug).then((response) => {
//           setPDF(response);
//         });
//       }
//     })();
//   }, [router.query.slug]);

//   const sendReview = async () => {
//     if (reviewStatus && reviewStatus !== "" && comment && comment !== "") {
//       try {
//         console.log(application.id);
//         const resp = await api.request({
//           path: `/applications/${application?.id}/reviews`,
//           method: "POST",
//           data: {
//             comment,
//             status: reviewStatus,
//           },
//         });

//         if (resp.status == 201) {
//           console.log("Success");
//           window.location.reload();
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   };

//   if (!application) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <Tabs
//         style={{
//           margin: "0px",
//         }}
//         type="container"
//         scrollIntoView={false}
//       >
//         {user?.role == "COORDINATOR" ||
//         user?.email == application.submitter?.email ||
//         user?.role == "REVIEWER" ? (
//           <Tab href="#review" id="review" label="Review">
//             {application.reviews.map((review: Review, i: Number) =>
//               review.comment ? (
//                 <Tile className={styles.reviewTile}>
//                   {i == 0 ? (
//                     <div
//                       style={{
//                         textAlign: "center",
//                         fontSize: "1.5rem",
//                       }}
//                     >
//                       <h2>Application submitted</h2>
//                     </div>
//                   ) : (
//                     <>
//                       <div>{review.comment ? review.comment : ""}</div>
//                       <div>
//                         {review.reviewer
//                           ? review.reviewer?.name
//                             ? review.reviewer.name
//                             : review.reviewer.email
//                           : "No data"}
//                       </div>
//                     </>
//                   )}
//                 </Tile>
//               ) : (
//                 <h3 style={{ textAlign: "center" }}>
//                   Added {review.status} status
//                 </h3>
//               )
//             )}
//             <div className={styles.reviewControls}>
//               <ModalWrapper
//                 shouldSubmitOnEnter={false}
//                 handleSubmit={(): boolean => {
//                   nm_ctx
//                     .request({
//                       path: `/reviews/${application.id}`,
//                       method: "POST",
//                       data: {
//                         comment: comment,
//                       },
//                     })
//                     .then(([res, err_code]) => {
//                       if (err_code == 0) {
//                         setComment("");
//                       }
//                     });
//                   return true;
//                 }}
//                 onSubmit={async (_e) => {
//                   const [res, err_code] = await nm_ctx.request({
//                     path: `/review/${application.id}`,
//                     method: "POST",
//                     data: {
//                       comment: comment,
//                     },
//                   });
//                   if (err_code === 0) {
//                     setComment("");
//                     setReviews([...reviews, res.data]);
//                   }
//                 }}
//                 buttonTriggerText="Add Comment"
//                 renderTriggerButtonIcon={Chat16}
//                 triggerButtonIconDescription="Add Comment"
//                 modalHeading="Add Comment"
//                 modalLabel="Add Comment"
//               >
//                 <div style={{ maxHeight: "60vh" }}>
//                   <TextArea
//                     labelText="Add Comment"
//                     onChange={(e) => setComment(e.target.value)}
//                   />
//                 </div>
//               </ModalWrapper>
//               <ModalWrapper
//                 shouldSubmitOnEnter={false}
//                 handleSubmit={(): boolean => {
//                   if (reviewStatus === "") {
//                     setstatusErrMsg("Please select a status");
//                     return false;
//                   }

//                   nm_ctx.request({
//                     path: `/reviews/${application.id}`,
//                     method: "POST",
//                     data: {
//                       status: reviewStatus,
//                     },
//                   });
//                   return true;
//                 }}
//               >
//                 Submit
//               </Button>
//             </div>
//           </Tab>
//         ) : null}
//       </Tabs>
//     </>
//   );
// };

const ApplicationPage = () => {
  const [application, setApplication] = useState<null | Application>(null);

  const nm_ctx = useContext(NetworkManagerContext);

  const router = useRouter();
  const slug = router.query.slug as string;

  useEffect(() => {
    (async () => {
      if (slug === "new") {
        setApplication({} as Application);
      } else if (slug && slug.length > 0) {
        const [res, err_code] = await nm_ctx.request({
          path: `/applications/${slug}`,
          method: "GET",
        });
        if (err_code === 0) {
          console.log(res.data);
          setApplication(res.data);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  if (slug === "new") {
    return (
      <Draft_view application={application} setApplication={setApplication} />
    );
  }

  if (!application) return <Loading />;

  if (application.app_status === "DRAFT")
    return <Draft_view id={slug} init_app={application} />;

  if (application.app_status === "PENDING")
    return <StaticApplication application={application} />;

  if (application.app_status === "REVIEWING")
    return (
      <>
        <StaticApplication application={application} />
        <ReviewView application={application} />
      </>
    );
};

export default ApplicationPage;
