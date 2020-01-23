import React, { Component } from "react";
import Modal from "react-modal";
import FormValidator from "../../common/FormValidator";
import EmergencyDetailBlock from "./emergencyDetail/emergencyDetailBlock";

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
//Child component of profile page to show emergency contact details
class EmergencyContacts extends Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      {
        field: "Name",
        method: "isEmpty",
        validWhen: false,
        message: "Name is required"
      },
      {
        field: "Relation",
        method: "isEmpty",
        validWhen: false,
        message: "Relation is required"
      },
      {
        field: "ContactNumber",
        method: "isEmpty",
        validWhen: false,
        message: "Pleave provide a phone number"
      },
      {
        field: "ContactNumber",
        method: "isNumeric",
        validWhen: true,
        message: "Please enter numeric value only"
      },
      {
        field: "ContactNumber",
        method: "matches",
        args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/],
        validWhen: true,
        message: "That is not a valid phone number"
      }
    ]);

    this.state = {
      UserBasicInformationId: localStorage.getItem("BasicInfoId"),
      ...this.formData,
      validation: this.validator.valid(),
      modalIsOpen: false,
      showData: false
    };

    this.emergencyContacts = [];
    this.submitted = false;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  formData = {
    UserEmergencyContactId: "",
    Name: "",
    Relation: "",
    Occupation: "",
    ContactNumber: ""
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
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      let blocking = true;
      this.props.handler(blocking);
      let data = this.state;
      const url = "http://localhost:64519/CommonAPI/AddEmergencyContacts";
      this.props
        .APICall(url, data)
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
      let emergency = this.emergencyContacts[index];
      let data = {
          UserEmergencyContactId: emergency.UserEmergencyContactId
        },
        url = "http://localhost:64519/CommonAPI/DeleteEmergencyContact";
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
    let emergencyContacts = this.emergencyContacts[index];
    this.setState({ ...emergencyContacts });
    this.openModal();
  };

  showDetail() {
    var data = {
        UserBasicInformationId: localStorage.getItem("BasicInfoId")
      },
      url = "http://localhost:64519/CommonAPI/GetAllEmergencyContacts";
    this.props
      .APICall(url, data)
      .then(res => {
        // if (res && res.length > 0) {
        this.emergencyContacts = res;
        this.setState({ showData: true });
        // }
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
        event.target.type === "number"
          ? parseInt(event.target.value)
          : event.target.value
    });
  };

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;

    return (
      <div>
        {this.state.showData && (
          <div id="lists">
            <ul style={{ listStyle: "none inside", paddingRight: "40px" }}>
              {this.emergencyContacts.map((emergency, index) => (
                <EmergencyDetailBlock
                  key={index}
                  emergency={emergency}
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
              Please enter your emergency contact details
            </h2>

            <div className="row clearfix">
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      ref="Name"
                      name="Name"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.Name}
                      required
                    />
                  </div>
                  <label className={validation.Name.isInvalid ? "error" : ""}>
                    {validation.Name.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Relation">Relation</label>
                    {/* <input
                      type="text"
                      className="form-control"
                      placeholder="Relation"
                      ref="Relation"
                      name="Relation"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.Relation}
                      required
                    /> */}
                    <select
                      required
                      name="Relation"
                      ref="Relation"
                      className="form-control"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.Relation}
                    >
                      <option value="">Select Relation</option>
                      <option value="1">Brother</option>
                      <option value="2">Sister</option>
                      <option value="3">Father</option>
                      <option value="4">Mother</option>
                      <option value="5">Spouse</option>
                      <option value="6">Friend</option>
                    </select>
                  </div>
                  <label
                    className={validation.Relation.isInvalid ? "error" : ""}
                  >
                    {validation.Relation.message}
                  </label>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="Occupation">Occupation</label>
                    {/* <input
                      type="text"
                      className="form-control"
                      placeholder="Occupation"
                      name="Occupation"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.Occupation}
                      ref="Occupation"
                    /> */}
                    <select
                      required
                      name="Occupation"
                      ref="Occupation"
                      className="form-control"
                      onChange={this.handleInputChange}
                      defaultValue={this.state.Occupation}
                    >
                      <option value="">Select Occupation</option>
                      <option value="1">Professor</option>
                      <option value="2">Doctor</option>
                      <option value="3">Farmer</option>
                      <option value="4">Labour</option>
                      <option value="5">Business</option>
                      <option value="6">Lawyer</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="form-line">
                    <label htmlFor="ContactNumber">Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contact Number"
                      name="ContactNumber"
                      ref="ContactNumber"
                      defaultValue={this.state.ContactNumber}
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <label
                    className={
                      validation.ContactNumber.isInvalid ? "error" : ""
                    }
                  >
                    {validation.ContactNumber.message}
                  </label>
                </div>
              </div>
            </div>
            <button className="btn btn-primary waves-effect" type="submit">
              {this.state.UserEmergencyContactId > 0 ? "UPDATE" : "SUBMIT"}
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default EmergencyContacts;
