import React, { Fragment } from 'react';
import Auth from '@aws-amplify/auth';
import { ConfirmSignUp } from 'aws-amplify-react';
// import { Container } from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React';
import verificationImg from "../../assets/images/verification-img.png";
import VerticalLayout from "../../components/VerticalLayout";
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, CardBody, Button, Modal, ModalBody, Container } from "reactstrap";
import Phone_number_verificationImage from "../../assets/images/Phone_number_verificationImage.png"
import { localStorageService } from "../../Utils/localStorageService";
import { Link } from "react-router-dom";
import API from "../../Utils/api";
import { ErrorToast } from "../../Utils/toaster";
import Loader from "../../components/Common/Loader";
// ../../components/Common/Loader
const CODE_LENGTH = new Array(6).fill(0);
export class ConfirmRegister extends ConfirmSignUp {
  constructor(props) {
    super(props);

    this.state = {
      initiateCountdown: false,
      countdown: 0,
      value: '',
      modal: false,
      activeTab: 1,
      selectedFiles: [],
      value: '',
      focused: false,
      isloading: false
    }
  }


  confirm(value) {
    this.setState({ isloading: true })
    const username = this.usernameFromAuthData() || this.inputs.username;
    // const { value } = this.state;
    if (!Auth || typeof Auth.confirmSignUp !== 'function') {
      this.setState({ isloading: true })
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported'
      );
    }

