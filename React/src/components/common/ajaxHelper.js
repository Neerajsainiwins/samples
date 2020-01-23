import axios from "axios";

function AjaxHelper(url, data) {
  var headers = {
    "Content-Type": "application/json"
  };
  return axios
    .post(url, data, {
      headers
    })
    .then(result => {
      return result.data;
    });
}

export default AjaxHelper;
