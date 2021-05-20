import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { Auth } from "aws-amplify";
import { Container, Row, Col, Card, CardBody, CardTitle, Alert } from "reactstrap";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider, PaginationTotalStandalone } from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.css";
import moment from "moment";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import API from "../../Utils/api";
import { ValidateDate } from "../Utility/ValidateDate";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "../Tables/datatables.scss";
import Loader from "../../components/Common/Loader";
import { SuccessToast, ErrorToast } from "../../Utils/toaster";
import { formatDate } from "../../Utils/formatDate";
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import jsPDF from "jspdf";
import { CSVLink, CSVDownload } from 'react-csv';
import { Input } from "reactstrap";
import { connect } from "react-redux";
import { currenyFormatter } from "../Utility/Formatter";
import ViewReciptModal from "./ViewReceiptModal";
const { ExportCSVButton } = CSVExport;
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: new AWS.CognitoIdentityCredentials({ IdentityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID, }),
});
const statusColor = (status) => {
  let color = "";
  let colorCode = "";
  switch (parseInt(status)) {
    case 0:
    case 1:
    case 2:
    case 3:
      color = "warning";
      colorCode = "#50a5f1";
      break;
    case 20:
      color = "success";
      colorCode = "#FFFFFF";
      break;
    case 40:
    case 45:
    case 47:
    case 50:
    case 52:
    case 53:
    case 55:
      color = "danger";
      colorCode = "#f46a6a";
      break;

    default:
      color = "light";
      colorCode = "";
      break;
  }

  return { color, colorCode };
};

const headers = [
  { label: "TrxID", key: "trxid" },
  { label: "Date", key: "date" },
  { label: "Product", key: "product_name" },
  { label: "Sender", key: "sender" },
  { label: "Account", key: "account" },
  { label: "Amount", key: "amount" },
  { label: "Price", key: "price" },
  { label: "Status", key: "status_name" },
  { label: "Status Date", key: "response_date" },
  { label: "SN", key: "sn" },
  { label: "PIN", key: "pin" },
  { label: "Expiry", key: "expiry" },
  { label: "Remarks", key: "remarks" },
  { label: "Ref ID", key: "refid" },
  { label: "Voucher Link", key: "voucherlink"}
];

const FORMAT = "YYYY-MM-DD";
const DATE_RANGE = [moment().subtract(1, "day").format(FORMAT), moment().format(FORMAT),];
const DATE_FIELD = ["date_from", "date_to"];

const INITIAL_FILTER = {
  date: DATE_RANGE[0] + " - " + DATE_RANGE[1],
  product: "",
  account: "",
  sn: "",
  status: "[PENDING]",
  offset: 0,
  limit: 10000,
  date_from: DATE_RANGE[0],
  date_to: DATE_RANGE[1],
  refid: ""
};

const INITIAL_STATUS = ["PENDING"];

const INITIAL_PAGE = {
  page: 1,
  data: [],
  sizePerPage: 10,
  totalSize: 0,
  offset: 0,
  limit: 10000,
  hideSizePerPage: true,
};

const INITIAL_QUERY = {
  date: DATE_RANGE[0] + " - " + DATE_RANGE[1],
  status: "[PENDING]",
  date_from: DATE_RANGE[0],
  date_to: DATE_RANGE[1],
  offset: 0,
  limit: 10000,
};
const INITIAL_LOADER = false;


