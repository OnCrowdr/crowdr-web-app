import { RFC } from "@/types"
import { Children } from "react"

// TODO: ADD SORTING FUNCTIONALITY TO TABLE
const Table: Table = ({ children, className }) => {
  const childrenArray = Children.map(children, (child) => child)
  const [pagination] =
    childrenArray?.length! > 2 ? childrenArray?.splice(-1) || [] : []

  return (
    <div
      className={
        "relative overflow-x-auto border border-[#EAECF0] rounded-xl " +
        className
      }
    >
      <table className="text-left rtl:text-right bg-white w-full">
        {childrenArray}
      </table>
      {pagination}
    </div>
  )
}

Table.Head = ({ children }) => {
  return (
    <thead>
      <tr className="border-b border-[#EAECF0]">{children}</tr>
    </thead>
  )
}

Table.Body = ({ children }) => {
  return <tbody>{children}</tbody>
}

Table.HeadCell = ({ children }) => {
  return (
    <th scope="col" className="text-xs text-[#475467] font-normal px-6 py-3">
      {children}
    </th>
  )
}

Table.Cell = ({ children }) => {
  return <td className="text-sm text-[#101828] p-6">{children}</td>
}

Table.Row = ({ children }) => {
  //  last:border-b-0
  return (
    <tr className="border-b border-[#EAECF0]">{children}</tr>
  )
}

export default Table

type Table = RFC<TableProps> & {
  Head: RFC
  Body: RFC
  HeadCell: RFC
  Cell: RFC
  Row: RFC
}

type TableProps = {
  children?: React.ReactElement<any> | React.ReactElement<any>[]
  className?: string
}
