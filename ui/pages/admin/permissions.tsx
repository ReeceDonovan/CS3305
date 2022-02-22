import { DataTable, TableContainer, TableToolbarContent, TableToolbar, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Link } from "carbon-components-react";
import type { NextPage } from "next";
import React, { useEffect, useContext, useState } from "react";
import CoordinatorPermissionRow from "../../components/coordinator/CoordinatorPermissionRow";
import { NetworkManagerContext } from "../../components/NetworkManager";

const PermissionsPage: NextPage = () => {
  const [rows, setRows] = useState([]);
  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      const [res, err_code] = await nm_ctx.request({
        path: "/admin/users",
        method: "GET",
      });

      if (res.status == 200) {
        console.log(res)
        setRows(res.data)
      } else {
      }
    })();
  }, []);

  
  const headers = [
      {
        key: "id",
        header: "ID",
      },
      {
        key: "avatar",
        header: "Avatar",
      },
      {
        key: "school",
        header: "School",
      },
      {
        key: "name",
        header: "Name",
      },
      {
        key: "email",
        header: "Email",
      },
      {
        key: "role",
        header: "Role",
      },
    ]

  return (
    <>
      <DataTable
        // isSortable
        useZebraStyles
        rows={rows}
        // @ts-expect-error
        headers={headers}
      >
        {({
          // @ts-expect-error
          rows,
          // @ts-expect-error
          headers,
          // @ts-expect-error
          getTableProps,
          // @ts-expect-error
          getHeaderProps,
          // @ts-expect-error
          getRowProps,
        }) => (
          <TableContainer title={"Users Permissions"} description={<div><p>You can select new users permissions, to promote/users to Researcher, Reviewer and Coordinator status.</p>
          <p><b>Researcher:</b></p>
          <p>Researchers can create new applications, view applications, and edit their own applications.</p>
          <p><b>Reviewer:</b></p>
          <p>Reviewers can do all of the above with additional new features. Reviewers are also apart of the review board; Which is responsible for reviewing any new applications made by researchers.</p>
          <p><b>Coordinator:</b></p>
          <p>Coordinators can do all of the above with additional new features. Coordinators are the highet permission within the system. They are capable of using administrative level features such as settings, changing other permissions, assigning reviewers etc.</p></div>}>
            <TableToolbarContent>
              <TableToolbar aria-label="data table toolbar"></TableToolbar>
            </TableToolbarContent>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(
                    // @ts-expect-error
                    (header) => (
                      // eslint-disable-next-line react/jsx-key
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(
                  // @ts-expect-error
                  (row) => (
                    // eslint-disable-next-line react/jsx-key
                    <CoordinatorPermissionRow row={row} />
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

export default PermissionsPage;
