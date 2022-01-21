import type { NextPage } from "next";
import {
  DataTable,
  DataTableRow,
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

import * as faker from "@faker-js/faker";

interface RowDataType {
  id: string;
  name: string;
  title: string;
  school: string;
  submitted: string;
  reviewed: string;
  status: string;
}

export default function Index() {
  var rowData = [] as RowDataType[];
  // list comprehension
  for (let i = 0; i < 10; i++) {
    rowData.push({
      id: i.toString(),
      name: faker.name.findName(),
      title: faker.lorem.words(4),
      school: faker.word.noun(),
      submitted: faker.date.past(1).toDateString(),
      reviewed: faker.date.recent(1).toDateString(),
      status: faker.random.arrayElement(["In Review", "Inactive", "Reviewed"]),
    });
  }

  const headerData = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "title",
      header: "Title",
    },
    {
      key: "school",
      header: "School",
    },
    {
      key: "submitted",
      header: "Submitted",
    },
    {
      key: "reviewed",
      header: "Reviewed",
    },
    {
      key: "status",
      header: "Status",
    },
  ];

  return (
    <>
      <Tabs type="container" scrollIntoView={false}>
        <Tab
          href="#review"
          style={{ marginTop: "8px" }}
          id="review"
          label="Review"
        >
          <DataTable
            isSortable
            useZebraStyles
            rows={rowData}
            headers={headerData}
          >
            {({
              rows,
              headers,
              getTableProps,
              getHeaderProps,
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
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        <TableCell className="bx--table-column-menu">
                          <OverflowMenu size="sm" flipped>
                            <OverflowMenuItem
                              itemText="View"
                              href="/application#view"
                            />
                            <OverflowMenuItem
                              itemText="Edit"
                              href="/application#edit"
                            />
                            <OverflowMenuItem
                              itemText="Share"
                              href="/application#share"
                            />
                          </OverflowMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Tab>
        <Tab
          href="#research"
          id="research"
          label="Research"
          style={{ marginTop: "8px" }}
        >
          {/* TODO this is a placeholder */}
          <About content={""} />
        </Tab>
      </Tabs>
    </>
  );
}
