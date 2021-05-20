import moment from "moment";
import axios from "axios";
import API from "../../../Utils/api";
import { Auth } from "aws-amplify";
import { ZohoSignClientID, ZohoSignClientSecret, ZohoSignRefreshToken, ZohoSignHostUrl } from "../../../Utils/envVariable";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const instance = axios.create({ baseURL: `${proxyurl}https://sign.zoho.com/api/v1` });

export const getSumOfInvoiceTransaction = async () => {
  let all_response, notEmptyResponse, sum_of_variable, count, average, month = [1, 2, 3];
  const allRequests = month.map((item, i) => {
    let startDate = moment(new Date()).subtract(item, "month").startOf("month").format("YYYY-MM-DD");
    let EndDate = moment(new Date()).subtract(item, "months").endOf("month").format("YYYY-MM-DD");
    return API.get("invoice", { params: { type: "DEPOSIT", date: `${startDate} - ${EndDate}` }});
  });
  await axios.all(allRequests).then(axios.spread((...responses) => {all_response = responses.map((item, index) => item.data.data)},
      (errors) => {
        if (errors) {
          return false;
        }
      }));
  notEmptyResponse = all_response.filter((item) => item.length !== 0);
  if (notEmptyResponse.length > 0) {
    sum_of_variable = notEmptyResponse.map((data) => data.reduce(
        (TotalAmount, i) => TotalAmount + parseFloat(i.total_amount, 10),0
      )
    );
    count = notEmptyResponse.length;
    average =
      sum_of_variable.reduce(
        (TotalAmount, i) => TotalAmount + parseFloat(i, 10)
      ) / count;
    let sumofaverage = Math.round(average);
    return sumofaverage;
  } else {
    return false;
  }
};

async function setAccessToken() {
  let refreshToken = ZohoSignRefreshToken;
  let clientID = ZohoSignClientID;
  let clientSecret = ZohoSignClientSecret;
  let url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientID}&client_secret=${clientSecret}&redirect_uri=https%3A%2F%2Fsign.zoho.com&grant_type=refresh_token`;
  const tokenResponse = await axios.post(proxyurl + url);
  if (tokenResponse.data.access_token) {
    let access_token = tokenResponse.data.access_token;
    instance.defaults.headers.common["Authorization"] = `Zoho-oauthtoken ${access_token}`;
    return true;
  } else {
    return false;
  }
}

export const getPDFURL = async () => {
  const acesstoken = await setAccessToken();
  const templatesResponse = await instance.get(`/requests`);
  if (acesstoken === true) {
    let userDetails = await getCurrentUserDetail();
    const usersDocument = templatesResponse.data.requests.filter(
      (item) => item.actions[0].recipient_email === userDetails.email
    );
    let url;
    if (usersDocument.length > 0) {
      url = await getPDFOPEN( usersDocument[0].request_id, usersDocument[0].actions[0].action_id);
    } else {
      url = await SendDocumentOutForSignature( userDetails.name, userDetails.email);
    }
    return url;
  }
};

export const getCurrentUserDetail = async () => {
  let data = await Auth.currentUserInfo();
  let userDetails = {
    email: data.attributes.email,
    name: data.attributes.name,
  };
  return userDetails;
};

async function SendDocumentOutForSignature(name, email) {
  const templatesResponse = await instance.get(`/templates`);
  if (templatesResponse.data.templates[0].document_ids[0].document_id) {
    let action_id = templatesResponse.data.templates[0].actions[0].action_id;
    var data = new FormData();
    data.append(
      "data ",
      `{\n    "templates": {\n        "field_data": {\n            "field_text_data": {},\n            "field_boolean_data": {},\n            "field_date_data": {}\n        },\n        "actions": [\n            {\n                "recipient_name":${name},\n                "recipient_email": ${email},\n                "action_id": ${action_id},\n                "signing_order": 1,\n                "role": "Client",\n                "verify_recipient": false,\n                "private_notes": "Please sign the CRA.",\n          "is_embedded": true
    }\n        ],\n        "notes": ""\n    }\n}`
    );
    const createdocument = await instance.post(`/templates/160491000000058065/createdocument`,data);
    let url = await getPDFOPEN(
      createdocument.data.requests.request_id,
      createdocument.data.requests.actions[0].action_id
    );
    return url;
  }
}

async function getPDFOPEN(request_id, action_idEmbedToken) {
  var host_url = ZohoSignHostUrl;
  const getPDF = await instance.post(
    `/requests/${request_id}/actions/${action_idEmbedToken}/embedtoken?host=${host_url}`
  );
  if (getPDF.data.sign_url) {
    return getPDF.data.sign_url;
  } else {
    return "error of generated PDF.";
  }
}

export const checkPDFCompeleted = async () => {
  const acesstoken = await setAccessToken();
  if (acesstoken === true) {
    const templatesResponse = await instance.get(`/requests`);
    let userDetails = await getCurrentUserDetail();
    const usersDocument = templatesResponse.data.requests.filter((item) => item.actions[0].recipient_email === userDetails.email);
    if (usersDocument.length > 0) {
      if (usersDocument[0].request_status === "completed") {
        return usersDocument[0];
      }
    }
    else {
      return false;
    }
  }
};


export const downloadPDF = async (userDetails) => {
  const downloadPDF = await
    instance.get(`/requests/${userDetails.request_id}/documents/${userDetails.document_ids[0].document_id}/pdf`,
        {
          responseType: 'blob'
        });
  return downloadPDF;
}

