import { Button, Loading, Tab, Tabs } from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import { StringExtendedApplication, User } from "../../api/types";
import { NetworkManagerContext } from "../../components/NetworkManager";
import Draft_view from "../../components/application/Draft_view";
import StaticApplication from "../../components/application/StaticApplication";
import ReviewView from "../../components/application/ReviewView";
import { getToken } from "../../api";

const ApplicationPage = () => {
  const [application, setApplication] = useState<StringExtendedApplication>();
  const [prev_app, setPrev_app] = useState<StringExtendedApplication>();

  const [user, setUser] = useState<User | null>(null);

  const nm_ctx = useContext(NetworkManagerContext);

  const router = useRouter();
  const slug = router.query.slug as string;

  const [sync_timeout, setSync_timeout] = useState<null | NodeJS.Timeout>(null);
  const [getting_id, setGetting_id] = useState<boolean>(false);

  const request_id = async (): Promise<[string, number]> => {
    // first negotiate a application id
    setGetting_id(true);
    const [res, err_code] = await nm_ctx.request({
      method: "POST",
      path: "/applications/",
    });
    setGetting_id(false);
    if (err_code === 0) {
      window.history.pushState(null, "", `/application/${res.data}`);
      application.id = parseInt(res.data);
      setApplication(application);
      return [res.data, 0];
    } else {
      return ["", err_code];
    }
  };

  const sync_and_send = async () => {
    setSync_timeout(null);

    if (getting_id) {
      setSync_timeout(setTimeout(sync_and_send, 2000));
    }

    //create diff application
    let modiflag = false;
    let diff_app = {} as StringExtendedApplication;
    if (application?.name != null && application.name != prev_app?.name) {
      diff_app.name = application.name;
      modiflag = true;
    }
    if (
      application?.description != null &&
      application?.description != prev_app?.description
    ) {
      diff_app.description = application?.description;
      modiflag = true;
    }
    if (application?.field != null && application?.field != prev_app?.field) {
      diff_app.field = application?.field;
      modiflag = true;
    }
    if (
      JSON.stringify(application?.coauthors?.sort()) !=
      JSON.stringify(prev_app?.coauthors?.sort())
    ) {
      diff_app.coauthors = application?.coauthors;
      modiflag = true;
    }
    if (
      JSON.stringify(application?.supervisors?.sort()) !=
      JSON.stringify(prev_app?.supervisors?.sort())
    ) {
      diff_app.supervisors = prev_app?.supervisors;
      modiflag = true;
    }

    if (modiflag === false) {
      if (sync_timeout != null) {
        clearTimeout(sync_timeout);
      }
      return;
    }

    let id = application?.id;
    if (!id) {
      const [res, err_code] = await request_id();
      if (err_code === 0) {
        id = parseInt(res);
      } else {
        return;
      }
    }
    setPrev_app({ ...prev_app, ...diff_app });
    nm_ctx.request({
      method: "PATCH",
      path: `/applications/${id}`,
      data: diff_app,
    });
  };

  const debounce_sync = async () => {
    if (sync_timeout == null) {
      setSync_timeout(setTimeout(sync_and_send, 2000));
    } else {
      clearTimeout(sync_timeout);
      setSync_timeout(setTimeout(sync_and_send, 2000));
    }
  };

  useEffect(() => {
    (async () => {
      if (slug && slug === "new") {
        setApplication({
          id: 0,
          name: "",
          description: "",
          field: "",
          hasFile: false,
          coauthors: [],
          submitter: "",
          supervisors: [],
          appStatus: "DRAFT",
          createdAt: "",
          updatedAt: "",
        } as StringExtendedApplication);
        setPrev_app({
          id: 0,
          name: "",
          description: "",
          field: "",
          hasFile: false,
          coauthors: [],
          submitter: "",
          supervisors: [],
          appStatus: "DRAFT",
          createdAt: "",
          updatedAt: "",
        } as StringExtendedApplication);
      } else if (slug && slug.length > 0) {
        const [res, err_code] = await nm_ctx.request({
          path: `/applications/${slug}`,
          method: "GET",
        });
        if (err_code === 0) {
          console.log(res.data);
          let fielded_app = res.data as StringExtendedApplication;
          fielded_app.coauthors = [];
          fielded_app.supervisors = [];
          for (let user of fielded_app.users ? fielded_app.users : []) {
            if (user.applicationRole === "SUBMITTER") {
              fielded_app.submitter = user.email;
            } else if (user.applicationRole === "SUPERVISOR") {
              fielded_app.supervisors.push(user.email);
            } else if (user.applicationRole === "COAUTHOR") {
              fielded_app.coauthors.push(user.email);
            }
          }
          setApplication(fielded_app);
          setPrev_app(fielded_app);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  if (!application) return <Loading />;

  if (slug === "new" && application.id === 0) {
    return (
      <Draft_view
        application={application}
        setApplication={setApplication}
        debounce_sync={debounce_sync}
        request_id={request_id}
      />
    );
  } else {
    console.log(application.appStatus);
    return (
      <Tabs
        style={{
          margin: "0px",
        }}
        type="container"
        scrollIntoView={false}
      >
        {application.appStatus === "DRAFT" && (
          <Tab href="#edit" id="edit" label="Edit">
            <Draft_view
              application={application}
              setApplication={setApplication}
              debounce_sync={debounce_sync}
            />
          </Tab>
        )}

        {(application.appStatus === "DRAFT" ||
          application.status === "SUBMITTED") && (
          <Tab href="#view" id="view" label="View">
            <StaticApplication application={application} />
            {user?.role != "RESEARCHER" && (
              <></>
              // <ReviewView application={application as Application} />
            )}
          </Tab>
        )}
      </Tabs>
    );
  }
};

export default ApplicationPage;
