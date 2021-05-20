import React, { Component } from "react";
import { Row, Col, Card, CardBody, Container, CardTitle, Button, Label, Input, FormGroup, CardHeader, Collapse } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { ErrorToast } from "../../Utils/toaster";
import { functionsofBtachTopup } from "./functionsofBtachTopup";
import API from "../../Utils/api";
import axios from "axios";
import LinearProgress from "../../pages/Utility/LinearProgressWith";
import ComfirmBox from "./comfirmBox";
let progress = [];
let pendingQuantity = 0;
const maxAPICalls = 10;

let pendingQuantityCount = 1;
class BatchTopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: "",
            progressEvent: 0,
            progressBarLoad: false,
            success_alert: { success: false, message: "", type: "", title: "", data: "" },
        }
    }
    handleChange = (e) => {
        const { value } = e.target;
        this.setState({ recipient: value })
    }
    handleSubmit = (e, ArrayUrls) => {
        const { recipient } = this.state;
        const recipientArray = recipient.split('\n');

        const valid = functionsofBtachTopup.CheckerValidValue(recipientArray);
        if (valid) {
            this.setState({ progressBarLoad: true })
            let Quantity = recipientArray.length;
            if (parseInt(Quantity) <= maxAPICalls && parseInt(Quantity) >= 1) {

                this.handelePayment(0, '', recipientArray.length, '');
                pendingQuantityCount = 1;
                pendingQuantity = 0;
            }
            else if (parseInt(Quantity) >= maxAPICalls) {
                if (pendingQuantity <= maxAPICalls && pendingQuantity > 0) {
                    let urls = functionsofBtachTopup.paymentFunction(recipientArray, pendingQuantityCount !== 0 ? maxAPICalls * (pendingQuantityCount - 1) : 0, recipientArray.length);
                    this.handelePayment('', '', '', urls);
                    pendingQuantityCount = 1;
                    pendingQuantity = 0;
                }
                else if (pendingQuantity >= 0) {
                    pendingQuantity = pendingQuantity > 0 ? pendingQuantity < maxAPICalls ? pendingQuantity : pendingQuantity - maxAPICalls : parseInt(Quantity) - maxAPICalls
                    let Endlength = maxAPICalls * pendingQuantityCount;
                    this.handelePayment(pendingQuantityCount !== 0 ? maxAPICalls * (pendingQuantityCount - 1) : 0, true, Endlength, ArrayUrls);
                }
            }
        }
    }
    handelePayment = (startPendingQuantity, againCallFunction, endNumber, ArrayUrls) => {

        const { recipient } = this.state;
        const recipientArray = recipient.split('\n');
        this.setState({ progressBarLoad: true })
        let urls = ArrayUrls ? ArrayUrls :
            functionsofBtachTopup.paymentFunction(recipientArray, startPendingQuantity, endNumber);
        const allRequests = urls.map(url => {
            return API.post("topup", url, {
                timeout: 10000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        progress.push(progressEvent.loaded * 100 / progressEvent.total)
                        //sum up all file progress percentages to calculate the overall progress
                        let totalPercent = progress ? Object.values(progress).reduce((sum, num) => sum + num, 0) : 0
                        //divide the total percentage by the number of files
                        let percent = parseInt(Math.round(totalPercent / recipientArray.length))
                        this.setState({ progressEvent: percent })
                    }
                }
            })
        });
        axios.all(allRequests).then(axios.spread((...responses) => {
            let res = responses[responses.length - 1];
            if (res.data.data.status === "Succesful" || res.data.data.status === "Accepted") {
                if (againCallFunction === true) {
                    pendingQuantityCount = pendingQuantityCount + 1;
                    this.handleSubmit()
                }
                else {
                    this.setState({
                        progressBarLoad: false, progressEvent: 0,
                        success_alert: {
                            success: true, message: "Transaction Accepted", title: "Accepted!", type: "success"
                        }
                    })
                    pendingQuantityCount = 1;
                    progress = [];
                }
            }
        })).catch((errors) => {
            if (errors) {
                this.setState({ progressBarLoad: false, progressEvent: 0 })
                this.handleErrorPayment(errors)
            }
        })
    }
    handleErrorPayment = (error) => {
        progress = []
        if (error) {
            let data = error.data;
            if (data) {
                if (data.status === "Failed") {
                    this.setState({
                        success_alert: {
                            ...this.state.success_alert, success: true, title: `${data.status}!`,
                            type: "warning", message: data.remarks
                        }
                    });
                }
            }
            else if (error.message === "timeout of 10000ms exceeded") {
                this.setState({
                    success_alert: {
                        ...this.state.success_alert, success: true,
                        title: `Uh Oh!`, type: "warning", alert_message_type: 'timeout',
                        message: 'This is taking longer than expected. You can check your here',
                    }
                });
            }
            else {
                this.setState({ isLoadingPayNow: false })
                ErrorToast(error.message);
            }
        }
    }
    handleConfirm = () => {
        const { success_alert } = this.state;
        this.setState({
            success_alert:
                { ...this.state.success_alert, success: false, message: "", type: "", title: "" },
            recipient: '', progressEvent: 0
        });
    }
    handleCancel = () => {
        this.setState({ success_alert: { ...this.state.success_alert, success: false, message: "", type: "", title: "" } });
        this.props.history.push('/reports/transactions');
    }
    render() {
        const { recipient, progressEvent, progressBarLoad, success_alert } = this.state;
        return (
            <React.Fragment>
                {success_alert.success && <ComfirmBox success_alert={success_alert} onConfirm={this.handleConfirm} onCancel={this.handleCancel} />}
                <div className="page-content">
                    <Container fluid>
                        <div className="container-fluid">
                            <Breadcrumbs title="BatchPayment" breadcrumbItem="Batch Payment" />
                        </div>
                        <Card>
                            <CardBody className="filtersidebar">
                                <CardTitle className="mb-5"><p className="font-size-16">Batch Recipient Details</p></CardTitle>
                                <Row>
                                    <Col lg="3" sm="12">
                                        <p><b>Paste Recipients Details</b> </p>
                                    </Col>
                                    <Col lg="9" sm="12">
                                        <p className="mb-2"><span>One line per recipient.</span></p>
                                        <p><b>Format: </b>Recipient number,product,amount</p>
                                        <p><b>EG: </b>0123456789,C,5</p>
                                        <Row>
                                            <Col lg="6" sm="12">
                                                <FormGroup>
                                                    <p><i>* Max 100 records at a time</i></p>
                                                    <Input
                                                        type="textarea"
                                                        id="formmessage"
                                                        className="form-control"
                                                        rows="6"
                                                        value={recipient}
                                                        onChange={this.handleChange}
                                                        name="Recipient"
                                                    />
                                                    <Button color="primary" className=" w-md waves-effect waves-light mt-2" onClick={this.handleSubmit}>Submit</Button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
                {progressBarLoad && <LinearProgress progressEvent={progressEvent} handleClick={functionsofBtachTopup.handleCancelButton} />}
            </React.Fragment >

        );
    }
}
export default BatchTopup;