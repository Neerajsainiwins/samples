import React, { useEffect, useState, Fragment } from "react";
import { Container, Button } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import logo from "../../../assets/images/logo.png";
import EligibleComponent from "./EligibleComponent";
import FinancingPromise from "./FinancingPromise";
import WhyChooseFinancing from "./WhyChooseFinancing";
import HowItWork from "./HowItWork";
import Loader from "../../../components/Common/Loader";
import SignPDFModel from "./SignPDFModel";
import { withRouter } from "react-router-dom";
import { getSumOfInvoiceTransaction, getPDFURL, checkPDFCompeleted, downloadPDF } from "./FinancingAPI";
let signPDF;
const Financing = () => {
  const [averageValue, setAverageValue] = useState("");
  const [isLodaing, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTextLoading, setShowTextLoading] = useState(true);
  const [showDocument, setShowDocument] = useState(false);
  const [userDocumentDetails, setUserDocumentDetails] = useState([]);
  const [addLoader, setAddLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSumOfInvoiceTransaction();
      if (data) {
       let value =  parseInt(data);
       setAverageValue(value);
       let CompeletedDocument = await checkPDFCompeleted();
       if (CompeletedDocument) {
          setShowDocument(true);
          setUserDocumentDetails(CompeletedDocument);
       }
       setLoading(false);
       setShowTextLoading(false);
      } else {
        setShowTextLoading(false);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function showHideModal() {
    setLoading(true);
    const pdfURL = await getPDFURL();
    setShowModal(true);
    signPDF = pdfURL;
    setLoading(false);
  }

  async function closeHideModal() {
    let CompeletedDocument = await checkPDFCompeleted();
        if (CompeletedDocument) {
          setShowDocument(true);
          setUserDocumentDetails(CompeletedDocument);
        }
        else{
          setShowDocument(false);
          setUserDocumentDetails();
        }
    setShowModal(false);
  }

  async function downloadPDFURl(userDetails) {
    setAddLoader(true);
    const pdf = await downloadPDF(userDetails);
    const data = window.URL.createObjectURL(pdf.data);
    var link = document.createElement("a");
    link.href = data;
    link.title = "CRA Consent";
    link.download = "CRA Consent.pdf";
    link.click();
    setAddLoader(false);
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="" breadcrumbItem="Financing" />
        <div className="row justify-content-center">
          <div className="col-md-11 col-sm-12">
            <EligibleComponent
              maxFinancing={averageValue > 150000 ? "150000" : averageValue}
              logo={logo}
            />
          </div>
          <div className="col-9 col-sm-9">
            <WhyChooseFinancing />
          </div>
          <div className="col-9 col-sm-9">
            <FinancingPromise logo={logo} />
          </div>
          <div className="col-9 col-sm-9">
            <HowItWork />
          </div>
          <div className="col-9 col-sm-9 text-center">
            <Button
              color="success"
              disabled={addLoader ? true : false}
              onClick={(e) => showDocument ? downloadPDFURl(userDocumentDetails) : showHideModal()}
              className="waves-effect waves-light mb-2 mr-2"
            >
              {showDocument ? (addLoader ? (<Fragment><i class="fa fa-spinner fa-spin "></i>Download document</Fragment>) 
                :("Download document")) : ( "I'm intserested")}
            </Button>
          </div>
        </div>
      </Container>
      <SignPDFModel showModal={showModal} urlOfPDF={signPDF} closeHideModal={closeHideModal} />
      {isLodaing && (
        <div className="loader">
          <div className="loaderDiv" style={{ paddingLeft: "20%" }}>
            {" "}
            <Loader />{" "}
            {showTextLoading && (
              <div className="loader-message text-info" style={{ fontSize: "16px" }} > Checking your eligibility </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default withRouter(Financing);
