import React, { Component } from "react";
import Modal from "react-modal";
import FormValidator from "../../common/FormValidator";
import WorkDetailBlock from "./workDetail/workDetailBlock";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
Modal.setAppElement("#root");
// Child component of profile page to show work details
class WorkDetail extends Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      {
        field: "OrganisationName",
        method: "isEmpty",
        validWhen: false,
        message: "Organisation name is required"
      },
      {
        field: "OrganizationType",
        method: "isEmpty",
        validWhen: false,
        message: "Organisation type is required"
      },
      {
        field: "Designation",
        method: "isEmpty",
        validWhen: false,
        message: "Designation is required"
      },
      {
        field: "StartMonth",
        method: "isEmpty",
        validWhen: false,
        message: "Select start month"
      },
      {
        field: "StartYear",
        method: "isEmpty",
        validWhen: false,
        message: "Select start year"
      },
      {
        field: "EndMonth",
        method: "isEmpty",
        validWhen: false,
        message: "Select end month"
      },
      {
        field: "EndYear",
        method: "isEmpty",
        validWhen: false,
        message: "Select start year"
      }
    ]);

    this.state = {
      ...this.formData,
      validation: this.validator.valid(),
      modalIsOpen: false,
      showData: false
    };
    this.workDetail = [];
    this.submitted = false;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  formData = {
    UserBasicInformationId: "",
    UserWorkDetailId: "",
    OrganizationType: "",
    OrganisationName: "",
    Designation: "",
    StartYear: "",
    StartMonth: "",
    EndYear: "",
    EndMonth: ""
  };

  openModal() {
    let validation = this.validator.valid();
    this.submitted = false;
    this.setState({ validation, modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  handleSubmit = e => {
    e.preventDefault();

    const validation = this.validator.validate(this.state);
    const UserBasicInformationId = parseInt(
      localStorage.getItem("BasicInfoId")
    );
    this.setState({ UserBasicInformationId, validation });
    this.submitted = true;

    if (validation.isValid) {
      let blocking = true;
      this.props.handler(blocking);
      let url = "http://localhost:64519/CommonAPI/AddWorkDetails";
      this.props
        .APICall(url, this.state)
        .then(res => {
          let blocking = false;
          this.props.handler(blocking);
          alert(res.Message);
          this.showDetail();
          this.setState({ modalIsOpen: false });
        })
        .catch(error => {
          let blocking = false;
          this.props.handler(blocking);
          alert(error);
        });
    }
  };
  handleDelete = index => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      let work = this.workDetail[index];
      let data = {
          UserWorkDetailId: work.UserWorkDetailId
        },
        url = "http://localhost:64519/CommonAPI/DeleteWorkDetail";
      this.props
        .APICall(url, data)
        .then(res => {
          let blocking = false;
          alert(res.Message);
          this.showDetail();
          this.props.handler(blocking);
          this.setState({ showData: true });
        })
        .catch(error => {
          let blocking = false;
          this.props.handler(blocking);
          alert(error);
        });
    }
  };
  handleAdd = () => {
    this.setState({ ...this.formData });
    this.openModal();
  };

  handleEdit = index => {
    let workDetail = this.workDetail[index];
    this.setState({ ...workDetail });
    this.openModal();
  };
  showDetail() {
    var data = {
        UserBasicInformationId: parseInt(localStorage.getItem("BasicInfoId"))
      },
      url = "http://localhost:64519/CommonAPI/GetWorkDetails";
    this.props
      .APICall(url, data)
      .then(res => {
        if (res && res.length > 0) {
          this.workDetail = res;
          this.setState({ showData: true });
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  componentDidMount() {
    this.showDetail();
  }

  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]:
        event.target.attributes["data-type"] === "number"
          ? parseInt(event.target.value)
          : event.target.value
    });
  };

  showYears() {
    let years = [];
    for (let i = 0; i <= 30; i++) {
      years.push(
        <option
          key={new Date().getFullYear() - i}
          value={new Date().getFullYear() - i}
        >
          {new Date().getFullYear() - i}
        </option>
      );
    }
    return years;
  }

  render() {
    let years = this.showYears();
    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;

    return (
      <div>
        {this.state.showData && (
          <div id="lists">
            <ul style={{ listStyle: "none inside", paddingRight: "40px" }}>
              {this.workDetail.map((work, index) => (
                <WorkDetailBlock
                  key={index}
                  work={work}
                  handleEdit={() => this.handleEdit(index)}
                  handleDelete={() => this.handleDelete(index)}
                />
              ))}
            </ul>
          </div>
        )}
        <button
          className="btn btn-success waves-effect"
          style={{ float: "right" }}
          type="button"
          onClick={this.handleAdd}
        >
          Add
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <form
            noValidate
            id="form_advanced_validation"
            method="POST"
            onSubmit={this.handleSubmit}
          >
            <button
              className="btn btn-warning"
              onClick={this.closeModal}
              style={{ float: "right" }}
            >
              X
            </button>
            <h2 className="card-inside-title">
              Please enter your work details
            </h2>
            <div className="row clearfix">
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="OrganizationType">Organisation Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Organisation Type"
                      ref="OrganizationType"
                      name="OrganizationType"
                      data-type="number"
                      defaultValue={this.state.OrganizationType}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <label
                    className={
                      validation.OrganizationType.isInvalid ? "error" : ""
                    }
                  >
                    {validation.OrganizationType.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="OrganisationName">Organisation Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Organisation Name"
                      ref="OrganisationName"
                      name="OrganisationName"
                      defaultValue={this.state.OrganisationName}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <label
                    className={
                      validation.OrganisationName.isInvalid ? "error" : ""
                    }
                  >
                    {validation.OrganisationName.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Designation">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Designation"
                      ref="Designation"
                      name="Designation"
                      defaultValue={this.state.Designation}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <label
                    className={validation.Designation.isInvalid ? "error" : ""}
                  >
                    {validation.Designation.message}
                  </label>
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="StartYear">Start Year</label>
                    <select
                      required
                      name="StartYear"
                      ref="StartYear"
                      data-type="number"
                      className="form-control"
                      defaultValue={this.state.StartYear}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select start year</option>
                      {years}
                    </select>
                  </div>
                  <label
                    className={validation.StartYear.isInvalid ? "error" : ""}
                  >
                    {validation.StartYear.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="StartMonth">Start Month</label>
                    <select
                      required
                      name="StartMonth"
                      ref="StartMonth"
                      data-type="number"
                      className="form-control"
                      defaultValue={this.state.StartMonth}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select start month</option>
                      <option value="1">January</option>
                      <option value="2">Februrary</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">Novemember</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <label
                    className={validation.StartMonth.isInvalid ? "error" : ""}
                  >
                    {validation.StartMonth.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="EndYear">End Year</label>
                    <select
                      required
                      name="EndYear"
                      ref="EndYear"
                      className="form-control"
                      data-type="number"
                      defaultValue={this.state.EndYear}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select end year</option>
                      {years}
                    </select>
                  </div>
                  <label
                    className={validation.EndYear.isInvalid ? "error" : ""}
                  >
                    {validation.EndYear.message}
                  </label>
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="EndMonth" />
                    <select
                      required
                      name="EndMonth"
                      ref="EndMonth"
                      data-type="number"
                      className="form-control"
                      defaultValue={this.state.EndMonth}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select end month</option>
                      <option value="1">January</option>
                      <option value="2">Februrary</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">Novemember</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <label
                    className={validation.EndMonth.isInvalid ? "error" : ""}
                  >
                    {validation.EndMonth.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                {/* <button className="btn btn-success pull-right" type="button">
                  Add More
                </button> */}
              </div>
              <div className="col-sm-4" style={{ paddingTop: "25px" }}>
                {/* <input
                  type="checkbox"
                  id="currentlyworking"
                  className="chk-col-red"
                  defaultChecked=""
                  ref="currentlyworking"
                />
                <label htmlFor="currentlyworking">Currently Working</label> */}
              </div>
            </div>
            <button className="btn btn-primary waves-effect" type="submit">
              {this.state.UserWorkDetailId > 0 ? "UPDATE" : "SUBMIT"}
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default WorkDetail;
