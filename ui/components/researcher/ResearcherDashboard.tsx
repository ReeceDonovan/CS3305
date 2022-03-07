import { Loading } from "carbon-components-react";
import * as api from "../../api";
import { useContext, useEffect, useState } from "react";
import ApplicationTable from "../ApplicationTable";
import { NetworkManagerContext } from "../NetworkManager";
export default function ReviewerDataTable() {
  const [rowData, setRowdata] = useState([] as RowDataType[]);
  const [loading, setLoading] = useState(true);

  useContext(NetworkManagerContext);


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

  const updateRowData = async() => {
    const resp = await api.request({
      method: "GET",
      path: "/applications",
    });

    mapData(resp?.data);
  }

  
  const mapData = (data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      data[i].submitter = data[i].submitter?.email;
      data[i].updatedAt = new Date(
      data[i].updatedAt
      ).toLocaleDateString();
      data[i].createdAt = new Date(
        data[i].createdAt
      ).toLocaleDateString();
      console.log(data[i]);
    }

    setRowdata(data as RowDataType[]);
  }


  useEffect(() => {
    (async () => {
      const resp = await api.request({
        method: "GET",
        path: "/applications",
      });
      console.log(resp);
      if (resp?.data != null) {
        mapData(resp.data);
        setLoading(false);
      } else {
        setRowdata([]);
        setLoading(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <>
          <ApplicationTable
            onUpdate={updateRowData}
            title={"My Applications"}
            description={"Applications you've submitted"}
            rows={rowData}
          />
        </>
      )}
    </>
  );
}
