import Axios from 'axios';
import { ErrorToast } from "../util/toaster";
import configureStore from '../store/index';

const API = Axios.create({ baseURL: "https://apigatewayservice-eus.azurewebsites.net" });
let { store } = configureStore();

API.interceptors.request.use((conf: any) => {
  let storeData = store.getState();
  // you can add some information before send it.
  if (!conf.headers.common['TenantId']) {
    let tenantId = storeData?.global?.tenantDetail?.tenantId;
    conf.headers.common['TenantId'] = tenantId;
  }
  if (!conf.headers.common['Authorization']) {
    let token = storeData?.auth?.userData?.accessToken;
    conf.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return conf;
},
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use((next) => {
  return Promise.resolve(next.data);
},
  (error) => {
    // You can handle error here and trigger warning message without get in the code inside
    //   store.dispatch({ 
    //     type: env.actionsTypes.openModal,
    //     message: error.message,
    //   });
    ErrorToast(JSON.parse(error.request.response).message);
    return Promise.reject(JSON.parse(error.request.response));
  }
);
export default API; 