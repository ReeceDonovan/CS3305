import { Button, Loading } from "carbon-components-react";
import * as api from "../../api";
import { useContext, useEffect, useState } from "react";
import ApplicationTable from "../ApplicationTable";

import { Add16 } from "@carbon/icons-react";
import { NetworkManagerContext } from "../NetworkManager";

export default function ReviewerDataTable() {
  const [rowData, setRowdata] = useState([]);
  const [loading, setLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      const [res, err_code] = await nm_ctx.request({
        method: "GET",
        path: "/applications",
      });
      console.log(res);
      if (err_code === 0) {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].submitter = res.data[i].submitter?.email;
          res.data[i].updatedAt = new Date(
            res.data[i].updatedAt
          ).toLocaleDateString();
          res.data[i].createdAt = new Date(
            res.data[i].createdAt
          ).toLocaleDateString();
          console.log(res.data[i]);
        }

        setRowdata(res.data);
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
          <Button style={{}} renderIcon={Add16}>
            Create new application
          </Button>
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
