import { Loading } from "carbon-components-react";
import * as api from "../../api";
import { useEffect, useState } from "react";
import ApplicationTable from "../ApplicationTable";

interface RowDataType {
  id: number;
  name: string;
  title: string;
  field: string;
  submitter: string;
  createdAt: string;
  updatedAt: string;
  reviewed: string;
  status: string;
}

export default function CoordinatorDashboard() {
  const [rowData, setRowdata] = useState([] as RowDataType[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const resp = await api.request({
        method: "GET",
        path: "/applications?t=all",
      });

      if (resp?.data) {
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

        setRowdata(resp.data as RowDataType[]);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <ApplicationTable onUpdate={
          () => {}
        } title={"Coordinator Panel"} rows={rowData} />
      )}
    </>
  );
}
