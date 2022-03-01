import { Button, Loading } from "carbon-components-react";
import * as api from "../../api";
import { useContext, useEffect, useState } from "react";
import ApplicationTable from "../ApplicationTable";
import { NetworkManagerContext } from "../NetworkManager";
import { Add16 } from "@carbon/icons-react";

export default function ReviewerDataTable() {
  const [rowData, setRowdata] = useState([]);
  const [loading, setLoading] = useState(true);

  // const nm_ctx =
  useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      const resp = await api.request({
        method: "GET",
        path: "/applications",
      });
      console.log(resp);
      if (resp?.data != null) {
        console.log(resp.data);
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].submitter = resp.data[i].submitter?.email;
          resp.data[i].updatedAt = new Date(
            resp.data[i].updatedAt
          ).toLocaleDateString();
          resp.data[i].createdAt = new Date(
            resp.data[i].createdAt
          ).toLocaleDateString();
          console.log(resp.data[i]);
        }

        setRowdata(resp.data);
        setLoading(false);
      } else {
        setRowdata([]);
        setLoading(true);
      }
    })();
  }, []);

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <>
          <ApplicationTable
            title={"My Applications"}
            description={"Applications you've submitted"}
            rows={rowData}
          />
        </>
      )}
    </>
  );
}
