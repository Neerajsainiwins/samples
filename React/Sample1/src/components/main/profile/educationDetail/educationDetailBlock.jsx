import React, { Component } from "react";

const EducationDetailBlock = props => {
  const { education } = props;
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
        <h3 className="desg">{education.InstituteName}</h3>
        <div>
          <span className="spec">Course {education.Course}</span>
        </div>

        <div className="display-flex">
          <div className="">
            <span className="spec">Passout Year {education.PassoutYear}</span>
          </div>
          <div className="Sans-15px-black-70%">
            <span className="spec ">Percentage {education.Percentage}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default EducationDetailBlock;
