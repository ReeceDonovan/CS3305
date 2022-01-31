import {
  DataTable,
  Loading,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from "carbon-components-react";
import * as api from "../../api";
import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ReviewerDataTable() {
  const [rowData, setRowdata] = useState([] as RowDataType[]);
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
          resp.data[i].status =
            resp.data[i].reviews[resp.data[i].reviews.length - 1]?.status;
          console.log(resp.data[i]);
        }

        setRowdata(resp.data as RowDataType[]);
        setLoading(false);
      } else {
        setRowdata([] as RowDataType[]);
        setLoading(true);
      }
    })();
  }, []);

  const headerData = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "submitter",
      header: "Submitter",
    },
    {
      key: "field",
      header: "Field",
    },
    {
      key: "createdAt",
      header: "Submitted",
    },
    {
      key: "updatedAt",
      header: "Updated",
    },
    {
      key: "status",
      header: "Status",
    },
  ];

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <DataTable
          // isSortable
          useZebraStyles
          // @ts-expect-error
          rows={rowData}
          headers={headerData}
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
            <TableContainer
              title="Applications"
              description="Manage applications"
            >
              <TableToolbarContent>
                <TableToolbar aria-label="data table toolbar">
                  <TableToolbarSearch
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
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
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map(
                          // @ts-expect-error
                          (cell, i) => (
                            <TableCell key={cell.id}>
                              {i === 0 ? (
                                <Link href={`/application/${row.id}`}>
                                  <a>
                                    <span>
                                      {row.cells[0].value
                                        ? row.cells[0].length > 30
                                          ? row.cells[0].value.substring(
                                              0,
                                              30
                                            ) + "..."
                                          : row.cells[0].value
                                        : `No name ${row.id}`}
                                    </span>
                                  </a>
                                </Link>
                              ) : (
                                <span>
                                  {cell.value
                                    ? cell.value.length > 30
                                      ? cell.value.substring(0, 30) + "..."
                                      : cell.value
                                    : "No data"}
                                </span>
                              )}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      )}
    </>
  );
}
