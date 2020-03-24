import React, { Component } from "react";

const EmergencyDetailBlock = props => {
  const { emergency } = props;
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
        <h3 className="desg">{emergency.Name}</h3>
        <div>
          <span className="spec">Relation {emergency.Relation}</span>
        </div>

        <div className="display-flex">
          <div className="">
            <span className="spec">
              Contact Number {emergency.ContactNumber}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default EmergencyDetailBlock;
