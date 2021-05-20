import React, { Fragment } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
const SignPDFModel = (props) => {
    return (
        <Fragment>
            <Modal isOpen={props.showModal} role="dialog" size="lg" dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"
                autoFocus={true} centered={true} id="verificationModal" tabIndex="-1" style={{ width: '75%' }}>
                <ModalBody> 
                    <iframe title="Embedded PDF with Iframe" src={props.urlOfPDF} width="100%" height="650px"></iframe>
                </ModalBody>
                <ModalFooter><Button type="button" color="danger" onClick={(e) => props.closeHideModal(e)}>Close</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
}
export default withRouter(SignPDFModel);
