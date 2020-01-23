import React, { Component } from "react";
import FormValidator from "../../common/FormValidator";

// Child component of proffile page to show contact details
class ContactDetails extends React.Component {
  constructor() {
    super();

    this.validator = new FormValidator([
      {
        field: "Email",
        method: "isEmpty",
        validWhen: false,
        message: "Personal email is required"
      },
      {
        field: "Email",
        method: "isEmail",
        validWhen: true,
        message: "Email is not in valid format"
      },
      {
        field: "AlternateEmail",
        method: "isEmail",
        validWhen: true,
        message: "Email is not in valid format"
      },
      {
        field: "PhoneNumber",
        method: "isEmpty",
        validWhen: false,
        message: "Contact number is required"
      },
      {
        field: "PhoneNumber",
        method: "isNumeric",
        validWhen: true,
        message: "That is not a valid contact number"
      },
      {
        field: "PhoneNumber",
        method: "matches",
        args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/],
        validWhen: true,
        message: "That is not a valid contact number"
      },
      {
        field: "AlternateNumber",
        method: "isNumeric",
        validWhen: true,
        message: "That is not a valid contact number"
      },
      {
        field: "AlternateNumber",
        method: "matches",
        args: [/^\(?\d\d\d\)? ?\d\d\d-?\d\d\d\d$/],
        validWhen: true,
        message: "That is not a valid contact number"
      },
      {
        field: "PermanentAddress",
        method: "isEmpty",
        validWhen: false,
        message: "Address is required"
      },
      {
        field: "PermanentCity",
        method: "isEmpty",
        validWhen: false,
        message: "City is required"
      },
      {
        field: "PermanentState",
        method: "isEmpty",
        validWhen: false,
        message: "State is required"
      },
      {
        field: "PermanentZIP",
        method: "isEmpty",
        validWhen: false,
        message: "Zip code is required"
      },
      {
        field: "PermanentZIP",
        method: "isNumeric",
        validWhen: true,
        message: "That is not a valid zip code"
      },
      {
        field: "PermanentCountry",
        method: "isEmpty",
        validWhen: false,
        message: "Coutry is required"
      },
      {
        field: "CorrespondenceZIP",
        method: "isNumeric",
        validWhen: true,
        message: "That is not a valid zip code"
      }
    ]);

