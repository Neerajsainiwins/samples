/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../pages/Header";
import { Toaster } from "react-hot-toast";
import LoaderContainer from "../Loader/LoaderContainer";
import Loader from "../Loader/Loader";
import SideNavigation from "../../pages/SideNavigation";
import Colors from "../../util/Colors";
import API from "../../services/api.services";
import { API_URLS } from "../../config/api.config";
import { useDispatch, useSelector } from 'react-redux';
import { storeSideBar } from "../../store/actions";
// import { Dimmer } from "semantic-ui-react";
// import { UserRoles } from "../../util/enum";
// import * as env from "../../config/env.config";


const AdminLayoutContainer = styled.div`
   height: 100vh;
   width: 100%;
   overflow: auto;
`;
const MainContent = styled.div`
   overflow: auto;
   width: calc(100% - 102px);
   margin-left: auto;
   height: calc(100vh - 77px);
   margin-top: 77px;
   transition: 0.5s all ease;
    -webkit-transition: 0.5s all ease;
    -moz-transition: 0.5s all ease;
   @media screen and (max-width: 767px) {
      width: 100%;
      overflow: auto;
   }
`;
const ContentWrapper = styled.div` 
   padding: 15px;
   height: 100%;
   width: auto;
   @media screen and (max-width: 767px) {
      padding: 0;
      background-color: ${Colors.white};
      `;

const DashboardLayout = ({ children }: { children: JSX.Element }) => {
   const dispatch = useDispatch();
   const [isActive, setIsActive] = useState<boolean>(false);
   const [showDropdown, setShowDropdown] = useState<boolean>(false);

   const handleToggle = () => {
      setIsActive(!isActive)
   };
   const [isLoading, ] = useState(false);
   const listInnerRef = useRef();


   const onScroll = () => {
      if (listInnerRef.current) {
         const { scrollTop } = listInnerRef.current;
         if (scrollTop > 90)
            document.body.classList.add("MyClass");
         else
            document.body.classList.remove("MyClass");
      }
   };

   const userDetail = useSelector((state: any) => state.auth.userData);
   const [showLoading, setShowLoading] = useState(false);



   useEffect(() => {
      if (userDetail) {
         setShowLoading(false)
         API.get(API_URLS.GetScreens, ).then((response) => {
            dispatch(storeSideBar(response?.data as any));
         });
      }
      else {
         setShowLoading(true);
      }

   }, [userDetail])  // eslint-disable-line react-hooks/exhaustive-deps

   if (showLoading) {
      return <LoaderContainer>
         <Loader />
      </LoaderContainer>;
   }

   return (
      <AdminLayoutContainer>
         <Toaster
            toastOptions={{
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
         
         <div className={`App ${isActive ? "menuCollapse" : ""}`}>
               
            <Header onMenuClick={handleToggle} showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
            <SideNavigation />
            <MainContent onClick={() => setShowDropdown(false)} className="mainContentWrapper" onScroll={onScroll} ref={listInnerRef as any}>
               {isLoading ? (
                  <LoaderContainer>
                     <Loader />
                  </LoaderContainer>
               ) : (
                  <ContentWrapper>{children}</ContentWrapper>
               )}
            </MainContent>
         </div>
      </AdminLayoutContainer>
   );
};

export default DashboardLayout;
