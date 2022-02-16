import { Loading } from "carbon-components-react";
import * as api from "../../api";
import { useEffect, useState } from "react";
import ApplicationTable from "../ApplicationTable";

export default function ReviewerDataTable() {
  const [rowData, setRowdata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await api.request({
        method: "GET",
        path: "/applications",
      });

      if (resp?.data != null) {
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
        <ApplicationTable
          title={"My Applications"}
          description={"Applications you've submitted"}
          rows={rowData}
        />
      )}
    </>
  );
}