    this.state = {
      Email: "",
      AlternateEmail: "",
      SkypeId: "",
      PhoneNumber: "",
      AlternateNumber: "",
      PermanentAddress: "",
      PermanentCity: "",
      PermanentState: "",
      stateoption: [
        { id: "", value: "Select" },
        { id: "1", value: "Chandigarh" },
        { id: "2", value: "Himachal" },
        { id: "3", value: "Punjab" },
        { id: "4", value: "Hariyana" },
        { id: "5", value: "Other" }
      ],
      PermanentZIP: "",
      PermanentCountry: "",
      countryoption: [{ id: "", value: "Select" }, { id: "1", value: "India" }],
      CorrespondenceAddress: "",
      CorrespondenceCity: "",
      CorrespondenceState: "",
      CorrespondenceCountry: "",
      CorrespondenceZIP: "",
      validation: this.validator.valid()
    };
    this.submitted = false;
  }

  showDetail() {
    var data = {
        UserBasicInformationId: localStorage.getItem("BasicInfoId")
      },
      url = "http://localhost:64519/CommonAPI/GetUserDetails";
    this.props
      .APICall(url, data)
      .then(res => {
        debugger;
        if (res != null) {
          let contactDetails = res[0];
          this.setState({ ...contactDetails });
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  componentDidMount() {
    this.showDetail();
  }

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
          Email: this.refs.Email.value,
          AlternateEmail: this.refs.AlternateEmail.value,
          SkypeId: this.refs.SkypeId.value,
          PhoneNumber: this.refs.PhoneNumber.value,
          AlternateNumber: this.refs.AlternateNumber.value,
          PermanentAddress: this.refs.PermanentAddress.value,
          PermanentCity: this.refs.PermanentCity.value,
          permanentState: this.refs.PermanentState.value,
          PermanentZIP: this.refs.PermanentZIP.value,
          PermanentCountry: this.refs.PermanentCountry.value,
          // sameaspermanent: this.refs.sameaspermanent.value,
          CorrespondenceAddress: this.refs.CorrespondenceAddress.value,
          CorrespondenceCity: this.refs.CorrespondenceCity.value,
          CorrespondenceState: this.refs.CorrespondenceState.value,
          CorrespondenceCountry: this.refs.CorrespondenceCountry.value,
          CorrespondenceZIP: this.refs.CorrespondenceZIP.value
        },
        url = "http://localhost:64519/CommonAPI/AddUserDetails";
      this.props
        .APICall(url, data)
        .then(res => {
          let blocking = false;
          this.props.handler(blocking);
          if (res.Success) {
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

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handlePermanentAddressChange = event => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value
    });
    let val = this.refs.sameaspermanent.checked;
    if (val) {
      this.handleSameAddress();
    }
  };

  handleSameAddress = e => {
    let val = this.refs.sameaspermanent.checked;
    if (val) {
      this.setState({
        CorrespondenceAddress: this.refs.PermanentAddress.value,
        CorrespondenceCity: this.refs.PermanentCity.value,
        CorrespondenceState: this.refs.PermanentState.value,
        CorrespondenceCountry: this.refs.PermanentCountry.value,
        CorrespondenceZIP: this.refs.PermanentZIP.value
      });
    }
    //  else {
    //   this.setState({
    //     CorrespondenceAddress: "",
    //     CorrespondenceCity: "",
    //     CorrespondenceState: "",
    //     CorrespondenceCountry: "",
    //     CorrespondenceZIP: ""
    //   });
    // }
  };

  render() {
    let validation = this.submitted
      ? this.validator.validate(this.state)
      : this.state.validation;
    return (
      // Section to submit contact details
      <form
        noValidate
        id="form_advanced_validation"
        method="POST"
        onSubmit={this.handleSubmit}
      >
        <h2 className="card-inside-title">Please enter your contact details</h2>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="Email">Personal Email</label>
                <input
                  type="Email"
                  className="form-control"
                  placeholder="Personal Email"
                  ref="Email"
                  name="Email"
                  value={this.state.Email}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <label className={validation.Email.isInvalid ? "error" : ""}>
                {validation.Email.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="AlternateEmail">Alternate Email</label>
                <input
                  type="Email"
                  className="form-control"
                  placeholder="Alternate Email"
                  ref="AlternateEmail"
                  name="AlternateEmail"
                  value={this.state.AlternateEmail}
                  onChange={this.handleInputChange}
                />
              </div>
              <label
                className={validation.AlternateEmail.isInvalid ? "error" : ""}
              >
                {validation.AlternateEmail.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="SkypeId">Skype Id</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Skype Id"
                  ref="SkypeId"
                  name="SkypeId"
                  value={this.state.SkypeId}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PhoneNumber">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contact Number"
                  ref="PhoneNumber"
                  name="PhoneNumber"
                  value={this.state.PhoneNumber}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <label
                className={validation.PhoneNumber.isInvalid ? "error" : ""}
              >
                {validation.PhoneNumber.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="AlternateNumber">Alternate Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Alternate Number"
                  ref="AlternateNumber"
                  name="AlternateNumber"
                  value={this.state.AlternateNumber}
                  onChange={this.handleInputChange}
                />
              </div>
              <label
                className={validation.AlternateNumber.isInvalid ? "error" : ""}
              >
                {validation.AlternateNumber.message}
              </label>
            </div>
          </div>
        </div>
        <h2 className="card-inside-title">Permanent Address</h2>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PermanentAddress">Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  ref="PermanentAddress"
                  name="PermanentAddress"
                  value={this.state.PermanentAddress}
                  onChange={this.handlePermanentAddressChange}
                  required
                />
              </div>
              <label
                className={validation.PermanentAddress.isInvalid ? "error" : ""}
              >
                {validation.PermanentAddress.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PermanentCity">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  ref="PermanentCity"
                  name="PermanentCity"
                  value={this.state.PermanentCity}
                  onChange={this.handlePermanentAddressChange}
                  required
                />
              </div>
              <label
                className={validation.PermanentCity.isInvalid ? "error" : ""}
              >
                {validation.PermanentCity.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PermanentState">State</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="State"
                  ref="PermanentState"
                  name="PermanentState"
                  value={this.state.PermanentState}
                  onChange={this.handlePermanentAddressChange}
                  required
                /> */}
                <select
                  className="form-control"
                  ref="PermanentState"
                  name="PermanentState"
                  value={this.state.PermanentState || ""}
                  onChange={this.handlePermanentAddressChange}
                >
                  {this.state.stateoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label
                className={validation.PermanentState.isInvalid ? "error" : ""}
              >
                {validation.PermanentState.message}
              </label>
            </div>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PermanentCountry">Country</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  ref="PermanentCountry"
                  name="PermanentCountry"
                  value={this.state.PermanentCountry}
                  onChange={this.handlePermanentAddressChange}
                  required
                /> */}
                <select
                  className="form-control"
                  ref="PermanentCountry"
                  name="PermanentCountry"
                  value={this.state.PermanentCountry || ""}
                  onChange={this.handlePermanentAddressChange}
                >
                  {this.state.countryoption.map(o => {
                    return (
                      <option value={o.id} key={o.id}>
                        {o.value}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label
                className={validation.PermanentCountry.isInvalid ? "error" : ""}
              >
                {validation.PermanentCountry.message}
              </label>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="PermanentZIP">ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ZIP Code"
                  ref="PermanentZIP"
                  name="PermanentZIP"
                  value={this.state.PermanentZIP}
                  onChange={this.handlePermanentAddressChange}
                  required
                />
              </div>
              <label
                className={validation.PermanentZIP.isInvalid ? "error" : ""}
              >
                {validation.PermanentZIP.message}
              </label>
            </div>
          </div>
        </div>
        <div style={{ display: "inline-block", width: "100%" }}>
          <h2 className="card-inside-title">Correspondence Address</h2>
          <div style={{ float: "right" }}>
            <input
              type="checkbox"
              id="md_checkbox_1"
              className="chk-col-red"
              defaultChecked=""
              ref="sameaspermanent"
              onChange={e => this.handleSameAddress(e)}
            />
            <label htmlFor="md_checkbox_1">Same As Permanent</label>
          </div>
        </div>
        <div className="row clearfix">
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="CorrespondenceAddress">Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  ref="CorrespondenceAddress"
                  name="CorrespondenceAddress"
                  value={this.state.CorrespondenceAddress}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="CorrespondenceCity">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  ref="CorrespondenceCity"
                  name="CorrespondenceCity"
                  value={this.state.CorrespondenceCity}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <div className="form-line">
                <label htmlFor="CorrespondenceState">State</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="State"
                  ref="CorrespondenceState"
                  name="CorrespondenceState"
                  value={this.state.CorrespondenceState}
                  onChange={this.handleInputChange}
                /> */}
                <select
                  className="form-control"
                  ref="CorrespondenceState"
                  name="CorrespondenceState"
                  value={this.state.CorrespondenceState || ""}
                  onChange={this.handleInputChange}
                >
                  {this.state.stateoption.map(o => {
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
                <label htmlFor="CorrespondenceCountry">Country</label>
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  ref="CorrespondenceCountry"
                  name="CorrespondenceCountry"
                  value={this.state.CorrespondenceCountry}
                  onChange={this.handleInputChange}
                /> */}
                <select
                  className="form-control"
                  ref="CorrespondenceCountry"
                  name="CorrespondenceCountry"
                  value={this.state.CorrespondenceCountry || ""}
                  onChange={this.handlePermanentAddressChange}
                >
                  {this.state.countryoption.map(o => {
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
                <label htmlFor="CorrespondenceZIP">ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ZIP Code"
                  ref="CorrespondenceZIP"
                  name="CorrespondenceZIP"
                  value={this.state.CorrespondenceZIP}
                  onChange={this.handleInputChange}
                />
              </div>

              <label
                className={
                  validation.CorrespondenceZIP.isInvalid ? "error" : ""
                }
              >
                {validation.CorrespondenceZIP.message}
              </label>
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

export default ContactDetails;
