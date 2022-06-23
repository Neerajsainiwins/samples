import { Toaster } from "react-hot-toast";
import styled from "styled-components";
import Colors from "../../util/Colors";
import { media } from "../../util/MediaQuery";
import { useEffect, useState } from "react";
import API from "../../services/api.services";
import { useDispatch } from 'react-redux';
import { API_URLS } from "../../config/api.config";
import * as env from "../../config/env.config";
import routePaths from "../../config/routepaths.config";
import { useNavigate } from "react-router-dom";
import { storeTenantDetail } from "../../store/actions";
import LoaderContainer from "../Loader/LoaderContainer";
import { Loader } from "semantic-ui-react";
const AuthContainer = styled.div`
   height: 100vh;
   width: 100%;
   background: ${Colors.basecolor};
   display: flex;
   align-items: center;
   justify-content: center;
   @media screen and (max-width: 991px) {
      height: 100vh;
      padding: 20px;
      overflow-y: auto;
      align-items: flex-start;
   }
   @media screen and (max-width: 767px) {
      padding:0px;
   }
`;

export const FormContainer = styled.div`
   width: 100%;
   height: 100%;
   display: flex;

   background: ${Colors.white};
   border-radius: 5px;
   box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
   box-sizing: border-box;

   ${media.desktop`
    &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 10px;
  }
    overflow-y:auto;
    padding: 20px;
    height: 100%;
    width: 100%;
  `};

   ${media.mobile`
      height: 100%;
      overflow: auto;
      width: 100%;
      padding:5px 0px;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column-reverse;
  `};
`;

const AuthLayout = ({ children }: { children: JSX.Element }) => {
   const [showLoading, setShowLoading] = useState(false);
   const dispatch = useDispatch();
   const navigator = useNavigate();
   useEffect(() => {
      setShowLoading(true);
      let urlLink = env.TENANT_NAME ?? window.location.origin;


      
      API.post(API_URLS.ValidateUrlLink, null, { params: { urlLink:urlLink  } }).then(async (response: any) => {
        await dispatch(storeTenantDetail(response?.data));
        API.defaults.headers.common['TenantId'] = `${response?.data.tenantId}`;
      }, (error) => {
         navigator(routePaths.TENANTNOTFOUND);
      }).finally(() => {
         setShowLoading(false);
      });
   }, []);// eslint-disable-line react-hooks/exhaustive-deps


   if (showLoading) {
      return <LoaderContainer>
         <Loader />
      </LoaderContainer>;
   }

   return (
      <>
         <AuthContainer>
            <Toaster
               toastOptions={{
                  // Define default options
                  className: "",
                  duration: 2000,
                  style: {
                     background: "#363636",
                     color: "#fff",
                     fontSize: "14px",
                  },
                  success: {
                     style: {
                        background: "green",
                     },
                  },
                  error: {
                     style: {
                        background: "red",
                     },
                  },
               }}
               position="bottom-right"
            />
            <FormContainer>{children}</FormContainer>
         </AuthContainer>
      </>
   );
};

export default AuthLayout;
