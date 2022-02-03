import {
  DataTable,
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

import Link from "next/link";
import { useState } from "react";

ApplicationTable.defaultProps = {
  title: "Applications",
  description: "",
  rows: [],
  headers: [
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
  ],
};

export default function ApplicationTable(props: {
  title: String;
  description: String;
  headers: Array<{ key: string; header: string }>;
  rows: Array<Object>;
}) {

  const headerData = props.headers;

  return (
    <>
      <DataTable
        // isSortable
        useZebraStyles
        // @ts-expect-error
        rows={props.rows}
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
          <TableContainer title={props.title} description={props.description}>
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
                                        ? row.cells[0].value.substring(0, 30) +
                                          "..."
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
    </>
  );
}
