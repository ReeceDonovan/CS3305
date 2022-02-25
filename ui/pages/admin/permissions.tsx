import {
  DataTable,
  TableContainer,
  TableToolbarContent,
  TableToolbar,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableToolbarSearch,
} from "carbon-components-react";
import type { NextPage } from "next";
import React, { useEffect, useContext, useState } from "react";
import CoordinatorPermissionRow from "../../components/coordinator/CoordinatorPermissionRow";
import { NetworkManagerContext } from "../../components/NetworkManager";

import styles from "../../styles/permissions.module.css";
import style from "../../styles/index.module.css";
import { User } from "../../api/types";
import * as api from "../../api";

const DescriptionTable = () => {
  return (
    <table className={styles.descriptiontable}>
      <tbody>
        <tr>
          <td>
            <strong>Researcher</strong>
          </td>
          <td>
            <p>
              Researchers can create new applications, view those applications,
              and edit their own applications.
            </p>
            <p>
              If they are marked as a coauthor or supervisor on an application,
              they can also view and edit that application.
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Reviewer</strong>
          </td>
          <td>
            <p>
              Reviewers can do all of the above with additional new features.
            </p>
            <p>
              Reviewers are also apart of the review board, which is responsible
              for reviewing new applications made by researchers.
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Coordinator</strong>
          </td>
          <td>
            <p>
              Coordinators can do all of the above with additional new features.
            </p>
            <p>Coordinators have the highest permission within the system.</p>
            <p>
              They are capable of using administrative-level features such as
              system settings, changing others&apos; permissions, assigning
              reviewers etc.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PermissionsPage: NextPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      if (loading) {
        const [res, _] = await nm_ctx.request({
          path: "/users/permissions",
          method: "GET",
        });

        if (res.status == 200) {
          console.log(res);
          setRows(res.data);
        }

        const user = await api.getToken();
        if (user) {
          setUser(user);
        }

        setLoading(false);
      }
    })();
  }, [loading, nm_ctx]);

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
  ];

  return (
    <>
      {user?.role !== "COORDINATOR" && !loading ? window.location.href="/" : null}
      <div className={style.panel}>
        <DataTable
          // isSortable
          useZebraStyles
          rows={rows}
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
            // @ts-expect-error
            onInputChange
          }) => (
            <TableContainer
              title={"Users Permissions"}
              description={<DescriptionTable />}
            >
              <TableToolbarContent>
                <TableToolbar aria-label="data table toolbar">
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={onInputChange} />
                  </TableToolbarContent>
                </TableToolbar>
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
                      <CoordinatorPermissionRow
                        row={row}
                        id={row.cells[0].value}
                        key={row.cells[0].value}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    </>
  );
};

export default PermissionsPage;
