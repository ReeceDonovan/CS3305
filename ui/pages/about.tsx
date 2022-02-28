import { Button } from "carbon-components-react";
import styles from "../styles/about.module.css";
import axios from "axios";
import Link from "next/link";

import * as api from "../api";

export default function About(props: { content: string }) {
  return (
    <>
      {props.content.length > 0 ? (
        <>
          <div className={styles.info}>
            <div dangerouslySetInnerHTML={{ __html: props.content }} />
            <Button href="/login">Log in with UCC Email</Button>
          </div>
        </>
      ) : (
        <>
          <h1
            style={{
              marginTop: "150px",
              textAlign: "center",
              fontSize: "4em",
            }}
          >
            Social Research Ethics Committee (SREC)
          </h1>
          <div className={styles.info}>
            <p>
              Ethics applications received by 6th December will be screened and
              where possible logged and sent for review by 14th December. If
              there are any changes needing to be made to these applications
              prior to them being logged, we will communicate these required
              changes to applicants. Applications received after the 6th
              December will be screened and logged after the Christmas break, in
              January 2022.
            </p>

            <p>
              SREC is one of three ethical approval committees at UCC (social
              research, animal experimentation, and clinical research). If you
              are unsure which University ethics committee you should apply to,
              please
              <Link href="https://www.ucc.ie/en/research/support/ethics/">
                <a>click here</a>
              </Link>
              . UCC academic staff and postgraduate research students can apply
              to SREC when undertaking social research where the methodology is
              not clinical or therapeutic in nature and proposes to involve:
            </p>

            <ul>
              <li>
                direct interaction with human participants for the purpose of
                data collection using research methods such as questionnaires,
                interviews, observations, focus groups etc.;
              </li>
              <li>
                indirect observation with human participants for example using
                observation, web surveys etc.;
              </li>
              <li>access to, or utilisation of, anonymised datasets;</li>
              <li>
                access to, or utilisation of, data or case files/records
                concerning identifiable individuals;
              </li>
              <li>conducting Internet Research or research online.</li>
            </ul>
            <p>
              As a policy SREC does not accept applications from non UCC
              applicants, taught postgraduate or undergraduate students. In
              general, applications from taught programmes should be dealt with
              at School/Department level. However, the university SREC will
              process complex or “high risk” ethics applications arising as part
              of taught postgraduate programmes. The high risk nature of the
              research should be outlined in an email from the supervisor and
              included with the application.
            </p>
            <p>
              SREC @ UCC considers itself an enabling committee, promoting
              strong research ethics amongst UCC&apos;s community of staff and
              student researchers. We are open to all types of research in the
              social research domain.
            </p>
            <Button href={`${api.API_URL}/login`}>Log in with UCC Email</Button>
          </div>
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const data = await axios.get(`${api.API_URL}/about`);
  console.log("Fetched about page");
  console.log(data.data);
  return {
    props: {
      content: data.data,
    },
  };
}
