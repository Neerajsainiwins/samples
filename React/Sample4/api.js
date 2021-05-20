
import axios from "axios";
import { localStorageService } from "./localStorageService";
import { Auth } from "aws-amplify";

const isLoggedIn = localStorageService.getAuthorizationState();
const KeepMeSignedIn = localStorageService.getKeepMeSignedIn();

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" }
});

API.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    if (isLoggedIn === 'signedIn' && KeepMeSignedIn && KeepMeSignedIn === "true") {
      Auth.currentSession().then((session) => {
        var idTokenExpire = session.getIdToken().getExpiration();
        var refreshToken = session.getRefreshToken();
        var currentTimeSeconds = Math.round(+new Date() / 1000);
        if (idTokenExpire < currentTimeSeconds && KeepMeSignedIn === true) {
          Auth.currentAuthenticatedUser().then((res) => {
            res.refreshSession(refreshToken, (err, data) => {
              if (err) {
                Auth.signOut()
              } else {
                localStorageService.storeAuthUser(data.getIdToken().getJwtToken());
                const token = localStorageService.getAuthorizationToken()
                // API.defaults.headers.common["Authorization"] = token;
                config.headers.Authorization = token;
                console.log(data.getIdToken().getJwtToken())
                resolve(config);
              }
            });
          });
        }
        else {
          localStorageService.storeAuthUser(session.getIdToken().getJwtToken());
          const token = localStorageService.getAuthorizationToken();
          config.headers.Authorization = token;
          // console.log(data.getIdToken().getJwtToken())
          resolve(config);
        }
        // } 
      }).catch(() => {
        // No logged-in user: don't set auth header
        resolve(config);
      });
    }
    else {
      const token = localStorageService.getAuthorizationToken()
      config.headers.Authorization = token;
      resolve(config);
    }
  })

});
// });
API.interceptors.response.use(null,
  (error) => {
    // handle error
    //Do something with response error
    if (error.response) {
      const { response } = error;
      const { status, data } = response;
      // place your reentry code
      if (status === 401) {
        return new Promise((resolve, reject) => {
          reject(handleRecdirect());
        })
      } else {
        return Promise.reject(data);
      }
    }
    else {
      if (error.message === "Network Error") {
        return Promise.reject(error.message);
      } else {
        return Promise.reject(error);
      }
    }
  });
// declare a response interceptor
function handleRecdirect() {
  if (isLoggedIn === 'signedIn') {
    window.location = '/lock-screen'
  }

}
export default API;