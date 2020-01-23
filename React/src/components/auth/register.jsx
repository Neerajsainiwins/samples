import React, { Component } from "react";
import AjaxHelper from "../common/ajaxHelper";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import moment from "moment";
import "rc-datetime-picker/dist/picker.min.css";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import validator from "validator";
import classNames from "classnames";

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  formDefaults = {
    firstname: { value: "", isValid: true, message: "" },
    lastname: { value: "", isValid: true, message: "" },
    personalemail: { value: "", isValid: true, message: "" },
    alternateemail: { value: "", isValid: true, message: "" },
    terms: { value: false, isValid: true, message: "" },
    gender: { value: "Male", isValid: true, message: "" },
    blocking: false
  };

  state = {
    options: [
      { id: "0", value: "Male" },
      { id: "1", value: "Female" },
      { id: "2", value: "Other" }
    ],
    moment: moment(),
    dob: new Date(),
    ...this.formDefaults
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.formIsValid()) {
      this.setState({ blocking: true });
      var values = {
          ...this.state
        },
        url = "http://localhost:64519/CommonAPI/SignUpUser",
        data = {
          FirstName: values.firstname.value,
          LastName: values.lastname.value,
          Gender: values.gender.id,
          DateOfBirth: values.dob,
          Email: values.personalemail.value,
          AlternateEmail: values.alternateemail.value
        };
      let myajaxresult = AjaxHelper(url, data)
        .then(res => {
          this.setState({ blocking: false });
          if (res.Success) this.handleRedirect();
        })
        .catch(error => {
          this.setState({ blocking: false });
          alert(error);
        });
    }
  };

  formIsValid = () => {
    let firstname = this.state.firstname;
    let lastname = this.state.lastname;
    let personalemail = this.state.personalemail;

    let isGood = true;

    if (validator.isEmpty(firstname.value)) {
      firstname.isValid = false;
      firstname.message = "Please enter first name";
      isGood = false;
    }
    if (validator.isEmpty(lastname.value)) {
      lastname.isValid = false;
      lastname.message = "Please enter last name";
      isGood = false;
    }
    if (validator.isEmpty(personalemail.value)) {
      personalemail.isValid = false;
      personalemail.message = "Please enter email address";
      isGood = false;
    }

    if (!isGood) {
      this.setState({
        firstname,
        lastname,
        personalemail
      });
    }
    return isGood;
  };

  handleInputs = e => {
    this.setState({
      [e.target.name]: { value: e.target.value, isValid: true, message: "" }
    });
  };
  handleCheckInputs = e => {
    this.setState({
      [e.target.name]: { value: e.target.checked, isValid: true, message: "" }
    });
  };
  handleChange = moment => {
    let newState = this.state;
    newState.moment = moment;
    newState.dob = moment;
    this.setState(newState);
  };
  onLogin = event => {
    event.preventDefault();
    this.props.history.push(`/Login`);
  };

  handleRedirect = () => {
    this.props.history.push(`/Login`);
  };

  render() {
    document.body.classList.add("signup-page");
    const { firstname, lastname, personalemail, dob } = this.state;
    const firstnameGroupClass = classNames("erroralert", {
      error: !firstname.isValid
    });
    const lastnameGroupClass = classNames("erroralert", {
      error: !lastname.isValid
    });
    const personalemailGroupClass = classNames("erroralert", {
      error: !personalemail.isValid
    });
    const dobGroupClass = classNames("erroralert", {
      error: !dob.isValid
    });
    return (
      <div>
        <BlockUi tag="div" blocking={this.state.blocking} />
        <div className="signup-box">
          <div className="logo">
            <a>
              <b> DITS</b>
            </a>
          </div>
          <div className="card">
            <div className="body">
              <form id="sign_up" method="POST" onSubmit={this.onSubmit}>
                <div className="msg">Register a new membership</div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">person</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      name="firstname"
                      placeholder="First Name"
                      value={this.state.firstname.value}
                      onChange={e => this.handleInputs(e)}
                    />
                  </div>
                  <label className={firstnameGroupClass}>
                    {firstname.message}
                  </label>
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">person</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      name="lastname"
                      placeholder="Last Name"
                      value={this.state.lastname.value}
                      onChange={e => this.handleInputs(e)}
                    />
                  </div>
                  <label className={lastnameGroupClass}>
                    {lastname.message}
                  </label>
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">face</i>
                  </span>
                  <div className="form-line">
                    <select
                      className="form-control"
                      name="gender"
                      onChange={e => this.handleInputs(e)}
                    >
                      {this.state.options.map(o => {
                        return (
                          <option value={o.id} key={o.id}>
                            {o.value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">email</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="email"
                      className="form-control"
                      name="personalemail"
                      placeholder="Personal Email"
                      value={this.state.personalemail.value}
                      onChange={e => this.handleInputs(e)}
                    />
                  </div>
                  <label className={personalemailGroupClass}>
                    {personalemail.message}
                  </label>
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">email</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="email"
                      className="form-control"
                      name="alternateemail"
                      placeholder="Alternate Email"
                      value={this.state.alternateemail.value}
                      onChange={e => this.handleInputs(e)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">date_range</i>
                  </span>
                  <div className="form-line">
                    <DatetimePickerTrigger
                      name="dob"
                      moment={this.state.moment}
                      onChange={e => this.handleChange(e)}
                      showTimePicker={false}
                      closeOnSelectDay={true}
                      format="DD'/'MM'/'YYYY"
                    >
                      <input
                        type="text"
                        value={this.state.moment.format("DD-MM-YYYY")}
                        readOnly
                      />
                    </DatetimePickerTrigger>
                  </div>
                  <div className={dobGroupClass}>
                    <span className="help-block">{dob.message}</span>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="filled-in chk-col-pink"
                    value={this.state.terms.value}
                    onChange={e => this.handleCheckInputs(e)}
                  />
                  <label htmlFor="terms">
                    I read and agree to the terms of usage.
                  </label>
                </div>

                <button
                  className="btn btn-block btn-lg bg-pink waves-effect"
                  type="submit"
                >
                  SIGN UP
                </button>

                <div className="m-t-25 m-b--5 align-center">
                  <a onClick={event => this.onLogin(event)}>
                    You already have a membership?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
