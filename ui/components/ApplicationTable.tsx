import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";

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

export default function ApplicationTable(props: {
  title: string;
  description: string;
  rows: RowDataType[];
}) {
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
          <TableContainer
            title={props.title || "Applications"}
            description={props.description || "Manage Applications"}
          >
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(
                    // @ts-expect-error
                    (header) => (
                      // eslint-disable-next-line react/jsx-key
                      <TableHeader {...getHeaderProps({ header })} isSortable>
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
