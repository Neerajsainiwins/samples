import React, { Fragment, useEffect, useState } from "react";
import { CustomDateDropDown } from "../Utility/CustomDateDropDown";
import { ErrorToast } from "../../Utils/toaster";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import NumberFormat from "react-number-format";
import BootstrapTable from "react-bootstrap-table-next";
import { image } from "../../assets/images/logoBase64";
import { Row, Col, Card, CardBody } from "reactstrap";
import Loader from "../../components/Common/Loader";
import logo from "../../assets/images/logo.png";
import { ValidateDate } from "../Utility/ValidateDate";
import Select, { components } from 'react-select';
import { Link } from "react-router-dom";
import DateTime from "react-datetime";
import { Auth } from "aws-amplify";
import API from "../../Utils/api";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
function priceFormatter(columnData) {
  return (
    <Fragment> Total  <br />  <br /> Amount Paid </Fragment>
  );
}
const columns = [
  { dataField: "product_name", text: "Description", footer: "" },
  {
    dataField: "count",
    text: "Quantity",
    footerAlign: (column, colIndex) => "right",
    footer: (columnData) => priceFormatter(columnData),
  },

  {
    dataField: "total_amount",
    text: "Amount (RM)",
    align: "right",
    headerAlign: "center",
    style: { width: "10%" },
    formatter: function (cell, row) {
      return (
        <NumberFormat
          thousandSeparator={true}
          displayType={"text"}
          prefix={"RM "}
          value={cell}
          decimalScale={4}
        />
      );
    },
    footerAlign: (column, colIndex) => "right",
    footer: (columnData) => totalAmount(columnData),
  },
];
const totalAmount = (columnData) => {
  const total = columnData.reduce((total, item) => total + item, 0);
  //  Number(total).toFixed(2);
  return (
    <Fragment>
      <NumberFormat thousandSeparator={true} displayType={"text"} prefix={"RM "} value={total} decimalScale={4} />
      <br /> <br />
      <NumberFormat thousandSeparator={true} displayType={"text"} prefix={"RM "} value={total} decimalScale={4} />
    </Fragment>
  );
};
const FORMAT = "YYYY-MM-DD";

const DATE_FIELD = ["date_from", "date_to"];

let subtractMonth = moment().subtract(1, "month").format(FORMAT);

const DATE_RANGE_MONTH = [moment(subtractMonth).subtract(1, "year").format(FORMAT), subtractMonth];

const DATE_RANGE = [moment().startOf("month").format(FORMAT), moment().endOf("month").format(FORMAT)];

const INITIAL_SELECTED_MONTH = {};

const INITIAL_QUERY = { date: DATE_RANGE[0] + " - " + DATE_RANGE[1] };

const INTIAL_FILTER = { date_from: DATE_RANGE[0], date_to: DATE_RANGE[1] };

const INITIAL_LOADER = false;

