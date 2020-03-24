import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

/* Without Sidebar */
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import forgotPassword from "./components/auth/forgotPassword";
import Error from "./components/auth/error";
import Test from './components/main/test'
import Form from './components/common/Form'

import HomeView from './components/layout/mainLayout';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
        <Route path='/form' component={Form}></Route>
          <Route path='/test' component={Test}></Route>
          <Route path="/" component={Login} exact />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotpassword" component={forgotPassword} />
          <Route path="/home" component={HomeView} />
          <Route component={Error} exact />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
