// import { ROLE } from './roles';
import React from "react";
// import { Navigate, Route, useLocation } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

const AuthRoute = ({ children }: { children: JSX.Element }) => {
   return <AuthLayout>{children}</AuthLayout>;
};

export default AuthRoute;