const Transactions = (props) => {
  const [statements, setStatements] = useState([]);
  const [messageObject, setMessage] = useState({ type: "", message: "" });
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTER);
  const [pagingInfo, setPagingInfo] = useState(INITIAL_PAGE);
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [isSearching, setSearch] = useState(false);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [statusQurey, setStatusQurey] = useState([]);
  const [isloading, setLoading] = useState(INITIAL_LOADER);
  const [showAllEntries, setShowAllEnteries] = useState(false);
  const [offsetNumber, setOffsetNumber] = useState(0);
  const [transaction_count, setTransaction_count] = useState('');
  const [exportLoading, setExportLoading] = useState(false)
  const [csvData, setCSVData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState([])

  const columns = [{
    dataField: "trxid",
    text: "TrxID",
    sort: true,
  },
  {
    dataField: "date",
    text: "Date",
    sort: true,
    formatter: function (cell, row) {
      let date = moment(cell);
      return date.format("DD-MM-YY HH:mm:ss");
    },
  },
  {
    dataField: "product_name",
    text: "Product",
    sort: true,
  },
  {
    dataField: "account",
    text: "Account",
    sort: true,
  },
  {
    dataField: "amount",
    text: "Amount",
    sort: true,
  },
  {
    dataField: "price",
    text: "Price",
    sort: true,
  },
  {
    dataField: "status_name",
    text: "Status",
    formatter: function (cell, row) {
      let { color } = statusColor(row.status_code);
      return <Badge variant={color}>{cell}</Badge>;
    },
  },
  {
    dataField: "response_date",
    text: "Status Date",
    sort: true,
    formatter: function (cell, row) {
      let date = moment(cell);
      return date.format("DD-MM-YY HH:mm:ss");
    },
  },
  { dataField: "voucherlink", text: "Voucher Link"},
  {
    dataField: "response_date",
    text: "View receipts",
    formatter: function (cell, row) {
      return <button style={{ display: 'block', width: 100 }} type="button" class="btn-sm btn-rounded btn btn-primary"
        onClick={() => { handleReceiptsModal(row) }}>View receipts</button>
    },
    style: { minWidth: '60px' },
  }
  ];

  let transaction_data = [];
  let transaction_countAPI = 0;
  let current_APIcount = 0;
  let textInput = React.useRef();
  useEffect(() => {
    const uniqueTags = [];
    props.product && props.product.map((res) => {
      if (uniqueTags.indexOf(res.product_code) === -1) {
        uniqueTags.push(res);
      }
    });
    setStatements(uniqueTags);
  }, [props.product]);

  useEffect(() => {
    DATE_FIELD.forEach(function (item, index) {
      document.getElementById(item).addEventListener("click", function () {
        // closeDatePicker(index);
      });
    });

    const fetchData = async (querys) => {
      /*rh_custom_query param*/
      let query_parm = querys ? query : rh_custom_query(query);
      let query2 = query_parm[0];
      let status_query = query_parm[1];
      setStatusQurey(status_query);
      API.get("transactions?" + status_query, { params: query, params: query2 }).then((res) => {
        if (res.data.data) {
          if (res.data.data.length > 0) {
            setTransaction_count(res.data.meta.transaction_count)
            setTotalPrice(res.data.meta.total_price)
            setTotalAmount(res.data.meta.total_amount)
            setTransactions(res.data.data);
            setPagingInfo((pagingInfo) => ({
              ...pagingInfo, sizePerPage: 10,
              page: 1,
              totalSize: res.data.data.length,
              data: res.data.data.slice(0, 10),
              hideSizePerPage: true,
              hidePageListOnlyOnePage: true
            }));
          } else {
            setTransactions(res.data.data);
            setTotalPrice(res.data.meta.total_price)
            setTotalAmount(res.data.meta.total_amount)
            setPagingInfo((pagingInfo) => ({
              ...pagingInfo,
              page: 1,
              totalSize: res.data.data.length,
              data: res.data.data,
              hideSizePerPage: true,
              hidePageListOnlyOnePage: true
            }));
          }
        }
        setSearch(false);
      }).catch((error) => {
        console.log(error);
        ErrorToast(error.message);
      }).then(() => {
        setTimeout(() => { setSearch(false); }, 50000);
      });
    }

    fetchData();

  }, [query]);

  function handleReceiptsModal(row) {
    setIsOpen(true)
    setCurrentRowData(row)
  }
  function handleCloseReceiptsModal() {
    setIsOpen(false)
  }
  function handleChange(event) {
    const { name, type, value } = event.target;
    if (type !== "checkbox") {
      setFilters((filters) => ({ ...filters, [name]: value }));
      setStatus((status) => [...status, "PENDING", "SUCCESSFUL", "FAILED"]);
    } else {
      if (status.indexOf(value) == -1) {
        setStatus(status => [...status, value]);
      } else {
        setStatus(status => status.splice(status.indexOf(value), 1));
      }
    }
  }
 
  function handleCheckbox(event) {

    const { id, checked, value } = event.target;

    if (id === "check-all") {
      if (checked) {
        setStatus((status) => [...status, "PENDING", "SUCCESSFUL", "FAILED"]);
      } else {
        setStatus([]);
      }
    } else {
      if (checked) {
        setStatus((status) => [...status, value]);
        // setStatusQurey(newStatus);
      } else {
        let newStatus = status.filter(function (v, i, arr) {
          return value !== v;
        });
        setStatusQurey(newStatus);
        setStatus(newStatus);
      }
    }
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    setSearch(true);
    setQuery((query) => ({ ...query, ...filters, status: JSON.stringify(status), }));
  }
  function reset(event) {
    event.preventDefault();

    setFilters(INITIAL_FILTER);

    setQuery(INITIAL_QUERY);

    setStatus(INITIAL_STATUS);

    setPagingInfo(INITIAL_PAGE);

    setSearch(false);
  }
  const handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setPagingInfo((pagingInfo) => ({
      ...pagingInfo,
      page: page,
      sizePerPage: sizePerPage,
      data: transactions.slice(currentIndex, currentIndex + sizePerPage),
    }));
  };

  /*custom*/
  function rh_custom_query(query) {

    let status = query.status;
    if (!status) {
      status = "[PENDING]";
    }

    let status_query = "";
    if (status) {
      status = status.substring(1);
      status = status.slice(0, -1);
      status = status.replace(/['"]+/g, "");
      let status_arr = status.split(",");
      let set = new Set(status_arr);
      status_arr = [...set];

      for (let i = 0; i < status_arr.length; i++) {
        let amp = i != 0 ? "&" : "";
        status_query += amp + "status=" + status_arr[i].trim();
      }
    }

    query.date =
      query.date_from && query.date_to
        ? query.date_from + " - " + query.date_to
        : DATE_RANGE[0] + " - " + DATE_RANGE[1];
    delete query.date_from;
    delete query.date_to;

    delete query.status;
    return [query, status_query];
  }

  function closeDatePicker(seq, date = "", field = "") {
    let rdt = document.getElementsByClassName("rdt")[seq];
    if (rdt) {
      let rdt_class = rdt.classList;
      if (rdt_class.contains("rdtOpen")) {
        rdt_class.remove("rdtOpen");
      } else {
        rdt_class.add("rdtOpen");
      }
    }

    let isValidDate = ValidateDate(date);
    if (date && field && isValidDate) {
      setMessage({ type: "", message: "" });
      setFilters((filters) => ({
        ...filters,
        [field]: moment(date).format("YYYY-MM-DD"),
      }));
    } else if (!isValidDate) {
      setMessage({ type: "danger", message: "Error: please enter valid date" });
    }
  }
  let data = transactions && transactions

  function handleDateCheck() {
    ErrorToast("Please select maximum 31 days");
  }
  async function handleExcel(queryOffset) {
    setExportLoading(true)
    if (queryOffset) {
      query['offset'] = queryOffset * 10000
    }
    const response = await API.get("transactions?" + statusQurey, { params: query });
    if (response.data.meta.transaction_count > 10000) {
      transaction_countAPI = Math.ceil(response.data.meta.transaction_count / 10000);
      if (current_APIcount !== transaction_countAPI - 1) {
        let data = response.data.data;
        transaction_data = transaction_data.concat(data)
        current_APIcount = current_APIcount + 1;
        handleExcel(current_APIcount);
      }
      else {
        let data = response.data.data;
        transaction_data = transaction_data.concat(data)
        setCSVData(transaction_data)
        setExportLoading(false)
        textInput.current.link.click();
        setCSVData()
      }
    }
    else {
      let data = response.data.data;
      transaction_data = transaction_data.concat(data)
      setCSVData(transaction_data)
      setExportLoading(false)
      if (data.length > 0) {
        textInput.current.link.click();
      }
      else {
        console.log('empty')
      }
      setCSVData()
    }
  }


  const { type, message } = messageObject;
  let options = statements.sort((a, b) => (a.product_name > b.product_name) ? 1 : ((b.product_name > a.product_name) ? -1 : 0));

  var totalDays = parseInt(moment(filters.date_to).diff(moment(filters.date_from), 'days'));
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="container-fluid">
            <Breadcrumbs title="Reports" breadcrumbItem="Transactions" />
          </div>
          <Row>
            <Col lg="3">
              <Card>
                <CardBody className="filtersidebar">
                  <CardTitle>Filter</CardTitle>
                  <form onSubmit={handleFormSubmit}>
                    <div className="mt-2 pt-2">
                      <button className="btn btn-primary" type="submit" disabled={isSearching ? true : false} >
                        <i className="ft-filter"></i> {isSearching ? "Searching..." : "Search"}
                      </button>
                      <button className="btn btn-default ml-2" onClick={(e) => { reset(e); }}>Reset</button>
                    </div>
                    {message != "" && (<Alert className="mt-2" color={type}>{message}</Alert>)}
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2"> Start Date{" "}
                        <span className="text-muted mb-0 dateformatfont"> YYYY-MM-DD </span>
                      </h5>
                      <DateTime
                        defaultValue={DATE_RANGE[0]}
                        value={filters.date_from}
                        timeFormat={false}
                        onChange={function (date) { closeDatePicker(0, date, DATE_FIELD[0]); }}
                        inputProps={{
                          id: DATE_FIELD[0], name: DATE_FIELD[0], autoComplete: "off",
                          // ,'readOnly': 'readOnly'
                        }}
                        dateFormat={"YYYY-MM-DD"}
                      />
                    </div>
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2">
                        End Date{" "}
                        <span className="text-muted mb-0 dateformatfont">
                          YYYY-MM-DD
                        </span>
                      </h5>
                      <DateTime
                        defaultValue={DATE_RANGE[1]}
                        value={filters.date_to}
                        timeFormat={false}
                        onChange={function (date) { closeDatePicker(1, date, DATE_FIELD[1]); }}
                        inputProps={{
                          id: DATE_FIELD[1], name: DATE_FIELD[1], autoComplete: "off",
                          // ,'readOnly': 'readOnly'
                        }}
                        dateFormat={"YYYY-MM-DD"}
                      />
                    </div>
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2">Product</h5>
                      <select
                        className="form-control select2"
                        id="product-code"
                        name="product"
                        key="product"
                        value={filters.product}
                        onChange={handleChange}
                        title="Product"
                      >
                        <option value="">Select Product</option>
                        {options.map((item, key) => (<option key={key} value={item.product_code}>{item.product_name}</option>))}
                      </select>
                    </div>
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2">Account</h5>
                      <input
                        className="form-control mb-2 mr-sm-2 mb-sm-0x"
                        id="topup-number"
                        name="account"
                        placeholder="Account"
                        autoComplete="off"
                        value={filters.account}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2">RefId</h5>
                      <input
                        className="form-control mb-2 mr-sm-2 mb-sm-0x"
                        id="topup-number"
                        name="refid"
                        placeholder="refId"
                        autoComplete="off"
                        value={filters.refid}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-2 pt-2">
                      <h5 className="font-size-14 mb-2">Types</h5>

                      <div className="custom-control custom-checkbox mt-2">
                        <input
                          type="checkbox"
                          id="check-all"
                          className="custom-control-input"
                          onChange={handleCheckbox}
                          checked={ status.indexOf("PENDING") !== -1 && status.indexOf("SUCCESSFUL") !== -1 && status.indexOf("FAILED") !== -1 ? true : false}
                        />
                        <label className="custom-control-label" htmlFor="check-all">All</label>
                      </div>
                      <div className="custom-control custom-checkbox mt-2">
                        <input
                          type="checkbox"
                          id="Successful"
                          className="custom-control-input"
                          value="SUCCESSFUL"
                          onChange={handleCheckbox}
                          checked={status.indexOf("SUCCESSFUL") !== -1 ? true : false}
                        />
                        <label className="custom-control-label" htmlFor="Successful">Successful</label>
                      </div>

                      <div className="custom-control custom-checkbox mt-2">
                        <input
                          type="checkbox"
                          id="Failed"
                          className="custom-control-input"
                          value="FAILED"
                          onChange={handleCheckbox}
                          checked={status.indexOf("FAILED") !== -1 ? true : false}
                        />
                        <label className="custom-control-label" htmlFor="Failed">Failed</label>
                      </div>

                      <div className="custom-control custom-checkbox mt-2">
                        <input
                          type="checkbox"
                          id="Pending"
                          className="custom-control-input"
                          value="PENDING"
                          onChange={handleCheckbox}
                          checked={status.indexOf("PENDING") !== -1 ? true : false}
                        />
                        <label className="custom-control-label" htmlFor="Pending">Pending</label>
                      </div>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
            <Col lg="9">
              <Card>
                <CardBody className="tableCard">
                  <CardTitle>Transactions</CardTitle>
                  <div className="table-responsive">
                    <div className="align-right">

                      <OverlayTrigger placement="right" overlay={<Tooltip>Excel</Tooltip>}>
                        {totalDays < 31 ?
                          <a href="#" className="mr-2 excelClass">
                            {csvData && csvData.length > 0 ?
                              <CSVLink
                                ref={textInput}
                                headers={headers}
                                data={csvData && csvData.map(row => ({...row, response_date: moment(row.response_date).format('DD-MM-YY HH:mm:ss'),
                                  sender: row.sender ? '=""' + row.sender + '""' : '',
                                  date: moment(row.date).format('DD-MM-YY HH:mm:ss'), account: row.account ? '=""' + row.account + '""' : '',
                                  sn: row.sn ? '=""' + row.sn + '""' : '', pin: row.pin ? '=""' + row.pin + '""' : '', refid: row.refid ? '=""' + row.refid + '""' : ''
                                }))} filename={"transactions.csv"}>
                                <i className="far fa-file-excel"></i>
                              </CSVLink> :
                              <i className="far fa-file-excel" onClick={(e) => { e.preventDefault(); handleExcel() }} ></i>
                            }
                          </a>
                          :
                          <a href="#" className="mr-2 excelClass" style={{ color: '#25BDCC' }}>
                            <i className="far fa-file-excel" onClick={handleDateCheck} />
                          </a>
                        }
                      </OverlayTrigger>
                    </div>
                    <PaginationProvider pagination={paginationFactory(pagingInfo)}>
                      {({ paginationProps, paginationTableProps }) => (
                        <div>
                          <PaginationTotalStandalone {...paginationProps} />
                          <BootstrapTable
                            remote={true}
                            keyField="id"
                            hover
                            responsive
                            striped
                            data={pagingInfo && pagingInfo.data}
                            columns={columns}
                            headerClasses="thead-light thead-lg"
                            onTableChange={handleTableChange}
                            {...paginationTableProps}
                          />
                        </div>
                      )}
                    </PaginationProvider>
                  </div>

                  <h6 className="font-size-12 mt-3">Total of amount : <span className="text-muted mb-0 ">{currenyFormatter.format(totalAmount)}</span></h6>
                  <h6 className="font-size-12 mt-3">Total of price : <span className="text-muted mb-0 ">{currenyFormatter.format(totalPrice)}</span></h6>
                  {isloading && (<div className="tableLoaderDiv"><div className="loaderDiv"><Loader /></div></div>)}
                </CardBody>
              </Card>
            </Col>
          </Row>
          {
            exportLoading && <div className="loader" >
              <div className="loaderDiv" style={{ paddingLeft: '20%' }}><Loader /></div></div>
          }
          <ViewReciptModal isOpen={isOpen} data={currentRowData} onHide={() => setIsOpen(false)} />
        </Container>

      </div>

    </React.Fragment>
  );
};
const mapStateToProps = state => {
  return { product: state.product.ProductDetails };
};
export default connect(mapStateToProps)(Transactions);
