import { Suspense,  useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import DashboardRoute from "./DashboardRoute";
import AuthRoute from "./AuthRoute";
// import Button from "../components/elements/button/Button";
// import { Amplify, Auth } from "aws-amplify";
// import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../components/context/AppContext";

import Loader from "../components/Loader/Loader";
import LoaderContainer from "../components/Loader/LoaderContainer";
import { configRotues } from "./config.routes";
import DashboardRoute from "./DashboardRoute";
// import { useAuth } from "oidc-react";
import routePaths from "../config/routepaths.config";
import { UserRoles } from "../util/enum";
import { useSelector } from "react-redux";
import UserLoginPage from "../pages/LogIn/UserLoginPage";

const Loading = (
   <LoaderContainer>
      <Loader />
   </LoaderContainer>
);

export const BaseRoutes = () => {


   const [app, setApp] = useState(null);
   const appValue = useMemo(() => ({ app, setApp }), [app, setApp]);
   
   const userDetail = useSelector((state: any) => state.auth.userData);
   return (
      <AppContext.Provider value={appValue}>
         <Router>
            <Routes>
               <Route path={`${process.env.PUBLIC_URL}/`} element={<AuthRoute><UserLoginPage /></AuthRoute>} />
               {configRotues.map((route, index) => {
                  if (route.path === routePaths.SUPERADMIN && userDetail?.roleName === UserRoles.GeneralUser) {
                     return false;
                  }
                  return (<Route
                     key={index}
                     path={route.path}
                     element={
                        route.private ?
                           <DashboardRoute>
                              <Suspense fallback={Loading}>
                                 <route.element />
                              </Suspense>
                           </DashboardRoute>
                           :
                           <AuthRoute>
                              <Suspense fallback={Loading}>
                                 <route.element />
                              </Suspense>
                           </AuthRoute>
                     }
                  />)
               })}
               <Route path="*" element={<NotFound />} />
            </Routes>
         </Router>
      </AppContext.Provider>
   );
};

const NotFound = () => {
   return <h1>Not Found: This url does not exist in our database . please check and try again.. </h1>;
};
// const Home = () => {
//    const [showLoading, setShowLoading] = useState(false);
//    let navigate = useNavigate();
//    // useEffect(() => {
//       navigate(routePaths.CONTACT);
//    // });
//       return <LoaderContainer>
//          <Loader />
//       </LoaderContainer>;
// };

export default BaseRoutes;