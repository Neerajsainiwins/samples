import React, { Fragment } from "react";
import { Modal, ModalBody, Alert, Row, Col, ModalHeader } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

const EmailVerifyScreen = (props) => {
  return (
    <Fragment>
      <Modal
        isOpen={props.showModal}
        dialogClassName="modal-40w"
        autoFocus={true}
        centered={true}
        tabIndex="-1"
        style={{ width: "30%" }}
      >
        <ModalHeader toggle={props.onClose} />
        <ModalBody>
          <div className="my-auto">
            <div className="text-center">
              <div className="avatar-md mx-auto">
                <div className="avatar-title rounded-circle bg-light">
                  <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                </div>
              </div>
              <div className="p-2 mt-4">
                <h4>Verify your email</h4>
                <p className="p-2 mt-4">
                  {" "}We have sent an email with your code to{" "}
                  <p className="font-weight-semibold">{props.email}</p>
                </p>
                <div className="p-2">
                  <Row className="justify-content-center">
                    <Col>
                      <AvForm className="form-horizontal"
                        onValidSubmit={() => props.onCodeVerification(props.code)}>
                        {props.errMsg &&
                          props.errMsg ?
                          (<Alert color="danger">{props.errMsg}</Alert>) :
                          null
                        }
                        <div className="form-group">
                          <AvField
                            name="code"
                            label="Enter code"
                            className="form-control"
                            placeholder="code"
                            onChange={props.onChange}
                            type="text"
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <button
                              className="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                              style={{ width: "90%" }}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </div>
                      </AvForm>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 text-center">
            <button className="btn btn-link" type="button" onClick={(e) => props.resendCode(e)}>Resend Code</button>
          </div>
          <div className="text-center mt-4">
            <p>{new Date().getFullYear()} © IIMMPACT SDN BHD</p>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};
export default EmailVerifyScreen;
