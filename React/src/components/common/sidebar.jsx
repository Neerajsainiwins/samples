import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

class Sidebar extends Component {
  // constructor(props) {
  //     super(props);
  //     this.onSignout = this.onSignout.bind(this);
  //   }
  // handleRedirect = () => {
  //    window.location.href="/Home/Profile";
  // }
  // onSignout = event =>{
  //     event.preventDefault();
  //     this.props.history.push(`/Login`);
  // }

  render() {
    return (
      <aside id="leftsidebar" className="sidebar">
        <div className="user-info">
          <div className="image">
            <img
              src={require("../../assets/images/user.png")}
              width="48"
              height="48"
              alt="User"
            />
          </div>
          <div className="info-container">
            <div
              className="name"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {localStorage.getItem("Name")}
            </div>
            <div className="email">{localStorage.getItem("Email")}</div>
            <div className="btn-group user-helper-dropdown">
              <i
                className="material-icons"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                keyboard_arrow_down
              </i>
              <ul className="dropdown-menu pull-left">
                <li>
                  <NavLink to="/Home/Profile">
                    <i className="material-icons">person</i>Profile
                  </NavLink>
                </li>
                {/* <li role="separator" className="divider"></li>
                            <li><Link to='/Home'><i className="material-icons">group</i>Followers</Link></li>
                            <li><Link to='/Home'><i className="material-icons">shopping_cart</i>Sales</Link></li>
                            <li><Link to='/Home'><i className="material-icons">favorite</i>Likes</Link></li> */}
                <li role="separator" className="divider" />
                <li>
                  <NavLink to="/Login">
                    <i className="material-icons">input</i>Sign Out
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="menu">
          <ul className="list">
            <li className="header">MAIN NAVIGATION</li>
            <li className="active">
              <Link to="/Home">
                <i className="material-icons">home</i>
                <span>Home</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
