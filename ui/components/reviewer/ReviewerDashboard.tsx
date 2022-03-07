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

export default function ReviewerDashboard() {
  const [rowData, setRowdata] = useState([] as RowDataType[]);
  const [loading, setLoading] = useState(true);

  const mapData = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      data[i].submitter = data[i].submitter?.email;
      data[i].updatedAt = new Date(
      data[i].updatedAt
      ).toLocaleDateString();
      data[i].createdAt = new Date(
        data[i].createdAt
      ).toLocaleDateString();
      // resp.data[i].status =
      //   resp.data[i].reviews[resp.data[i].reviews.length - 1]?.status;
      console.log(data[i]);
    }

    setRowdata(data as RowDataType[]);
  }

  useEffect(() => {
    (async () => {
      const resp = await api.request({
        method: "GET",
        path: "/applications?t=review",
      });

      if (resp?.data) {
        mapData(resp.data);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <ApplicationTable
          onUpdate={()=>{}}
          title={"Reviewer Panel"}
          description={"Applications you are reviewing"}
          rows={rowData}
        />
      )}
    </>
  );
}
