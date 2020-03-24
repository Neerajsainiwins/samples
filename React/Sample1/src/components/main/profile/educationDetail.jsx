import React, { Component } from "react";
import Modal from "react-modal";
import FormValidator from "../../common/FormValidator";
import EducationDetailBlock from "./educationDetail/educationDetailBlock";

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
//Child componnent of profile page to show education details
class EducationDetail extends Component {
  constructor() {
    super();
    this.validator = new FormValidator([
      {
        field: "QualificationType",
        method: "isEmpty",
        validWhen: false,
        message: "Qualification type is required"
      },
      {
        field: "InstituteName",
        method: "isEmpty",
        validWhen: false,
        message: "Institute name is required"
      },
      {
        field: "Course",
        method: "isEmpty",
        validWhen: false,
        message: "Course name is required"
      },
      {
        field: "PassoutYear",
        method: "isEmpty",
        validWhen: false,
        message: "Select passout year"
      },
      {
        field: "Percentage",
        method: "isEmpty",
        validWhen: false,
        message: "Enter aggregate percentage"
      },
      {
        field: "Percentage",
        method: "isDecimal",
        validWhen: true,
        message: "That is not valid number"
      }
    ]);

    this.state = {
      UserBasicInformationId: localStorage.getItem("BasicInfoId"),
      ...this.formData,
      validation: this.validator.valid(),
      modalIsOpen: false,
      showData: false
    };

    this.educationDetails = [];
    this.submitted = false;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  formData = {
    EducationDetailId: "",
    QualificationType: "",
    InstituteName: "",
    Course: "",
    PassoutYear: "",
    Percentage: "",
    CurrentlyStudying: false
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
      const url = "http://localhost:64519/CommonAPI/AddEducationDetails";
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

  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleDelete = index => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      let education = this.educationDetails[index];
      let data = {
          EducationDetailId: education.EducationDetailId
        },
        url = "http://localhost:64519/CommonAPI/DeleteEducationDetails";
      this.props
        .APICall(url, data)
        .then(res => {
          let blocking = false;
          this.props.handler(blocking);
          alert(res.Message);
          this.showDetail();
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
    let education = this.educationDetails[index];
    this.setState({ ...education });
    this.openModal();
  };
  showDetail() {
    var data = {
        UserBasicInformationId: localStorage.getItem("BasicInfoId")
      },
      url = "http://localhost:64519/CommonAPI/GetEducationDetails";
    this.props
      .APICall(url, data)
      .then(res => {
        this.educationDetails = res;
        this.setState({ showData: true });
      })
      .catch(error => {
        alert(error);
      });
  }

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

  componentDidMount() {
    this.showDetail();
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
              {this.educationDetails.map((education, index) => (
                <EducationDetailBlock
                  key={index}
                  education={education}
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
          <form noValidate method="POST" onSubmit={this.handleSubmit}>
            <button
              className="btn btn-warning"
              onClick={this.closeModal}
              style={{ float: "right" }}
            >
              X
            </button>
            <h2 className="card-inside-title">
              Please enter your education details
            </h2>
            <div className="row clearfix">
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="QualificationType">
                      Qualification Type
                    </label>
                    <select
                      required
                      className="form-control"
                      ref="QualificationType"
                      name="QualificationType"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.QualificationType}
                    >
                      <option value="">Select qualification</option>
                      <option value="1">Graduation</option>
                      <option value="2">Post Graduation</option>
                      <option value="3">Diploma</option>
                      <option value="4">Degree</option>
                      <option value="5">Master Degree</option>
                    </select>
                  </div>
                  <label
                    className={
                      validation.QualificationType.isInvalid ? "error" : ""
                    }
                  >
                    {validation.QualificationType.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="InstituteName">Institute Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Institute Name"
                      ref="InstituteName"
                      name="InstituteName"
                      defaultValue={this.state.InstituteName}
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <label
                    className={
                      validation.InstituteName.isInvalid ? "error" : ""
                    }
                  >
                    {validation.InstituteName.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Course">Course Name</label>
                    <select
                      required
                      className="form-control"
                      ref="Course"
                      name="Course"
                      defaultValue={this.state.Course}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select Qualification</option>
                      <option value="1">BCA</option>
                      <option value="2">BTech(IT)</option>
                      <option value="3">BTech(Electronics)</option>
                      <option value="4">BTech(CS)</option>
                      <option value="5">BTech(Mechanical)</option>
                      <option value="6">MBA</option>
                      <option value="7">MCA</option>
                    </select>
                  </div>
                  <label className={validation.Course.isInvalid ? "error" : ""}>
                    {validation.Course.message}
                  </label>
                </div>
              </div>
            </div>
            <div className="row clearfix">
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="PassoutYear">Passout Year</label>
                    <select
                      required
                      ref="PassoutYear"
                      className="form-control"
                      name="PassoutYear"
                      defaultValue={this.state.PassoutYear}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select start year</option>
                      {years}
                    </select>
                  </div>
                  <label
                    className={validation.PassoutYear.isInvalid ? "error" : ""}
                  >
                    {validation.PassoutYear.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Percentage">Percentage</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Percentage"
                      ref="Percentage"
                      name="Percentage"
                      defaultValue={this.state.Percentage}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <label
                    className={validation.Percentage.isInvalid ? "error" : ""}
                  >
                    {validation.Percentage.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-4" style={{ paddingTop: "25px" }}>
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="CurrentlyStudying"
                    name="CurrentlyStudying"
                    className="chk-col-red"
                    defaultChecked={this.state.CurrentlyStudying}
                    ref="CurrentlyStudying"
                  />
                  <label htmlFor="CurrentlyStudying">Currently Studying</label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary waves-effect" type="submit">
              {this.state.EducationDetailId > 0 ? "UPDATE" : "SUBMIT"}
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default EducationDetail;
