import React, { Fragment, Component } from 'react';
import { Row, Col, Card, CardTitle, CardBody, Container } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { ErrorToast } from "../../Utils/toaster";
import SweetAlertPop from "../../pages/Utility/SweetAlertPop";
import API from "../../Utils/api";
import { Auth } from "aws-amplify";
class ChangePassword extends Component {
    state = {
        changePassword: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        isloading: false,
        success_alert: {
            success: false,
            message: "",
            type: "",
            title: "",
        }
    }
    handleInputChange = (e) => {
        const { changePassword } = this.state;
        changePassword[e.target.name] = e.target.value;
        this.setState({ changePassword })
    }
    handleValidSubmit = (event) => {
        const { changePassword } = this.state;
        let apiData = {
            old_password: changePassword.oldPassword,
            new_password: changePassword.newPassword
        }
        this.setState({ isloading: true })
        Auth.currentSession()
            .then((data) => {
                API.defaults.headers.common[
                    "Authorization"
                ] = data.getIdToken().getJwtToken();
                API.post("auth/change-password", apiData)
                    .then((res) => {
                        let data = res.data;
                        if (data) {
                            this.setState({
                                isloading: false,
                                changePassword: { ...this.state.changePassword, oldPassword: '', newPassword: '', confirmNewPassword: '' },
                                success_alert: { ...this.state.success, success: true, message: res.data.message, type: "success", title: "Success!" },

                            });
                            // SuccessToast();
                        }
                    })
                    .catch((error) => {
                        this.setState({ isloading: false })
                        if (error.response.data) { ErrorToast(error.response.data.message) }
                    });
            })
            .catch((error) => {
                this.setState({ isloading: false })
                console.log(error);
                ErrorToast(error.message);
            });
    }
    handleConfirm = () => {
        this.setState({
            success_alert: {
                ...this.state.success,
                success: false,
                message: "",
                type: "",
                title: "",
                productDetail: "",
            }
        });
    }
    render() {
        const { changePassword, success_alert, isloading } = this.state;
        return (
            < Fragment >
                {
                    success_alert.success && <SweetAlertPop
                        title={success_alert.title}
                        type={success_alert.type}
                        confirmBtnBsStyle="success"
                        onConfirm={this.handleConfirm}
                        message={success_alert.message}
                    />
                }
                <div class="account-pages my-1 pt-sm-1">
                    <div className="page-content">
                        <Container fluid>
                            <Breadcrumbs title="" breadcrumbItem="Change Password" />
                            <Row className="justify-content-center">
                                <Col md={8} lg={6} xl={5}>
                                    <Card className="overflow-hidden p-3">
                                        <CardBody className="pt-0">
                                            <CardTitle>Change Password</CardTitle>
                                            <AvForm
                                                className="form-horizontal pt-3"
                                                onValidSubmit={(e) => this.handleValidSubmit(e)}
                                            >
                                                <AvField
                                                    id="oldPassword"
                                                    key="oldPassword"
                                                    name="oldPassword"
                                                    onChange={this.handleInputChange}
                                                    label="Old password"
                                                    className="form-control"
                                                    errorMessage="Please enter a old password"
                                                    placeholder="Enter Old Password"
                                                    type="password"
                                                    value={changePassword.oldPassword}
                                                    required
                                                />
                                                <AvField
                                                    id="newPassword"
                                                    key="newPassword"
                                                    name="newPassword"
                                                    errorMessage="Please enter a New password"
                                                    onChange={this.handleInputChange}
                                                    label="New Password"
                                                    className="form-control"
                                                    placeholder="Enter new password"
                                                    type="password"
                                                    value={changePassword.newPassword}
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
                                                    value={changePassword.confirmNewPassword}
                                                    validate={{
                                                        required: { value: true, errorMessage: 'Please enter a confirm new password' },
                                                        minLength: { value: 8, errorMessage: 'Your Password must be minimum 8 characters' },
                                                        match: { value: 'newPassword', errorMessage: `'Confirm new password' and 'New Password' do not match.` }
                                                    }}
                                                    required
                                                />
                                                <button
                                                    className="btn btn-primary w-md waves-effect waves-light"
                                                    type="submit"
                                                >
                                                    {isloading && <div className="spinner-border text-light mr-2" role="status" style={{ "width": "1.4rem", "height": "1.4rem" }}>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>}
                                                    Change Password
                          </button>
                                            </AvForm>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </Fragment >);
    }
}

export default ChangePassword;
