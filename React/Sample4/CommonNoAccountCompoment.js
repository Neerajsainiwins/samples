import React, { Component, Fragment } from 'react';
import API from "../../../Utils/api";
import SelectReact from "../../Utility/SelectReact";
import serviceProviderOptions from "../serviceProviderOptions";
import { currenyFormatterShow, NumberFormatterShow } from "../../Utility/Formatter";
import GeneratingPinModal from "../Common/GeneratingPinModal";
import Loader from "../../../components/Common/Loader";
import { message } from "../constants/message";
import topup from "../../../assets/images/topupimage.png";
import { randomString } from "../../Utility/randomString";
import SweetAlertPop from "../../Utility/SweetAlertPop";
import { commonFunction } from "./commonFunction";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import copy from "copy-to-clipboard";
import { ErrorToast } from "../../../Utils/toaster";
import { accountNoRequires } from "./AccountNumber";
import OrderSummaryBody from "./OrderSummaryBody";
import LinearProgress from "../../Utility/LinearProgressWith";
import ChooseAmt from "./ChooseAmt";
import Outstanding from "../OustandingAmount";
import { Input } from "reactstrap";
import axios from "axios";
let progress = [];
let urls = []
const refId = randomString(20); //unique number
class CommonNoAccountCompoment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectProviderList: [],
            NoAccountNumberPayment: {
                selectedServiceProvider: '',
                amount: '',
                accountNumber: '',
                quantity: '1'
            },
            userAccountDetails: '',
            rangeValue: { minPrice: '', maxPrice: '' },
            amountValue: '',
            rangeError: { show: false, message: '' },
            isLoadingPayNow: false,
            totalAmount: '',
            success_alert: {
                success: false, message: "", type: "", title: "", data: ""
            },
            stopTopUpAPI: 0,
            GeneratingPin: false,
            generatingPin: {
                serial_Number: '',
                pin_Number: '',
                note: ''
            },
            copyModal: {
                openModal: false,
                message: ''
            },
            accountNumberRequired: false,
            showQuantity: 1,
            progress: 10,
            qunatityCount: 0,
            againCall: false,
            progressEvent: 0,
            progressBarLoad: false,
            showOrderSummary: false,
            flowWithBillPresentment: true,
            showToogleInputBoxAmount: false,
            outsandingAmount: '',
            showAmount: '',
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.product !== this.props.product) {
            if (this.props.pamas) {
                let productDetail = nextProps.product && commonFunction.getProductDetail(this.props.pamas);
                this.setState({ selectProviderList: productDetail })
            };
        }
    }
    componentDidMount() {
        if (this.props.product) {
            if (this.props.pamas) {
                let productDetail = this.props.product && commonFunction.getProductDetail(this.props.pamas);
                this.setState({ selectProviderList: productDetail })
            }
        }
    }

    handlePayNowWithQuantity = async () => {
        const { NoAccountNumberPayment, showQuantity, amountValue, accountNumberRequired, qunatityCount } = this.state;
        if (parseInt(showQuantity) === 1) {
            this.handlePayNow()
        }
        else {
            let i, urls = [];
            if (parseInt(showQuantity) === 1) {
                this.setState({ againCall: false });
                this.handelePayment(showQuantity, false)
            }
            else if (parseInt(showQuantity) <= 50 && parseInt(showQuantity) >= 1) {
                this.setState({ againCall: false });
                this.handelePayment(showQuantity, false)
            }
            else if (parseInt(showQuantity) >= 50) {
                if (qunatityCount <= 50 && qunatityCount > 0) {
                    console.log(qunatityCount)
                    this.setState({ againCall: false, qunatityCount: 0 });
                    this.handelePayment(qunatityCount, false);
                }
                else if (qunatityCount >= 0) {
                    console.log(qunatityCount)
                    let againCallFunction = true;
                    this.setState({ qunatityCount: qunatityCount > 0 ? qunatityCount < 50 ? qunatityCount : qunatityCount - 50 : parseInt(showQuantity) - 50, againCall: true })
                    this.handelePayment(50, againCallFunction);
                }
            }
        }
    }

    handelePayment = (quantity, againCallFunction, referenceId) => {
        this.setState({ progressBarLoad: true })
        const { NoAccountNumberPayment, amountValue, accountNumberRequired, againCall, showQuantity } = this.state;
        let i;
        for (i = 0; i < quantity; i++) {
            urls.push({
                refid: referenceId ? referenceId : randomString(20),
                product: NoAccountNumberPayment.selectedServiceProvider.obj ? NoAccountNumberPayment.selectedServiceProvider.obj.product_code : "",
                amount: parseInt(NoAccountNumberPayment.amount ? NoAccountNumberPayment.amount : amountValue)
            });
        }
        let urlsLength = urls.length - 1;
        const allRequests = urls.map(url => {
            return API.post("topup", url, {
                timeout: 10000,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        progress.push(progressEvent.loaded * 100 / progressEvent.total)
                        //sum up all file progress percentages to calculate the overall progress
                        let totalPercent = progress ? Object.values(progress).reduce((sum, num) => sum + num, 0) : 0
                        //divide the total percentage by the number of files
                        let percent = parseInt(Math.round(totalPercent / showQuantity))
                        this.setState({ progressEvent: percent })
                    }
                }
            })
        });
        axios.all(allRequests).then(axios.spread((...responses) => {
            let res = responses[responses.length - 1];
            if (res) {
                if (res.data.data.status === "Accepted" && res.data.data.statusCode === 0 ) {
                    let refidValue = urls[urlsLength].refid;
                    urls = [];
                    this.handelePayment(1, '', refidValue);
                }
                else if (res.data.data.status === "Succesful" && res.data.data.statusCode === 20) {
                    if (againCallFunction || againCall) {
                        urls = [];
                        this.handlePayNowWithQuantity();
                    }
                    else {
                         this.handelePayment('', '', res.data.data.refid);
                    }
                }
            }
        })).catch(errors => {
            this.setState({ progressEvent: 100 });
            if (errors) {
                this.setState({ progressBarLoad: false, progressEvent: 0 })
                this.handleErrorPayment(errors)
            }
        })
    }

    handlePayNow = (e, refid) => {
        const { NoAccountNumberPayment, amountValue, accountNumberRequired } = this.state;
        const refidValue = refid ? refid : refId;

        let passApiData = {
            refid: refidValue, product: NoAccountNumberPayment.selectedServiceProvider.obj ? NoAccountNumberPayment.selectedServiceProvider.obj.product_code : "",
            amount: parseInt(NoAccountNumberPayment.amount ? NoAccountNumberPayment.amount : amountValue)
        };
        if (accountNumberRequired) {
            passApiData['account'] = NoAccountNumberPayment.accountNumber;
        }
        if (NoAccountNumberPayment.accountNumber === '' && accountNumberRequired) {
            ErrorToast("Please enter Account number")
        }
        else {
            this.setState({ isLoadingPayNow: true })
            API.post("topup", passApiData, { timeout: 10000 }).then((res) => {

                if (res.data.data.status === "Accepted" && res.data.data.statusCode === 0 ) {
                    this.handlePayNow('', refId)
                }
                else if (res.data.data.status === "Succesful" && res.data.data.statusCode === 20) {
                    let data = res.data;
                    this.setState({ GeneratingPin: true, generatingPin: { ...this.state.generatingPin, serial_Number: data.data.sn, pin_Number: data.data.pin, note: data.data.note, voucherlink : data.data.voucherlink } });
                    this.setState({ isLoadingPayNow: false })
                }
            }, (error) => {
                this.setState({ isLoadingPayNow: false })
                if (error) { this.handleErrorPayment(error) } 
            })
        }
    }

    handleErrorPayment = (error) => {
        progress = []
        if (error) {
            let data = error.data;
            if (data) {
                if (data.status === "Failed") {
                    this.setState({ success_alert: { ...this.state.success_alert, success: true, title: `${data.status}!`, type: "warning", message: data.remarks } });
                }
            }
            else if (error.message === "timeout of 10000ms exceeded") {
                this.setState({ success_alert: { ...this.state.success_alert, success: true, title: `Uh Oh!`, type: "warning", message: 'This is taking longer than expected. You can check your here', alert_message_type: 'timeout' } });
            }
            else {
                this.setState({ isLoadingPayNow: false })
                ErrorToast(error.message);
            }
        }
    }
    fetchNetWorkStatusData = async (rowData, account_number) => {
        const { accountNumberRequired } = this.state;
        this.setState({ isLoading: true })
        let qureyData = { product: rowData.value };

        API.get("networkstatus", { timeout: 2000, params: qureyData }).then((res) => {
            let data = res.data;
            this.setState({ isLoading: false })
            if (data.data) {
                // "Healthy", "Interruption"
                if (data.data.network_status === "Interruption") {
                    if (account_number === false) {
                        this.getValueRange(rowData.obj.denomination);
                        this.handledenomination(rowData.obj)
                    }
                    else { this.setState({ showOtherAmountInput: false , priceList: [], showPriceList: true });}
                    this.setState({ NoAccountNumberPayment: { ...this.state.NoAccountNumberPayment, selectedServiceProvider: rowData }, success_alert: { ...this.state.success_alert, success: true, title: "Service Interruption!", type: "warning", data: rowData.obj, message: message.WarningMessage(rowData.obj.product_name) } });
                    this.handeleBillPresentmentValue()
                }
                else {
                    this.setState({ isLoading: false })
                    if (account_number === false) {  this.handledenomination(rowData.obj)}
                    else { this.setState({ showOtherAmountInput: false,  priceList: [], showPriceList: false });}
                    this.handeleBillPresentmentValue()
                }
            }
        }).catch((error) => {
            this.setState({ isLoading: false })
            if (account_number === false) {
                this.handledenomination(rowData.obj)
            }
            else {
                this.setState({ showOtherAmountInput: false, priceList: [], showPriceList: false });
            }
            this.handeleBillPresentmentValue()
        });
    };

    handeleBillPresentmentValue = async (e) => {
        const { NoAccountNumberPayment } = this.state;
        let product = NoAccountNumberPayment.selectedServiceProvider.obj;
        let dataQurey = { "product": product ? product.product_code : "" }
        let res = await this.props.handleBillPresentment('', dataQurey);
        if (res) {
            if (res.data) {
                let outstanding = Math.sign(res.data.Outstanding) === -1 ? -(Math.ceil(res.data.Outstanding * -1)) : res.data.Outstanding
                let amount = Math.ceil(outstanding)
                this.setState({ userAccountDetails: res });
                let totalAmountValue = commonFunction.getCalculateTotal(amount, product.unit_price, product.discount, '', product.update_time, NoAccountNumberPayment.quantity);
                this.setState({showOrderSummary: false, outsandingAmount: '', showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount})
            }
            else {
                this.setState({ flowWithBillPresentment: false });
            }
        }
        else {
            this.setState({ flowWithBillPresentment: false });
        }
    }

    handleChange = (e, name) => {
        const { NoAccountNumberPayment, userAccountDetailsOutsandingAmount, accountNumberRequired } = this.state;
        if (name) {
            if (name === 'selectedServiceProvider') {
                NoAccountNumberPayment[name] = e;
                NoAccountNumberPayment['amount'] = '';
                let account_number = this.checkAccountNumberRequire(e.obj);
                NoAccountNumberPayment['accountNumber'] = '';
                this.setState({ NoAccountNumberPayment, showOrderSummary: false, amountValue: '' });

                if (account_number === false) {
                    this.handledenomination(e.obj)
                    this.getValueRange(e.obj.denomination)
                    NoAccountNumberPayment['quantity'] = 1;
                    this.setState({ NoAccountNumberPayment, showQuantity: 1 })
                }
                else {
                    this.setState({ showOtherAmountInput: false });
                    this.setState({ priceList: [], showPriceList: false });
                }
                this.fetchNetWorkStatusData(e, account_number);

            }
            else if (name === 'amountValue') {
                const { amountValue, NoAccountNumberPayment } = this.state;
                const { pamas } = this.props;
                let value = amountValue === e ? '' : e;
                NoAccountNumberPayment['amount'] = ''
                if (value) {
                    let unit_price = NoAccountNumberPayment.selectedServiceProvider.obj.unit_price;
                    let discount = NoAccountNumberPayment.selectedServiceProvider.obj.discount;
                    let updateTime = NoAccountNumberPayment.selectedServiceProvider.obj.update_time;
                    let quantity = NoAccountNumberPayment.quantity
                    let totalAmountValue = commonFunction.getCalculateTotal(value, unit_price, discount, pamas, updateTime, quantity);
                    this.setState({ NoAccountNumberPayment, amountValue: value, showOrderSummary: true, showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount})
                } else {
                    this.setState({ NoAccountNumberPayment, amountValue: value, showOrderSummary: false })
                }
            }
        }
        else if (e.target.name === "showToogleInputBoxAmount") {
            let product = NoAccountNumberPayment.selectedServiceProvider.obj
            this.setState({ showToogleInputBoxAmount: e.target.checked });
            this.handledenomination(NoAccountNumberPayment.selectedServiceProvider.obj);
            if (e.target.checked === false) {
                let totalAmountValue = commonFunction.getCalculateTotal( userAccountDetailsOutsandingAmount, product.unit_price, product.discount, '', product.update_time, NoAccountNumberPayment.quantity);
                this.setState({ showOrderSummary: false, outsandingAmount: '', showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount})
            }
        }
        else if (e.target.name === "outsandingAmount") {
            if (e.target.validity.valid) {
                let value = e.target.value ? e.target.value : '';
                this.setState({ showOrderSummary: false, outsandingAmount: value, })
            }
        }
        else {
            if (e.target.name === "amount") {
                if (e.target.validity.valid) {
                    NoAccountNumberPayment[e.target.name] = e.target.value
                }
            }
            else {
                NoAccountNumberPayment[e.target.name] = e.target.value
            }
        }
        this.setState({ NoAccountNumberPayment })
    }

    getValueRange = (data) => {
        let price = [];
        if (data.includes("-") || data.includes(",")) {
            if (data.includes("-") || data.includes(",")) {
                price = data.includes("-") ? data.split("-") : data.split(",");
            }
            let dataPrice = price[0].includes(",") ? price[0].split(',') : ''
            this.setState({
                rangeValue: { ...this.state.rangeValue, minPrice: dataPrice !== '' ? dataPrice[0] : price[0], maxPrice: price[price.length - 1] },
                rangeError: { ...this.state.rangeError, show: true, message: `Please enter an amount between ${dataPrice !== '' ? dataPrice[0] : price[0]}-${price[price.length - 1]}` }
            })
        }
    }

    handleAmountChange = () => {
        const { rangeValue, NoAccountNumberPayment } = this.state;
        let product = NoAccountNumberPayment.selectedServiceProvider.obj;
        let value = parseInt(NoAccountNumberPayment.amount);
        if (value >= rangeValue.minPrice && value <= rangeValue.maxPrice) {
            NoAccountNumberPayment['amount'] = value
            this.setState({ NoAccountNumberPayment, showOrderSummary: true, amountValue: '', totalAmount: '' })
            let totalAmountValue = commonFunction.getCalculateTotal(value, product.unit_price, product.discount, '', product.update_time, NoAccountNumberPayment.quantity);
            this.setState({ showOrderSummary: true, outsandingAmount: value, showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount })
        } else {
            NoAccountNumberPayment['amount'] = ''
            this.setState({ NoAccountNumberPayment, totalAmount: '', amountValue: '', showOrderSummary: false })
        }
    }

    handleCofirmSuccess = () => {
        this.setState({ success_alert: { ...this.state.success_alert, success: false, message: "", type: "", title: "", productDetail: "" }, GeneratingPin: false, amountValue: '', showPriceList: false });
        this.setState({ NoAccountNumberPayment: { ...this.state.NoAccountNumberPayment, selectedServiceProvider: '', amount: '' }, totalAmount: '', showOrderSummary: false })
    }

    handleConfirm = () => {
        const { success_alert } = this.state;
        if (success_alert.data !== "" && success_alert.data) {
            this.handledenomination(success_alert.data);
        }
        this.setState({ success_alert: { ...this.state.success_alert, success: false, message: "", type: "", title: "" } });
    }

    handleCancel = () => {
        this.setState({ success_alert: { ...this.state.success_alert, success: false, message: "", type: "", title: "" } });
        this.props.history.push('/reports/transactions');
    }

    handledenomination = (data) => {
        let priceListData = [];
        this.getValueRange(data.denomination);
        let denoArray = [5, 10, 30, 50, 100];
        if (data.denomination.includes(",")) {
            let priceRange = [];
            let price = data.denomination.split(",");
            price.map((item) => {
                if (item.match(/^-{0,1}\d+$/)) {
                    priceRange.push(item);
                    priceListData["price"] = priceRange;
                    priceListData["discount"] = data.discount;
                    this.setState({ showOtherAmountInput: false });
                } else if (item.includes("-")) {
                    let itemPrice = item.split("-");
                    denoArray.map((item) => {
                        let value = parseInt(item);
                        if ((itemPrice[1] > value || itemPrice[0] < value) && (100 > itemPrice[1] || itemPrice[0] < 100)) {
                            priceRange.push(value);
                        }
                    });
                    this.setState({ showOtherAmountInput: true });
                    priceListData["price"] = priceRange;
                    priceListData["discount"] = data.discount;
                }
            });

        } else if (data.denomination.includes("-")) {
            this.setState({ showOtherAmountInput: true });
            let price = data.denomination.split("-");
            let priceRange = [];
            denoArray.map((item) => {
                if (price[1] > item || price[0] < item) {
                    priceRange.push(item);
                }
            });
            priceListData["price"] = priceRange;
            priceListData["discount"] = data.discount;
        } else {
            this.setState({ showOtherAmountInput: false });
            let price = [data.denomination];
            priceListData["price"] = price;
            priceListData["discount"] = data.discount;
        }
        this.setState({ priceList: priceListData, showPriceList: true });
    }

    handleCopy = (e, name) => {
        const { generatingPin } = this.state;
        if (name === 'serial_number') {
            copy(generatingPin.serial_Number);
            this.setState({ copyModal: { ...this.state.copyModal, openModal: true, message: 'The serial number code has been copied.' } });
        } else if (name === 'pin_number') {
            copy(generatingPin.pin_Number);
            this.setState({ copyModal: { ...this.state.copyModal, openModal: true, message: 'The pin number code has been copied.' } });
        }
    }

    handleCloseSnackBar = () => {
        this.setState({ copyModal: { ...this.state.copyModal, openModal: false, message: '' } });
    }

    handleCopyClose = () => {
        this.setState({ GeneratingPin: false })
    }

    checkAccountNumberRequire = (rowData) => {
        let dataVar = accountNoRequires;
        const found = dataVar.some(dataVar => dataVar.product_code === rowData.product_code);
        if (found) {
            this.setState({ accountNumberRequired: true });
            return true
        } else {
            this.setState({ accountNumberRequired: false })
            return false
        }
    }

    handleChangeQuantity = (e) => {
        const { NoAccountNumberPayment, amountValue } = this.state;
        const { amount, selectedServiceProvider, quantity } = this.state.NoAccountNumberPayment;
        const { name, value } = e.target;

        if (value >= 1 && value <= 3000) {
            let totalAmountValue = commonFunction.getCalculateTotal(amount ? amount : amountValue,
                selectedServiceProvider.obj.unit_price, selectedServiceProvider.obj.discount, selectedServiceProvider.obj.discount.product_category,
                selectedServiceProvider.obj.update_time, value);
            NoAccountNumberPayment[name] = value;
            this.setState({ NoAccountNumberPayment, showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount, showQuantity: value });
        }
        else if (value <= 1 && value >= 3000 || value === '') {
            const { NoAccountNumberPayment } = this.state;
            NoAccountNumberPayment[name] = value === '' ? '' : 1;
            this.setState({ NoAccountNumberPayment, showQuantity: 1 })
        }
    }

    handleCancelButton = () => {
        window.location.reload(false);
    }

    handleAmountChangeOutstanding = (e) => {
        const { rangeValue, outsandingAmount, NoAccountNumberPayment } = this.state;
        let value = parseInt(outsandingAmount);
        let product = NoAccountNumberPayment.selectedServiceProvider.obj;
        if (value >= rangeValue.minPrice && value <= rangeValue.maxPrice) {
            let totalAmountValue = commonFunction.getCalculateTotal(value, product.unit_price, product.discount, '', product.update_time, NoAccountNumberPayment.quantity);
            this.setState({ showOrderSummary: true, outsandingAmount: value, showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount })
        }
        else {
            this.setState({ showOrderSummary: false, outsandingAmount: '', totalAmount: '' })
        }
    }

    handleAccountNumber = async (e) => {
        const { NoAccountNumberPayment } = this.state;
        let product = NoAccountNumberPayment.selectedServiceProvider.obj;
        if (!NoAccountNumberPayment.selectedServiceProvider) {
            ErrorToast("Please selected the service provider")
        }
        else if (!NoAccountNumberPayment.accountNumber || NoAccountNumberPayment.accountNumber === '') {
            ErrorToast("Please enter Account number")
        }
        else {
            let dataQurey = { "account": NoAccountNumberPayment.accountNumber, "product": NoAccountNumberPayment.selectedServiceProvider ? NoAccountNumberPayment.selectedServiceProvider.obj.product_code : "" }
            let res = await this.props.handleBillPresentment(dataQurey);
            if (res) {
                if (res.data) {
                    let outstanding = Math.sign(res.data.Outstanding) === -1 ? -(Math.ceil(res.data.Outstanding * -1)) : res.data.Outstanding
                    let amount = Math.ceil(outstanding)
                    this.setState({ userAccountDetails: res });
                    let totalAmountValue = commonFunction.getCalculateTotal(amount, product.unit_price, product.discount, '', product.update_time, NoAccountNumberPayment.quantity);
                    this.setState({ showOrderSummary: false, outsandingAmount: '', showAmount: totalAmountValue.Amount, totalAmount: totalAmountValue.totalAmount })
                }
                else {
                    this.setState({ flowWithBillPresentment: false });
                }
                this.handledenomination(product)
                this.getValueRange(product.denomination)
                NoAccountNumberPayment['quantity'] = 1;
                this.setState({ NoAccountNumberPayment, showQuantity: 1 })
            }
            else {
                this.setState({ flowWithBillPresentment: false });
                this.handledenomination(product)
                this.getValueRange(product.denomination)
                NoAccountNumberPayment['quantity'] = 1;
                this.setState({ NoAccountNumberPayment, showQuantity: 1 })
            }
        }
    }

    render() {
        const { selectProviderList, accountNumberRequired, showOtherAmountInput, amountValue, priceList, success_alert, generatingPin, NoAccountNumberPayment, rangeError, isLoading, showOrderSummary, isLoadingPayNow, totalAmount,
            progressEvent, GeneratingPin, progressBarLoad, copyModal, showQuantity, flowWithBillPresentment, showAmount, userAccountDetails, showToogleInputBoxAmount, outsandingAmount, userAccountDetailsOutsandingAmount } = this.state;
        let product = NoAccountNumberPayment.selectedServiceProvider.obj;
        let amount = showAmount;
        const option = selectProviderList && serviceProviderOptions(selectProviderList);
        return (
            <Fragment>
                {success_alert.success && (
                    success_alert.type === 'success' ?
                        <SweetAlertPop title={success_alert.title} type={success_alert.type} confirmBtnBsStyle="success"
                            showCancel cancelBtnText="View Status" confirmBtnText="Done" cancelBtnBsStyle="primary" cancelBtnStyle={{ "marginRight": "50px" }}
                            onConfirm={this.handleCofirmSuccess} message={success_alert.message} onCancel={this.handleCancel}/> :
                        success_alert.alert_message_type === 'timeout' || success_alert.alert_message_type === 'Done' ?
                            <SweetAlertPop title={success_alert.title} type={success_alert.type} confirmBtnText="View Status" confirmBtnBsStyle="success" onConfirm={this.handleCancel} message={success_alert.message} /> :
                            <SweetAlertPop title={success_alert.title} type={success_alert.type} confirmBtnBsStyle="success" onConfirm={this.handleConfirm} message={success_alert.message} />
                )}
                {GeneratingPin && <GeneratingPinModal isOpen={this.state.GeneratingPin} pamas={this.props.pamas} handleCopyClose={this.handleCopyClose} handleCopy={this.handleCopy} generatingPin={generatingPin} handleCofirmSuccess={this.handleCofirmSuccess} />}
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={copyModal.openModal} autoHideDuration={6000} message={copyModal.message} onClose={this.handleCloseSnackBar} />
                <div className="row">
                    <div className="col-lg-8 col-md-12 full">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-8 col-md-12 order-lg-1 order-md-2 order-sm-2 order-2">
                                        <div className="thumbHeading">
                                            <h3>Pay Your bills without leaving your home</h3>
                                            <p>Recharge quickly and stay connected with the people that mobile most.</p>
                                        </div>
                                        <div className="thumbForm">
                                            <div className="form-group">
                                                <label>Select Your Service Provider:</label>
                                                <SelectReact value={NoAccountNumberPayment.selectedServiceProvider} options={option} onChange={(e) => { this.handleChange(e, 'selectedServiceProvider') }} name={this.props.pamas} />
                                            </div>
                                        </div>
                                        {accountNumberRequired && <div className="thumbForm">
                                            <div className="form-group">
                                                <label>{NoAccountNumberPayment.selectedServiceProvider.obj.product_name === 'Njoi Prepaid' ? 'Enter smartcard number: ' : 'Enter account number: '} </label>
                                                <input className="form-control" name="accountNumber" data-cy={`${this.props.pamas}AccountNumber`} value={NoAccountNumberPayment.accountNumber} onChange={(e) => { this.handleChange(e) }} />
                                            </div>
                                            <button className="btn btn-primary mr-2 float-right" onClick={this.handleAccountNumber} data-cy="buttonDisable">Next</button>
                                        </div>
                                        }
                                    </div>
                                    <div className="col-lg-12 col-md-12 order-lg-3 order-md-3 order-sm-3 order-3">
                                        <div className="chooseAmt">
                                            {this.state.showPriceList && priceList && (
                                                <ChooseAmt priceList={priceList} amountValue={amountValue} product_name={product.product_name} handleClick={this.handleChange} />
                                            )}
                                            {NoAccountNumberPayment.selectedServiceProvider && NoAccountNumberPayment.selectedServiceProvider.obj.update_time === 'PIN' && <div className="thumbForm">
                                                <div className="form-group">
                                                    <label>Enter quantity: </label>
                                                    <input className="form-control" name="quantity" data-cy={`${this.props.pamas}quantity`} value={NoAccountNumberPayment.quantity} onChange={(e) => { this.handleChangeQuantity(e) }} />
                                                    <div className="error mt-2" style={{ 'fontSize': '11px' }}> {message.quantityMinMaxMessage} </div>
                                                </div>
                                            </div>
                                            }
                                            {showOtherAmountInput &&
                                                <div>
                                                    <label>Amount:</label>
                                                    <input className="form-control" name="amount" value={NoAccountNumberPayment.amount} pattern="[0-9]*" onChange={this.handleChange} />
                                                    {rangeError.show && (<div className="error mt-2" style={{ 'fontSize': '11px' }}>{rangeError.message}</div>)}
                                                    <button className="btn btn-primary mr-2 float-right" onClick={this.handleAmountChange} data-cy="buttonDisable">Next</button>
                                                </div>
                                            }
                                        </div>
                                    </div><div className="col-lg-4 col-md-12 order-lg-2 order-md-1 order-sm-1 order-1">
                                        <div className="thumbImage">
                                            <img src={topup} alt="topup image" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {flowWithBillPresentment && userAccountDetails &&
                            <Fragment>
                                <Outstanding data_cy='LocalCouncilsScreen' userAccountDetails={userAccountDetails || userAccountDetails !== {} ? userAccountDetails : ''} />
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <label className="col-12 font-weight-semibold">Pay Amount:</label>
                                                    <p className="col-10">Toogle button beside if you wish to pay the partial amount of the Outstanding bills.
                                                    {!showToogleInputBoxAmount && <p className="mt-2 error font-italic" style={{ fontSize: '11px' }}>Additional amount will be brought forward to your next bill.</p>}
                                                    </p>
                                                    <div className="col-2 media-body flexbox">
                                                        <label className="switch">
                                                            <Input type="checkbox" name="showToogleInputBoxAmount" checked={showToogleInputBoxAmount} onChange={(e) => { this.handleChange(e) }} />
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </div>
                                                    {showToogleInputBoxAmount &&
                                                        <div className=" col-12 form-group">
                                                            <label>Amount:</label>
                                                            <input name="outsandingAmount" pattern="[0-9]*" className="form-control" onChange={(e) => { this.handleChange(e) }} value={outsandingAmount} />
                                                            {rangeError.show && (<div className="error mt-2" style={{ 'fontSize': '11px' }}>{rangeError.message}</div>)}
                                                            <div className="form-group">
                                                                <button className="btn btn-primary mr-2 float-right" onClick={this.handleAmountChangeOutstanding} data-cy="buttonDisable">Next</button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        }
                    </div>

                    <div className="col-lg-4 col-md-12 full">
                        <OrderSummaryBody
                            amount={product && product.product_name === 'Garena Shells' ? NumberFormatterShow.format(amount) : currenyFormatterShow.format(amount)}
                            product_name={product && product.product_name}
                            product_name={product && product.product_name}
                            note={product && product.note}
                            discount={product && product.discount}
                            update_time={product && product.update_time}
                            totalAmount={totalAmount && currenyFormatterShow.format(totalAmount)}
                            totalAmountValue={totalAmount}
                            isLoadingPayNow={isLoadingPayNow}
                            pamas={this.props.pamas}
                            handleClick={NoAccountNumberPayment.selectedServiceProvider && NoAccountNumberPayment.selectedServiceProvider.obj.update_time === 'PIN' ? showQuantity === 1 ? this.handlePayNow : this.handlePayNowWithQuantity : this.handlePayNow}
                            showOrderSummary={showOrderSummary}
                            quantity={showQuantity}
                        />
                    </div>
                </div>
                {isLoading && <div className="loader"><div className="loaderDiv"><Loader /></div></div>}
                {isLoadingPayNow && <div className="loader"><div className="loaderDiv"><div className="loader-content" style={{ color: '#50a5f1', fontSize: '15px', marginTop: '20px' }}><Loader /> <div className="loader-message">Generating Pin...... </div></div></div></div>}
                {progressBarLoad && <LinearProgress progressEvent={progressEvent} handleClick={this.handleCancelButton} />}
            </Fragment>
        );
    }
}
const mapStateToProps = state => {
    return {
        product: state.product.ProductDetails,
    };
};
export default connect(mapStateToProps)(withRouter(CommonNoAccountCompoment));