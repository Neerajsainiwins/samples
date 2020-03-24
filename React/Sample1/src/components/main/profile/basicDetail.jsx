import React, { Component } from "react";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import moment from "moment";
import FormValidator from "../../common/FormValidator";

//Child component of profile page to show basic details
class BasicDetails extends React.Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      {
        field: "FirstName",
        method: "isEmpty",
        validWhen: false,
        message: "First name is required"
      },
      {
        field: "LastName",
        method: "isEmpty",
        validWhen: false,
        message: "Last name is required"
      },
      {
        field: "FatherName",
        method: "isEmpty",
        validWhen: false,
        message: "Father name is required"
      },
      {
        field: "Nationality",
        method: "isEmpty",
        validWhen: false,
        message: "Nationality is required"
      },
      {
        field: "dob",
        method: "isEmpty",
        validWhen: false,
        message: "Date of birth is required"
      },
      {
        field: "dateofjoining",
        method: "isEmpty",
        validWhen: false,
        message: "Date of joining is required"
      },
      {
        field: "Gender",
        method: "isEmpty",
        validWhen: false,
        message: "Gender is required"
      }
    ]);
    this.state = {
      FirstName: "",
      MiddleName: "",
      LastName: "",
      FatherName: "",
      MotherName: "",
      Nationality: "",
      nationalityoption: [
        { id: "", value: "Select" },
        { id: "1", value: "India" },
        { id: "2", value: "USA" },
        { id: "3", value: "Canada" }
      ],
      Gender: "",
      genderoption: [
        { id: "", value: "Select" },
        { id: "1", value: "Male" },
        { id: "2", value: "Female" },
        { id: "3", value: "Other" }
      ],
      BloodGroup: "",
      BloodGroupoption: [
        { id: "", value: "Select" },
        { id: "1", value: "A+" },
        { id: "2", value: "A-" },
        { id: "3", value: "B+" },
        { id: "4", value: "B-" },
        { id: "5", value: "AB+" },
        { id: "6", value: "AB-" },
        { id: "7", value: "O+" },
        { id: "8", value: "O-" }
      ],
      MaritalStatus: "",
      MaritalStatusoption: [
        { id: "", value: "Select" },
        { id: "1", value: "Married" },
        { id: "2", value: "Unmarried" },
        { id: "3", value: "Divorced" }
      ],
      Religion: "",
      Religionoption: [
        { id: "", value: "Select" },
        { id: "1", value: "Hindu" },
        { id: "2", value: "Muslim" },
        { id: "3", value: "Sikh" },
        { id: "4", value: "Other" }
      ],
      Hobbies: "",
      dob: moment(),
      dateofjoining: moment(),
      AnniversaryDate: moment(),
      validation: this.validator.valid()
    };
    this.submitted = false;
  }

  handledob = moment => {
    let newState = this.state;
    newState.dob = moment;
    this.setState(newState);
  };
  handledoj = moment => {
    let newState = this.state;
    newState.dateofjoining = moment;
    this.setState(newState);
  };
  handleAnniversary = moment => {
    let newState = this.state;
    newState.AnniversaryDate = moment;
    this.setState(newState);
  };

  handleSelectChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      let blocking = true;
      this.props.handler(blocking);
      var data = {
          UserBasicInformationId: localStorage.getItem("BasicInfoId"),
          FirstName: this.refs.FirstName.value,
          MiddleName: this.refs.MiddleName.value,
          LastName: this.refs.LastName.value,
          FatherName: this.refs.FatherName.value,
          MotherName: this.refs.MotherName.value,
          Nationality: this.refs.Nationality.value,
          Gender: this.refs.Gender.value,
          BloodGroup: this.refs.BloodGroup.value,
          MaritalStatus: this.refs.MaritalStatus.value,
          dob: this.refs.dob.value,
          AnniversaryDate: this.refs.AnniversaryDate.value,
          dateofjoining: this.refs.dateofjoining.value,
          Religion: this.refs.Religion.value,
          Hobbies: this.refs.Hobbies.value
        },
        url = "http://localhost:64519/CommonAPI/AddBasicDetails";
      this.props
        .APICall(url, data)
        .then(res => {
          let blocking = false;
          this.props.handler(blocking);
          if (res.Success) {
            // this.handleRedirect();
            alert(res.Message);
          } else {
            alert(res.Message);
          }
        })
        .catch(error => {
          let blocking = false;
          this.props.handler(blocking);
          alert(error);
        });
    }
  };

  showDetail() {
    var data = {
        UserBasicInformationId: localStorage.getItem("BasicInfoId")
      },
      url = "http://localhost:64519/CommonAPI/GetBasicDetails";
    this.props
      .APICall(url, data)
      .then(res => {
        if (res != null) {
          let basicDetails = res[0];
          this.setState({ ...basicDetails });
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  componentDidMount() {
    this.showDetail();
  }

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;
    return (
      <form noValidate onSubmit={this.handleSubmit}>
        <h2 className="card-inside-title">Please enter your basic details</h2>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="FirstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  ref="FirstName"
                  name="FirstName"
                  defaultValue={this.state.FirstName}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <label className={validation.FirstName.isInvalid ? "error" : ""}>
                {validation.FirstName.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="MiddleName">Middle Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Middle Name"
                  ref="MiddleName"
                  name="MiddleName"
                  defaultValue={this.state.MiddleName}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="LastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  ref="LastName"
                  name="LastName"
                  defaultValue={this.state.LastName}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <label className={validation.LastName.isInvalid ? "error" : ""}>
                {validation.LastName.message}
              </label>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="FatherName">Father Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Father Name"
                  ref="FatherName"
                  name="FatherName"
                  defaultValue={this.state.FatherName}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <label className={validation.FatherName.isInvalid ? "error" : ""}>
                {validation.FatherName.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="MotherName">Mother Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mother Name"
                  ref="MotherName"
                  name="MotherName"
                  defaultValue={this.state.MotherName}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="Nationality">Nationality</label>
                <select
                  className="form-control"
                  ref="Nationality"
                  name="Nationality"
                  value={this.state.Nationality || ""}
                  onChange={this.handleSelectChange}
                >
                  {this.state.nationalityoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label
                className={validation.Nationality.isInvalid ? "error" : ""}
              >
                {validation.Nationality.message}
              </label>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="Gender">Gender</label>
                <select
                  className="form-control"
                  ref="Gender"
                  name="Gender"
                  value={this.state.Gender || ""}
                  onChange={this.handleSelectChange}
                >
                  {/* <option> Select</option> */}
                  {this.state.genderoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="BloodGroup">Blood Group</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Blood Group"
                  ref="bloodgroup"
                  name="BloodGroups"
                  defaultValue={this.state.BloodGroup}
                  onChange={this.handleInputChange}
                /> */}
                <select
                  className="form-control"
                  ref="BloodGroup"
                  name="BloodGroup"
                  value={this.state.BloodGroup || ""}
                  onChange={this.handleSelectChange}
                >
                  {/* <option> Select</option> */}
                  {this.state.BloodGroupoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="MaritalStatus">Marital Status</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Marital Status"
                  ref="MaritalStatus"
                  name="MaritalStatus"
                  defaultValue={this.state.MaritalStatus}
                  onChange={this.handleInputChange}
                /> */}
                <select
                  className="form-control"
                  ref="MaritalStatus"
                  name="MaritalStatus"
                  value={this.state.MaritalStatus || ""}
                  onChange={this.handleSelectChange}
                >
                  {/* <option> Select</option> */}
                  {this.state.MaritalStatusoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="dob">Date Of Birth</label>
                <DatetimePickerTrigger
                  name="dob"
                  moment={this.state.dob}
                  onChange={e => this.handledob(e)}
                  showTimePicker={false}
                  closeOnSelectDay={true}
                  format="DD'/'MM'/'YYYY"
                >
                  <input
                    type="text"
                    placeholder="Date Of Birth"
                    ref="dob"
                    value={this.state.dob.format("DD-MM-YYYY") || ""}
                    readOnly
                  />
                </DatetimePickerTrigger>
              </div>
              <label className={validation.dob.isInvalid ? "error" : ""}>
                {validation.dob.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="AnniversaryDate">Anniversary Date</label>
                <DatetimePickerTrigger
                  name="AnniversaryDate"
                  moment={this.state.AnniversaryDate}
                  onChange={e => this.handleAnniversary(e)}
                  showTimePicker={false}
                  closeOnSelectDay={true}
                  format="DD'/'MM'/'YYYY"
                >
                  <input
                    type="text"
                    placeholder="Anniversary Date"
                    ref="AnniversaryDate"
                    value={
                      this.state.AnniversaryDate.format("DD-MM-YYYY") || ""
                    }
                    readOnly
                  />
                </DatetimePickerTrigger>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="dateofjoining">Date Of Joining</label>
                <DatetimePickerTrigger
                  name="dateofjoining"
                  moment={this.state.dateofjoining}
                  onChange={e => this.handledoj(e)}
                  showTimePicker={false}
                  closeOnSelectDay={true}
                  format="DD'/'MM'/'YYYY"
                >
                  <input
                    type="text"
                    placeholder="Date Of Joining"
                    ref="dateofjoining"
                    value={
                      this.state.dateofjoining
                        ? this.state.dateofjoining.format("DD-MM-YYYY")
                        : ""
                    }
                    readOnly
                  />
                </DatetimePickerTrigger>
              </div>
              <label
                className={validation.dateofjoining.isInvalid ? "error" : ""}
              >
                {validation.dateofjoining.message}
              </label>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="Religion">Religion</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Religion"
                  ref="Religion"
                  name="Religion"
                  defaultValue={this.state.Religion}
                  onChange={this.handleInputChange}
                /> */}
                <select
                  className="form-control"
                  ref="Religion"
                  name="Religion"
                  value={this.state.Religion || ""}
                  onChange={this.handleSelectChange}
                >
                  {this.state.Religionoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="Hobbies">Hobbies</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hobbies"
                  ref="Hobbies"
                  name="Hobbies"
                  defaultValue={this.state.Hobbies}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary waves-effect" type="submit">
          SUBMIT
        </button>
      </form>
    );
  }
}

export default BasicDetails;
