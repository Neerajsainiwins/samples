import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AjaxHelper from "../common/ajaxHelper";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import validator from "validator";
import classNames from "classnames";

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  formDefaults = {
    username: { value: "", isValid: true, message: "" },
    password: { value: "", isValid: true, message: "" },
    blocking: false
  };

  state = {
    ...this.formDefaults
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: { value: e.target.value, isValid: true, message: "" }
    });
  };

  handleRedirect = () => {
    this.props.history.push(`/Home`);
  };

  onRegister = event => {
    event.preventDefault();
    this.props.history.push(`/Register`);
  };

  onForgot = event => {
    event.preventDefault();
    this.props.history.push(`/ForgotPassword`);
  };

  submitOnAxios = e => {
    e.preventDefault();
    if (this.formIsValid()) {
      this.setState({ blocking: true });
      var data = {
          UserName: this.state.username.value,
          Password: this.state.password.value
        },
        url = "http://localhost:64519/CommonAPI/UserLogin";
      let myajaxresult = AjaxHelper(url, data)
        .then(res => {
          this.setState({ blocking: false });

          if (res.Success) {
            localStorage.setItem("Name", res.Name);
            localStorage.setItem("BasicInfoId", res.UserBasicInformationId);
            localStorage.setItem("Email", res.Email);
            this.handleRedirect();
          } else {
            let element = document.getElementById("errorBlock");
            element.classList.remove("hide");
            alert(res.Message);
          }
        })
        .catch(error => {
          this.setState({ blocking: false });
          alert(error);
        });
    }
  };

  formIsValid = () => {
    let username = this.state.username;
    let password = this.state.password;
    let isGood = true;

    if (validator.isEmpty(username.value)) {
      username.isValid = false;
      username.message = "Please enter user name";
      isGood = false;
    }
    if (validator.isEmpty(password.value)) {
      password.isValid = false;
      password.message = "Please enter password";
      isGood = false;
    }

    if (!isGood) {
      this.setState({
        username,
        password
      });
    }
    return isGood;
  };

  render() {
    document.body.classList.add("login-page");
    const { username, password } = this.state;
    const usernameGroupClass = classNames("erroralert", {
      error: !username.isValid
    });
    const passwordGroupClass = classNames("erroralert", {
      error: !password.isValid
    });
    return (
      <div>
        <BlockUi tag="div" blocking={this.state.blocking} />

        <div className="login-box">
          <div className="logo">
            <a>
              <b>DITS</b>
            </a>
            <small />
          </div>
          <div className="card">
            <div className="body">
              <form id="sign_in" method="POST" onSubmit={this.submitOnAxios}>
                <div className="msg">Sign in to start your session</div>
                <div
                  id="errorBlock"
                  className="alert bg-pink hide"
                  role="alert"
                >
                  <strong>Oh snap!</strong>
                  &nbsp;Check login details and try again.
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">person</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      value={this.state.username.value}
                      onChange={e => this.handleChange(e)}
                    />
                  </div>
                  <label className={usernameGroupClass}>
                    {username.message}
                  </label>
                </div>
                <div className="form-group">
                  <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      value={this.state.password.value}
                      onChange={e => this.handleChange(e)}
                    />
                  </div>
                  <label className={passwordGroupClass}>
                    {password.message}
                  </label>
                </div>
                <div className="row">
                  <div className="col-xs-8 p-t-5">
                    {/* <input
                      type="checkbox"
                      name="rememberme"
                      id="rememberme"
                      className="filled-in chk-col-pink"
                    />
                    <label htmlFor="rememberme">Remember Me</label> */}
                  </div>
                  <div className="col-xs-4">
                    <button
                      className="btn btn-block bg-pink waves-effect"
                      type="submit"
                    >
                      SIGN IN
                    </button>
                  </div>
                </div>
                <div className="row m-t-15 m-b--20">
                  <div className="col-xs-6">
                    <a onClick={event => this.onRegister(event)}>
                      Register Now!
                    </a>
                  </div>
                  <div className="col-xs-6 align-right">
                    <a onClick={event => this.onForgot(event)}>
                      Forgot Password?
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
