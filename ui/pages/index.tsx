import type { NextPage } from "next";
import {
  DataTable,
  DataTableRow,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  Tab,
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
  Tabs,
} from "carbon-components-react";
import About from "./about";

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

export default function Index() {
  var rowData = [] as RowDataType[];
  // list comprehension

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
      <Tabs type="container" scrollIntoView={false}>
        <Tab href="#review" id="review" label="Review">
          {rowData.length == 0 ? (
            <Loading />
          ) : (
            <DataTable
              isSortable
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
                                    <a href={`/application/${row.id}`}>
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
        </Tab>
        <Tab href="#research" id="research" label="Research">
          <About content={""} />
        </Tab>
      </Tabs>
    </>
  );
}
