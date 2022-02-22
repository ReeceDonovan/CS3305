import { TableRow, TableCell, SelectItem, Select } from "carbon-components-react";

interface PermissionRow {
  row: {
    cells: [Cell]
  }
}

interface Cell {
  errors: any
  id: string
  info: { header: string }
  isEditable: boolean
  isEditing: boolean
  isValid: boolean
  value: any
}

// FIXME: Switch img to Image
const renderSwitchCell = (cell: Cell): React.ReactNode | null => {
  switch(cell.info.header) {
    case "avatar":
      return <span>
          {/* I don't know why but next/Image doesn't work yes I know the build will fail :troll: */} 
          <img style={{height: 43, width: 43, borderRadius: "50%"}} src={cell.value} alt="avatar"/>
        </span>
    case "role":
      console.log(cell)
      return <span>
          <Select
            id={cell.id}
            name={cell.id}
            noLabel
          >
            {["RESEARCHER", "REVIEWER", "COORDINATOR"].map((e, i) => {
              return <SelectItem value={e} text={e} key={i} />;
            })}
          </Select>
        </span>
    default:
      return <span>
        {cell.value
          ? cell.value.length > 30
            ? cell.value.substring(0, 30) + "..."
            : cell.value
          : "No data"}
      </span>
  }
}

export default function CoordinatorPermissionRow(props: PermissionRow) {
  return (
    <>
      <TableRow>
        {props.row.cells.map(
          (cell, _) => (
            <TableCell key={cell.id}>
              {renderSwitchCell(cell)}
            </TableCell>
          )
        )}
      </TableRow>
    </>
  );
}