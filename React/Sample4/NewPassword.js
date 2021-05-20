import React from "react";
import { Row, Col, CardBody, Card, Alert } from "reactstrap";
// import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import { RequireNewPassword } from "aws-amplify-react";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Auth } from "aws-amplify";
import { localStorageService } from "../../Utils/localStorageService";
// import images
import profileImg from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.png";
import { ErrorToast } from "../../Utils/toaster";

export class NewPassword extends RequireNewPassword {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            type: "",
            isEmailValid: false,
            newPassword: '',
            confirmNewPassword: ''

        };
        this._validAuthStates = ['requireNewPassword'];

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit = (event) => {
        event.preventDefault();
        let user = this.state.username;
        let password = this.state.newPassword

        console.log(this.props.authData);
        const attributes = this.props.authData.challengeParam.userAttributes
        attributes.name = this.state.username
        // let resp = super.signUp();
        Auth.completeNewPassword(this.props.authData, password, { name: attributes.name }).then((resp) => {
            this.changeState("signedIn", user);
            this.props.history.push('/dashboard')
            this.setState({ username: '', newPassword: '', confirmNewPassword: '' })
            Auth.currentAuthenticatedUser().then((data) => {
                localStorageService.storeAuthUser(data.signInUserSession.idToken.jwtToken)
            })

        })
            .catch(err => {
                // this.setState({
                //     message: err.message,
                //     type: "danger",
                // });
                ErrorToast(err.message)
            });
    }


    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    showComponent(theme) {
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
                                                    <h5 className="text-primary"> Change Password</h5>
                                                    {/* <p>Get your free IIMMPACT account.</p> */}
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
                                                {this.state.errMsg && this.state.errMsg ? (
                                                    <Alert color="danger">{this.state.errMsg}</Alert>
                                                ) : null}

                                                <AvField
                                                    id="newPassword"
                                                    key="newPassword"
                                                    name="newPassword"
                                                    validate={{
                                                        required: { value: true, errorMessage: 'Please enter a new password' },
                                                        minLength: { value: 8, errorMessage: 'Your Password must be minimum 8 characters' },
                                                    }}
                                                    onChange={this.handleInputChange}
                                                    label="New Password"
                                                    className="form-control"
                                                    placeholder="Enter new password"
                                                    type="password"
                                                    value={this.state.newPassword}


                                                    required
                                                />
                                                <AvField
                                                    id="confirmNewPassword"
                                                    key="confirmNewPassword"
                                                    name="confirmNewPassword"
                                                    onChange={this.handleInputChange}
                                                    label="Confirm New Password"
                                                    className="form-control"
                                                    placeholder="Enter new password"
                                                    type="password"
                                                    value={this.state.confirmNewPassword}
                                                    validate={{
                                                        required: { value: true, errorMessage: 'Please enter a confirm new password' },
                                                        minLength: { value: 8, errorMessage: 'Your Password must be minimum 8 characters' },
                                                        match: { value: 'newPassword', errorMessage: `'Confirm new password' and 'New Password' do not match.` }
                                                    }}
                                                    required
                                                />
                                                <div className="form-group">
                                                    <AvField
                                                        id="username"
                                                        key="username"
                                                        name="username"
                                                        onChange={this.handleInputChange}
                                                        label="Username"
                                                        className="form-control"
                                                        value={this.state.username}
                                                        placeholder="Enter name"
                                                        type="text"
                                                        required
                                                    />
                                                </div>


                                                <div className="mt-3">
                                                    <button
                                                        className="btn btn-primary btn-block waves-effect waves-light"
                                                        type="submit"
                                                    >
                                                        Change
                          </button>
                                                </div>

                                            </AvForm>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-5 text-center">
                                    <p>
                                        Go back to{" "}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.changeState("signIn");
                                            }}
                                            className="font-weight-medium text-primary btn-link"
                                        >
                                            {" "}
                                            login{" "}
                                        </button>
                                    </p>
                                    <p>© {new Date().getFullYear()} IIMMPACT SDN BHD</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div >
            </React.Fragment >
        );
    }
}

export default NewPassword;