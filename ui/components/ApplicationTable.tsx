import { Add16, RowInsert16 } from "@carbon/icons-react";
import {
  Button,
  DataTable,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TextArea,
} from "carbon-components-react";

import Link from "next/link";
import React, { useContext } from "react";
import { TextInput } from 'carbon-components-react';

import styles from '../styles/ApplicationTable.module.css'
import { Application } from '../api/types';
import { NetworkManagerContext } from "./NetworkManager";

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
      key: "app_status",
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
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newApp, setNewApp] = React.useState<Partial<Application> | null>({
    name: "",
    description: "",
  });

  
  const nm_ctx = useContext(NetworkManagerContext);

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
                {props.title === "My Applications" && (
                  <Button renderIcon={Add16} onClick={() => {setModalOpen(true)}} >
                    Create new Application
                  </Button>
                )}
              </TableToolbar>
            </TableToolbarContent>
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
      <Modal
        open={modalOpen}
        onRequestClose={() => {setModalOpen(false)}}
        onRequestSubmit={async () => {
          
          const [res, err] = await nm_ctx.request({
            path: "/applications",
            method: "POST",
            data: newApp,
          })

          if (err) {
            console.error(err)
          } else {
            setModalOpen(false)
            props.rows.push(res)
          }

          console.log("Uh")
        }}

        preventCloseOnClickOutside={false}
        title="New Application"

        primaryButtonText="Create"
        secondaryButtonText="Cancel"
        >
          {/* form with title and description of application */}
          <div className={styles.modal}>
            <h1>New Application</h1>
            <TextInput
              id="name"
              labelText="Name"
              placeholder="Name of your application"
              onChange={(e) => {setNewApp({...newApp, name: e.target.value})}}
            />
            <TextArea
              id="description"
              labelText="Description"
              placeholder="Description of your application"
              onChange={(e) => {setNewApp({...newApp, description: e.target.value})}}
            />
          </div>
        </Modal>
    </>
  );
}
