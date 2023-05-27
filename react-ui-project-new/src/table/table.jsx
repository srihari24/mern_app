import React, { useState } from "react";
import moment from 'moment'

import useTable from "./useTable";
import  "./table.css";
import TableFooter from "./tableFooter";

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  return (
    <>
      <table className={"table"}>
        <thead className={"tableRowHeader"}>
          <tr>
            <th className={"tableHeader"}>Country</th>
            <th className={"tableHeader"}>Capital</th>
            <th className={"tableHeader"}>Language</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el,i) => (
            <tr className={"tableRowItems"} key={i}>
              <td className={"tableCell"}>{el.fullName}</td>
              <td className={"tableCell"}>{el.loginTime && moment(el.loginTime).format('MMMM Do YYYY h:mm a')}</td>
              <td className={"tableCell"}>{el.logoutTime&& moment(el.logoutTime).format('MMMM Do YYYY h:mm a')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;
