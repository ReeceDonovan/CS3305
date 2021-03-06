/* eslint-disable @next/next/no-img-element */
import {
  Select,
  SelectItem,
  TableCell,
  TableRow,
} from "carbon-components-react";

import * as api from "../../api";
import { UserAvatar32 } from "@carbon/icons-react";

interface PermissionRow {
  row: {
    cells: [Cell];
  };
  id: number;
}

export interface Cell {
  errors: any;
  id: string;
  info: { header: string };
  isEditable: boolean;
  isEditing: boolean;
  isValid: boolean;
  value: any;
}

const permissionChange = async (id: number, role: string) => {
  try {
    await api.request({
      path: `/users/permissions`,
      method: "PATCH",
      data: { id, role },
    });
  } catch (err) {
    console.error(err);
  }
};

const renderSwitchCell = (cell: Cell, id: number): React.ReactNode | null => {
  switch (cell.info.header) {
    case "avatar":
      return (
        <span>
          {cell.value ? (
            <img
              style={{ height: 32, width: 32, borderRadius: "50%" }}
              src={cell.value}
              alt="avatar"
            />
          ) : (
            <UserAvatar32 />
          )}
        </span>
      );
    case "role":
      let roles = ["RESEARCHER", "REVIEWER", "COORDINATOR"];
      const rolesIndex = roles.indexOf(cell.value);
      [roles[0], roles[rolesIndex]] = [roles[rolesIndex], roles[0]];
      return (
        <span>
          <Select
            id={cell.id}
            name={cell.id}
            defaultValue={cell.value}
            noLabel
            onChange={(e) => {
              permissionChange(id, e.target.value);
            }}
          >
            {roles.map((e, i) => {
              return <SelectItem value={e} text={e} key={i} />;
            })}
          </Select>
        </span>
      );
    default:
      return (
        <span>
          {cell.value
            ? cell.value.length > 30
              ? cell.value.substring(0, 30) + "..."
              : cell.value
            : "No data"}
        </span>
      );
  }
};

export default function CoordinatorPermissionRow(props: PermissionRow) {
  return (
    <>
      <TableRow>
        {props.row.cells.map((cell, _) => (
          <TableCell key={cell.id}>
            {renderSwitchCell(cell, props.id)}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
}
