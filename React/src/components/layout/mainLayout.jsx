import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import Dashboard from "../main/dashboard";
import Profile from "../main/profile";

import Error from "../../components/auth/error";

const HomeView = ({ match }) => {
  document.body.classList.remove("login-page");
  document.body.classList.remove("signup-page");
  document.body.classList.add("theme-red");
  return (
    <div>
      <Navbar />
      <section>
        <Sidebar />
      </section>
      <section className="content" id='workarea'>
        <div className="container-fluid">
          <Switch>
            <Route path={`${match.url}`} exact component={Dashboard} />
            <Route path={`${match.url}/Profile`} exact component={Profile} />
            <Route component={Error} exact />
          </Switch>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
