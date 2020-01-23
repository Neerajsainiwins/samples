import React, { Component } from "react";

const WorkDetailBlock = props => {
  const { work } = props;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return (
    <li>
      <div className="pull-right">
        <a
          onClick={props.handleEdit}
          className="m-4"
          style={{ cursor: "pointer" }}
        >
          <i className="material-icons">edit</i>
        </a>
        <a
          onClick={props.handleDelete}
          className="m-4"
          style={{ cursor: "pointer" }}
        >
          <i className="material-icons">delete</i>
        </a>
      </div>
      <div className="">
        <h3 className="desg">{work.Designation}</h3>
        <div>
          <span className="spec">Company Name {work.OrganisationName}</span>
        </div>

        <div className="display-flex">
          <div className="">
            <span className="spec">
              Dates Employed{" "}
              {monthNames[work.StartMonth] +
                "-" +
                work.StartYear +
                "  To  " +
                monthNames[work.EndMonth] +
                "-" +
                work.EndYear}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default WorkDetailBlock;
