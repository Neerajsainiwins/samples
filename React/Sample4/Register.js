import React from "react";
import { Row, Col, CardBody, Card, Alert } from "reactstrap";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import { SignUp } from "aws-amplify-react";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Auth } from "aws-amplify";

import { callGetAPI } from '../../Utils/callAPI';
// Redux
import { Link } from "react-router-dom";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

class Register extends SignUp {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      type: "",
      isEmailValid: false,
    };
    this._validAuthStates = ['signUp'];

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event) {
    event.preventDefault();
    let { username, name, password, email } = this.inputs;
    if (this.state.isEmailValid) {
      // let resp = super.signUp();
      let user = { username: this.inputs.username, password: this.inputs.password }
      Auth.signUp({ username: username, password: password, attributes: { email: email, name: name, phone_number: this.phone_number } }).then((resp) => {
        this.changeState("confirmSignUp", user);
      }).catch(err => {
       
        
        // else {
          this.setState({ message: err.message, type: "danger" });
        // }
      });
    }
  }


  validateEmail(event, eventName, eventValue) {
   

    if((eventName).toLowerCase() === "username"){
      if (/\s/.test(eventValue)) {
        this.setState({ message: 'Spaces are not allowed in the username. Please enter avalid password', type: "danger" });
      }
      else{
        this.setState({ message: '', type: "" });
      }
    }
    if ((eventName).toLowerCase() === "email") {
      const validStatus = ["deliverable", "risky", "unknown"];
      event.preventDefault();
      // let statedata = this.state;
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(eventValue)) {
        callGetAPI("https://api.thechecker.co/v2/verify?email=" + encodeURI(eventValue) + "&api_key=c48754b091b7513d8d169d6b483978704d4217fe5643d04e7a80da8c39278244")
          .then((resp) => {
            if ((validStatus.indexOf(resp.data.result) > -1)) {
              this.setState({
                message: "",
                type: "",
                isEmailValid: true,
              })
            }
            else
              this.setState({
                message: "Error: please enter valid email",
                type: "danger",
                isEmailValid: false
              })
          })
      }
      else
        this.setState({
          message: "Error: please enter valid email",
          type: "danger",
          isEmailValid: false
        })
    }
  }

  componentDidMount() {
    // this.props.apiError("");
    // this.props.registerUserFailed("");
  }

  showComponent(theme) {
    this.signUpFields = this.props.signUpConfig.signUpFields;
    return (
      <React.Fragment>
        <div className="account-pages my-4 pt-sm-2">
          <div className="container">
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-soft-secondary">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-3">
                          <h5 className="text-primary"> Free Sign Up</h5>
                          <p>Get your free IIMMPACT account.</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profileImg} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      {/* <Link to="/"> */}
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="70"
                          />
                        </span>
                      </div>
                      {/* </Link> */}
                    </div>
                    <div className="p-2">
                      <AvForm
                        className="form-horizontal"
                        onValidSubmit={(e) => this.handleValidSubmit(e)}
                      >
                        {this.props.user && this.props.user ? (
                          <Alert color="success">
                            Sign Up User Successfully
                          </Alert>
                        ) : null}
                        {this.props.registrationError &&
                          this.props.registrationError ? (
                            <Alert color="danger">
                              {this.props.registrationError}
                            </Alert>
                          ) : null}
                        {this.state.message !== "" &&
                          <Alert color={this.state.type}>{this.state.message}</Alert>
                        }
                        {this.signUpFields.map(field => {
                          return field.key !== 'phone_number' ? (
                            <div className="form-group" key={'div.' + field.key}>
                              <AvField
                                key={field.key}
                                name={field.key}
                                label={field.label}
                                type={field.type}
                                required
                                onKeyUp={(e) => this.validateEmail(e, e.target.name, e.target.value)}
                                placeholder={field.placeholder}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          ) : (
                              <div key="div.phone_number" className="form-group">
                                <label className="active">Phone No.</label>
                                <IntlTelInput
                                  key="phone_number"
                                  name="phonr_number"
                                  defaultCountry="my"
                                  preferredCountries={['my', 'id']}
                                  containerClassName="intl-tel-input"
                                  inputClassName="form-control"
                                  separateDialCode={true}
                                  onPhoneNumberChange={(valid, phone, country) => {
                                    try {
                                      const number = phoneUtil.parseAndKeepRawInput(phone, country.iso2);
                                      this.onPhoneNumberChanged(phoneUtil.format(number, PNF.E164));
                                      sessionStorage.setItem("country", JSON.stringify(country));
                                      sessionStorage.setItem("phone_number", phone);

                                    } catch (error) {
                                      console.log(error.message);
                                    }
                                  }}
                                  onSelectFlag={(phone, country) => {
                                    try {
                                      const number = phoneUtil.parseAndKeepRawInput(phone, country.iso2);

                                      sessionStorage.setItem("country", JSON.stringify(country));
                                      sessionStorage.setItem("phone_number", phone);

                                      this.onPhoneNumberChanged(phoneUtil.format(number, PNF.E164));
                                    } catch (error) {
                                      console.log(error.message);
                                    }
                                  }}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            );
                        })}
                        <div className="mt-4">
                          <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Sign Up</button>
                        </div>
                        <div className="mt-4 text-center"><p className="mb-0">By registering you agree to the IIMMPACT <a className="text-primary" href="/#">Terms of Use</a></p></div>
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
                <div className="text-center">
                  <p>
                    Already have an account ?{" "}
                    <Link to="/"
                      onClick={(e) => { e.preventDefault(); this.changeState('signIn') }}
                      className="font-weight-medium text-primary"
                    >
                      {" "}
                      Sign In
            </Link>{" "}
                  </p>
                  <p>{new Date().getFullYear()} ©  IIMMPACT SDN BHD</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
//export default connect(mapStatetoProps, { registerUser, apiError, registerUserFailed })(Register);