import { RFC } from "@/types";

const Table: Table = ({ children, className }) => {
  return (
    <div
      className={
        "relative overflow-x-auto border border-[#E4E7EC] rounded-lg " +
        className
      }>
      <table className="text-left rtl:text-right bg-white w-full">
        {children}
      </table>
    </div>
  );
};

Table.Head = ({ children }) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
};

Table.Body = ({ children }) => {
  return <tbody>{children}</tbody>;
};

Table.HeadCell = ({ children }) => {
  return (
    <th scope="col" className="text-xs text-[#667085] font-normal px-6 py-3">
      {children}
    </th>
  );
};

Table.Cell = ({ children }) => {
  return <td className="text-sm text-[#667085] p-6">{children}</td>;
};

Table.Row = ({ children }) => {
  return <tr className="odd:bg-[#F9FAFB]">{children}</tr>;
};

export default Table;

type Table = RFC<TableProps> & {
  Head: RFC;
  Body: RFC;
  HeadCell: RFC;
  Cell: RFC;
  Row: RFC;
};

type TableProps = {
  children?: React.ReactElement<any> | React.ReactElement<any>[];
  className?: string;
};
