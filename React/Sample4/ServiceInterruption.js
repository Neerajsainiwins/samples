import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, CardTitle } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import API from "../../Utils/api";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import { connect } from "react-redux";
import LinearProgress from "../../pages/Utility/LinearProgressWith";
let progress = [];
const columns = [
  {
    dataField: "data.data.product_img",
    text: "Image",
    formatter: function (cell, row) {
      if (cell) {
        cell = "https://cloudimage.iimmpact.com/v7/" + cell + "?&width=50&height=50&sharpen=1";
      }
      return (<span> <img src={cell} alt='product_img' /> </span>);
    },
  },
  {
    dataField: "data.data.product_code",
    text: "Product Code",
  },
  {
    dataField: "data.data.product_name",
    text: "Product Name",
  },
  {
    dataField: "data.data.network_status",
    text: "Status",
  },
];
const ServiceInterruption = (props) => {
  const [statements, setStatements] = useState([]);
  const [progressBarLoad, setProgressBarLoad] = useState(false);
  const [progressEvent, setProgressEvent] = useState(0);

  useEffect(() => {
    let productCount = 0;
    let products = props.product && props.product.filter(item => item.status === 'Active');
    let allfetchData = [];
    const fetchData = async () => {
      let i, urls = [];
      setProgressBarLoad(true)
      if (products && products.length > 0) {
        let productlength;
        if (products.length - productCount >= 50) {
          productlength = productCount + 50;
        }
        else {
          let value = products.length - productCount;
          productlength = productCount + value;
        }
        for (i = productCount; i < productlength; i++) {
          urls.push({ product: products[i]['product_code'] });
        }
        productCount = productlength
        let urlsLength = urls.length - 1;
        const allRequests = urls.map(url => {
          return API.get("networkstatus", { params: url , onDownloadProgress:(progressEvent) => {
            if (progressEvent.lengthComputable) {
                progress.push(progressEvent.loaded * 100 / progressEvent.total)
                // sum up all file progress percentages to calculate the overall progress
                let totalPercent = progress ? Object.values(progress).reduce((sum, num) => sum + num, 0) : 0
                // divide the total percentage by the number of files
                let percent = parseInt(Math.round(totalPercent / products.length)); 
                setProgressEvent(percent)
            }}})
        });
        axios.all(allRequests).then(axios.spread((...responses) => {
          if (products.length !== productCount) {
            fetchData();
            allfetchData = allfetchData.concat(responses);
          }
          else {
            setProgressEvent(100);
            allfetchData = allfetchData.concat(responses);
            let FilterRecord = allfetchData.filter((x) => (x.data.data.network_status === "Interruption" ));
            setStatements(FilterRecord);
            console.log(FilterRecord)
            progress = [];
            handleProgressBarLoad();
          }})).catch((errors) => {
          let FilterRecord = allfetchData.filter((x) => x.data.data.network_status === "Interruption");
          setStatements(FilterRecord);
          setProgressBarLoad(false);
        })
      }
    }
    fetchData();
  }, [props.product]);


  function handleProgressBarLoad(){
    setProgressBarLoad(false);
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="" breadcrumbItem="Service Interruption" />
        <Card>
          <CardBody className="tableCard">
            <CardTitle>Service Interruption</CardTitle>
            <p className="text">
              Uh oh! We're having service interruption with the following
              products. You may experience delay in receiving the credit, or
              keep getting topup fail notification.
            </p>
            <div className="table-responsive">
              <BootstrapTable key="ServiceInterruption" keyField="product_img" hover striped columns={columns} data={statements.length > 0 ? statements : []} />
            </div>
          </CardBody>
        </Card>
      </Container>
      {progressBarLoad && <LinearProgress progressEvent={progressEvent} HideCancelButton={true}/>}
    </div>
  );
};
const mapStateToProps = state => {
  return { product: state.product.ProductDetails };
};
export default connect(mapStateToProps)(ServiceInterruption);