    Auth.confirmSignUp(username, value).then((user) => {
      this.props.authData && Auth.signIn(this.props.authData.username, this.props.authData.password).then(user => {
        localStorageService.storeAuthUser(user.signInUserSession.idToken.jwtToken)
        let first = user.attributes.name.split(' ');
        API.post("signup", { name: first[0] })
          .then((res) => {
            this.setState({ isloading: false })
            this.setState({ modal: false });
            if (res.data.msg === 'Accepted' || res.data.msg === 'Success' || res.data.msg === 'Account Exist') {
              this.changeState("signedIn", user);
              Auth.currentAuthenticatedUser().then((data) => {
                localStorageService.storeAuthUser(data.signInUserSession.idToken.jwtToken)
              })
              this.props.history.push('/dashboard')
            }
            else {
              localStorageService.clearLocalStorage();
              ErrorToast(res.data.msg);

            }
          }, (error) => {
            if (error) {
              localStorageService.clearLocalStorage();
              ErrorToast(error.data.msg);

            }
          }).catch(() => { localStorageService.clearLocalStorage(); }).catch(err => {
            localStorageService.clearLocalStorage();
            this.setState({ isloading: false })
            if (err.code === "PasswordResetRequiredException") {
              this.changeState("requireNewPassword");
              this.setState({ showToast: true, modal: false });
            } else {
              ErrorToast(err.message)
            }
          })

      })
    })
      .catch(err => {
        this.setState({ isloading: false })
        ErrorToast(err.message)
      });
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.initiateCountdown) {
        if (this.state.countdown > 0) {
          this.setState({ countdown: this.state.countdown - 1});
        } else {
          this.setState({initiateCountdown: false,value: ''})
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  togglemodal = () => {
    const { modal } = this.state;
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    if (modal === false) {
      this.setState({ value: '' })
      this.setState({ errMsg: '' })
    }
  }
  handleFocus = () => {
    this.setState({ focused: true });
  };
  handleBlur = () => {
    this.setState({ focused: false });
  };
  handleChange = e => {
    const value = e.target.value;
    this.setState(state => {
      if (state.value.length >= CODE_LENGTH.length) return null;
      return {
        value: (state.value + value).slice(0, CODE_LENGTH.length),
      };
    });
    if (this.state.value.length === 5) {
      let valueInput = this.state.value + value.slice(0, CODE_LENGTH.length)
      this.confirm(valueInput)
    }

  };
  handleKeyUp = e => {
    if (e.key === "Backspace") {
      this.setState(state => {
        return {
          value: state.value.slice(0, state.value.length - 1),
        };
      });
    }
  };

  showComponent(theme) {


    
    const { value, focused } = this.state;
    const values = value.split("");
    const username = this.usernameFromAuthData();
    const selectedIndex = values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;
    const hideInput = !(values.length < CODE_LENGTH.length);
    return (
      <VerticalLayout>
        <React.Fragment>
          <div className="page-content">
            <Container fluid>
              <div className="account-pages my-4 pt-sm-2">
                <div className="container">
                  <Row className="justify-content-center">
                    <Col md={9} lg={9} xl={9}>
                      <Card className="overflow-hidden">
                        <CardBody className="pt-0">
                          <div className="text-center p-2">
                            <Row className="justify-content-center">
                              <Col lg="10">
                                <h4 className="mt-4 font-weight-semibold">Verification</h4>
                                <p className="text-muted mt-3">
                                  We invest heavily in security to keep all of our customer safe.<br />
                                  Please validate your phone number to get started.</p>
                                <div className="mt-4">
                                  {/* button triggers modal */}
                                  <Button type="button" color="primary" onClick={this.togglemodal}>Click here for Verification</Button>
                                </div>
                              </Col>
                            </Row>

                            <Row className="justify-content-center mt-5 mb-2">
                              <Col sm="6" xs="8">
                                <div>
                                  <img src={verificationImg} alt="" className="img-fluid" />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </CardBody>
                      </Card>
                      <Modal isOpen={this.state.modal}
                        role="dialog"
                        size="lg"
                        dialogClassName="modal-80w"
                        aria-labelledby="example-custom-modal-styling-title"
                        autoFocus={true}
                        centered={true}
                        id="verificationModal"
                        tabIndex="-1"
                        toggle={this.togglemodal}>
                        <ModalBody id="example-custom-modal-styling-title">
                          <Row className="verificationModalBody">
                            <Col sm={4} md={4} lg={4} className="imageDiv">
                              <img src={Phone_number_verificationImage} alt="" className="img-fluid" /></Col>
                            <Col sm={8} md={8} lg={8}> <div class="closeModalIcon"> <i className="bx bx-x" onClick={this.togglemodal} /></div>
                              <div className="codeVerificationDiv">
                                <h4 className="font-weight-semibold"> Verification Code</h4>
                                <p class="text-muted mt-3">To complete your phone number verification, please Enter the 6 digit activation code</p>
                                <Row >
                                  <Col sm="12" xs="12">
                                    <label>SMS Code</label>
                                    <div className="wrap" onClick={this.handleClick}>
                                      {CODE_LENGTH.map((v, index) => {
                                        const selected = values.length === index;
                                        const filled = values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;
                                        return <Fragment>
                                          <div className="display">{values[index]}
                                            {(selected || filled) && focused && <div className="shadows" />}
                                          </div>
                                        </Fragment>
                                      })}
                                      <input
                                        value=""
                                        ref={this.input}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        onChange={this.handleChange}
                                        onKeyUp={this.handleKeyUp}
                                        className="input"
                                        style={{ width: "50px", top: "0px", bottom: "0px", left: `${selectedIndex * 50}px`, opacity: hideInput ? 0 : 1}}
                                      />
                                    </div>
                                    {/* <div className="verify-alert mt-3 mb-3" style={{ height: '40px' }}>
                                      {this.state.errMsg ? this.state.errMsg && <div className="error pt-2" style={{ 'fontSize': '11px' }}>{this.state.errMsg}</div> : ''}
                                    </div> */}
                                    <div className="mt-2">
                                      <Row>

                                        <Col><p>Didn't receive sms?</p></Col>
                                        <Col sm="12" xs="12" className="text-left">
                                          <button
                                            className="btn btn-primary w-md waves-effect waves-light"
                                            type="submit"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              this.resend();
                                              this.setState({ initiateCountdown: true, countdown: 30 })
                                            }}
                                            disabled={this.state.initiateCountdown ? true : false}
                                          >Resend code</button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                            {this.state.isloading && (<div className="tableLoaderDiv"><div className="loaderDiv"><Loader /></div></div>)}
                          </Row>
                        </ModalBody>
                        {/* </div> */}
                      </Modal>
                      <div className="mt-3 text-center">
                        <p>
                          Go back to{" "}
                          <Link to="/" onClick={(e) => { e.preventDefault(); this.changeState('signIn') }} className="font-weight-medium text-primary"> Sign In </Link>
                        </p>
                      </div>
                    </Col >
                  </Row >
                </div >
              </div >

            </Container>
          </div>

        </React.Fragment>
      </VerticalLayout>
    )
  }
}

export default withRouter(ConfirmRegister);