const TransactionSummary = () => {
  const [dateFilter, setDateFilter] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_SELECTED_MONTH);
  const [messageObject, setMessage] = useState({ type: "", message: "" });
  const [isSearching, setSearch] = useState(false);
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [statements, setStatements] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [filter, setFilters] = useState(INTIAL_FILTER);
  const [filterDatedisplay, setFilterDateDisplay] = useState(INTIAL_FILTER);
  const [userdetail, setUserDetail] = useState([]);
  const [isloading, setLoading] = useState(INITIAL_LOADER);
  useEffect(() => {
    dateRange(DATE_RANGE_MONTH[0], DATE_RANGE_MONTH[1]);
    const fetchData = async () => {
      getUserDetail();
      setLoading(true);
      API.get("invoice", { params: query }).then((res) => {
        setLoading(false);
        let data = res.data;
        if (data.data) { setStatements(data.data); }
        setSearch(false);
      }).catch((error) => {
        setLoading(false);
        console.log(error);
        setSearch(false);
      });
    };

    fetchData();
  }, [query]);

  function dateRange(startDate, EndDate) {
    let dates = CustomDateDropDown(startDate, EndDate);
    setDateFilter(dates);
  }

  function handleChange(event) {
    let start = moment(event.value.item).startOf("month").format(FORMAT);
    let end = moment(event.value.item).endOf("month").format(FORMAT);
    setFilters((filters) => ({ ...filters, date_from: start, date_to: end }));
    setFilterDateDisplay((filterDatedisplay) => ({ ...filterDatedisplay, date_from: start, date_to: end }));
    setQuery((query) => ({ ...query, date: start + " - " + end }));
    setSelectedMonth(event.value.item)
  }

  function getUserDetail() {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        setUserDetail(data);
      })
      .catch((error) => {
        console.log(error);
      });
    API.get("balance")
      .then((res) => {
        let data = res.data;
        if (data.data) {
          setBalanceData(data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDownload() {
    var doc = new jsPDF();
    const data = statements ? statements : [];
    const total =
      data.length > 0 &&
      data.reduce((total, item) => total + item.total_amount, 0);
    let totalAmount = Number(total).toFixed(4);
    const formatter = new Intl.NumberFormat("ms-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 4,
      minimumFractionDigits: 0,
    });
    function formatNumber(num) {
      return formatter.format(num);
    }
    let number = formatNumber(totalAmount);
    let date = `${moment(filter.date_from).format("DD MMM YYYY")}-${moment(
      filter.date_to
    ).format("DD MMM YYYY")}`;
    //First row
    doc.setFont("Poppins");
    doc.addImage(image, "JPEG", 10, 5, 15, 16, "", "FAST");
    doc.setFontSize(10);

    doc.text(
      "Level 8, Vertical Corporate Tower B, 59200, Bangsar South, KL",
      30,
      10
    );
    doc.setFontSize(12);
    doc.setFont("");
    doc.text("Transaction Summary", 165, 10);
    //second row
    doc.setFontSize(10);
    doc.text("support@iimmpact.com", 30, 15);

    //Thrid
    doc.setFontSize(10);
    doc.text("+603 3099 2970", 30, 20);

    //Fourth row
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text("Billed To:", 10, 35);
    doc.text("Date  : ", 150, 35);
    doc.setFontStyle("");
    doc.text(date, 164, 35);

    //Five row
    doc.text(`Account : ${balanceData && balanceData.account}`, 10, 40);
    doc.setFontStyle("bold");
    doc.text("No : ", 150, 40);
    doc.setFontStyle("");
    doc.text(
      `TS${balanceData.account}_${moment(filter.date_from).format("MM/YYYY")}`,
      164,
      40
    );

    //six row
    doc.text(
      `Name : ${userdetail.attributes && userdetail.attributes.name}`,
      10,
      45
    );
    //seven row
    doc.text(
      `Email : ${userdetail.attributes && userdetail.attributes.email}`,
      10,
      50
    );

    doc.text(
      ` Airtime recharge and bill payments performed for period ${moment(
        filter.date_from
      ).format("DD MMM YYYY")}-${moment(filter.date_to).format("DD MMM YYYY")}`,
      10,
      60
    );
    data.length === 0
      ? doc.text("You have no payments for this month.", 80, 80)
      : doc.autoTable({
        startY: 70,
        theme: "grid",
        body: data,
        columns: [
          { header: "Description", dataKey: "product_name", footer: "" },
          {
            header: "Quantity",
            dataKey: "count",
            footer: "Total \n\n Amount Paid",
          },
          {
            header: "Amount",
            dataKey: "total_amount",
            footer: `${number}\n\n${number}`,
            styles: { halign: "right" },
          },
        ],
        didParseCell: function (data) {
          if (
            data.section === "body" &&
            data.column.dataKey === "total_amount"
          ) {
            data.cell.text = formatNumber(data.cell.raw);
          }
        },
        showHead: "firstPage",
        showFoot: "lastPage",
        margin: { horizontal: 7 },
        styles: { cellWidth: "wrap" },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.3,
          2: {
            halign: "right",
          },
        },
        footStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.3,
          halign: "right",
        },
        columnStyles: {
          text: { cellWidth: "auto" },
          2: {
            halign: "right",
          },
        },
        styles: { overflow: "linebreak", columnWidth: "wrap" },
      });
    doc.save("TransactionSummaryDetails.pdf");
  }

  //Print the Invoice
  function printInvoice() {
    window.print();
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
      setFilters((filters) => ({ ...filters, [field]: moment(date).format("YYYY-MM-DD") }));
      if (field === 'date_from') {
        let start = moment(date).format("YYYY-MM-DD");
        let end = filter.date_to;
        handleSearch(start, end)
      }
      else {
        let start = filter.date_from;
        let end = moment(date).format("YYYY-MM-DD");
        handleSearch(start, end)
      }
    } else if (!isValidDate) {
      setMessage({ type: "danger", message: "Error: please enter valid date" });
    }
  }
  function handleSearch(start, end) {
    var totalDays = parseInt(moment(end).diff(moment(start), 'days'));
    if (totalDays < 31) {
      setSearch(true);
      setQuery((query) => ({ ...query, date: start + " - " + end }));
      setFilterDateDisplay((filterDatedisplay) => ({ ...filterDatedisplay, date_from: start, date_to: end }));
    }
    else {
      ErrorToast("Please select maximum 31 days");
    }
  }
  const yesterday = moment(filter.date_from).subtract(1, 'day');
  const disablePastDt = current => {
    return current.isAfter(yesterday);
  };
  const { type, message } = messageObject;

  let option = dateFilter.map((item, key) => {
    return { value: { item }, label: moment(item).format("MMM YYYY") }
  });

  const Menu = props => {
    return (
      <Fragment>
        <components.Menu {...props}>{props.children}
          <div className="dateFormat" style={{ width: '100%' }}>
            <Row className="m-3">
              <Col lg="6" sm="12">
                <h5 class="font-size-14 mb-2">Start Date <span class="text-muted mb-0 dateformatfont">YYYY-MM-DD</span></h5>
                <DateTime value={filter.date_from}
                  maxDate={new Date(filter.date_from)} timeFormat={false}
                  onChange={function (date) { closeDatePicker(0, date, DATE_FIELD[0]); }}
                  inputProps={{ id: DATE_FIELD[0], name: DATE_FIELD[0] }} dateFormat={"YYYY-MM-DD"} />
                {message && (<div className="error mt-2">{message}</div>)}
              </Col>
              <Col lg="6" sm="12">
                <h5 class="font-size-14 mb-2">End Date <span class="text-muted mb-0 dateformatfont">YYYY-MM-DD</span></h5>
                <DateTime value={filter.date_to} timeFormat={false}
                  isValidDate={disablePastDt} maxDate={new Date(filter.date_to)}
                  onChange={function (date) { closeDatePicker(1, date, DATE_FIELD[1]); }}
                  inputProps={{ id: DATE_FIELD[1], name: DATE_FIELD[1] }} dateFormat={"YYYY-MM-DD"} />
                {message && (<div className="error mt-2">{message}</div>)}
              </Col>
            </Row>
          </div>
        </components.Menu>
      </Fragment >
    );
  };
  return (
    <Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="" breadcrumbItem="Transaction Summary" />
        </div>
        <Row className="mb-3">
          <Col lg="4" sm="12">
            <div className="search-box mr-2">
              <Select
                options={option}
                components={{ Menu }}
                placeholder= 'Select Date'
                value={`${moment(filterDatedisplay.date_from).format("DD MMM YYYY")} - ${moment(filterDatedisplay.date_to).format("DD MMM YYYY")}`}
                onChange={handleChange} /></div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col lg="2" sm="12"> {message && (<div className="error mt-2">{message}</div>)}</Col>
        </Row>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="invoice-title" xs="6">
                  <h4 className="float-right font-size-16">Transaction Summary</h4>
                  <Row>
                    <Col xs="6" lg="1"><img src={logo} alt="logo" height="60" /></Col>
                    <Col xs="12" lg="9">
                      <p>Level 8, Vertical Corporate Tower B, 59200, Bangsar South, KL<br />
                        <i className="bx bx-envelope" />{" "}
                        <a href="mailto:support@iimmpact.com"> support@iimmpact.com{" "}</a><br />
                        <i className="bx bx-phone" /> +603 3099 2970</p>
                    </Col>
                  </Row>
                </div>
                <hr />
                <Row>
                  <Col xs="12" lg="6">
                    <strong>Billed To:</strong><br />
                    <table>
                      <tbody>
                        <tr><td>Account :</td><td>{balanceData.account}</td></tr>
                        <tr><td>Name : </td><td>{userdetail.attributes && userdetail.attributes.name} </td></tr>
                        <tr><td>Email : </td><td>{userdetail.attributes && userdetail.attributes.email} </td></tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col xs="12" lg="6" className="float-right mt-1">
                    <Row>
                      <Col xs="12">
                        <address><strong>Date : </strong>{moment(filterDatedisplay.date_from).format("DD MMM YYYY")} - {moment(filterDatedisplay.date_to).format("DD MMM YYYY")}</address>
                      </Col>
                      <Col xs="12" style={{ paddingRight: "4.3em" }}>
                        <strong>No :</strong> TS{balanceData.account}_{moment(filter.date_from).format("MM/yyyy")}
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Col>
                      <p className="py-2 mt-2">
                        Airtime recharge and bill payments performed for period{" "}
                        {moment(filterDatedisplay.date_from).format("DD MMM YYYY")} - {moment(filterDatedisplay.date_to).format("DD MMM YYYY")}
                      </p>
                      <div className="table-responsive  py-1 mt-1">
                        <BootstrapTable
                          key="product_name"
                          keyField="product_name"
                          hover
                          striped
                          columns={columns}
                          data={statements}
                          noDataIndication="You have no payments for this month."
                        />
                      </div>
                    </Col>
                    <div className="d-print-none">
                      <div className="float-right">
                        <Link to="#" className="btn btn-success waves-effect waves-light mr-2" onClick={printInvoice}><span className="fa fa-print" /> Print</Link>
                        <Link to="#" className="btn btn-primary w-md waves-effect waves-light" onClick={handleDownload}><span className="fa fa-download" /> Download </Link>
                      </div>
                    </div>
                  </Col>
                  {isloading && <div className="loader"><div className="loaderDiv"><Loader /></div></div>}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};
export default TransactionSummary;
