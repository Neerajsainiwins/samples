import React, { Fragment } from 'react';
import logoImage from '../../../assets/images/logo.png';
import { NavLink, Link } from "react-router-dom";
import homeIcon from '../../../assets/images/home.svg';
import calendarIcon from '../../../assets/images/calendar.svg';
import dollarIcon from '../../../assets/images/dollar-sign.svg';
import checkcircleIcon from '../../../assets/images/check-circle.svg';
import linkIcon from '../../../assets/images/link-2.svg';
import fileIcon from '../../../assets/images/file.svg';
import Dropdown from 'react-bootstrap/Dropdown';

const AppHeader = ({ auth, onLogout, showMenu, onToggleMenu, Notifications }) => {
    return (
        <Fragment>
            <nav className="navbar header-navbar pcoded-header iscollapsed fixed-top">
                <div className="navbar-wrapper">
                    <div className="navbar-logo">
                        <Link to="/"><img className="img-fluid" src={logoImage} alt="Theme-Logo" /></Link>
                        <button className='link-button mobile-options'>
                            <i className="feather icon-more-horizontal"></i>
                        </button>
                    </div>
                    <div className="navbar-container container-fluid">

                        <ul className="nav-left">
                            <li>
                                <button className='link-button mobile-menu' id="mobile-collapse" onClick={onToggleMenu}>
                                    <i className="fa fa-bars"></i>
                                </button>
                            </li>
                        </ul>
                        <ul className="nav-right ml-auto">
                            <li className="header-notification">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <i className="fa fa-bell-o"></i>
                                        <span className="badge bg-c-pink">{Notifications ? Notifications.length : '0'}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="show-notification notification-view">
                                        <ul>
                                            <li><h6>Notifications</h6></li>
                                            { Notifications && Notifications.map((notification) =>
                                                <li key={notification.Id}>
                                                    <div className="media">
                                                        <div className="media-body">
                                                            <p className="notification-msg">{notification.NotificationText}</p>
                                                            <span className="notification-time"><i className="fa fa-clock-o" aria-hidden="true"></i> {notification.FormattedActivityDate}</span>
                                                        </div>
                                                    </div>
                                                </li>)
                                            }
                                        </ul>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                            <li className="user-profile">
                                <span>{auth.user.FirstName + ' ' + auth.user.LastName} <small>Phase : {auth.user.PhaseDesc}</small></span>
                            </li>
                            <li className="user-logout">
                                <button className='link-button mobile-menu' id="mobile-collapse" onClick={onLogout}>
                                    <i className="fa fa-sign-out"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* sidebar */}
            <div className={`br-sideleft ps ${showMenu ? 'hide' : ''}`}>
                <ul className="br-sideleft-menu">
                    <li>
                        <NavLink className="active" to={`/`}>
                            <img src={homeIcon} alt="Home Icon" width="16" />
                            <span className="menu-item-label">Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="active" to={`/`}>
                            <img src={calendarIcon} alt="Calendar Icon" width="16" />
                            <span className="menu-item-label">Agendas</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="active" to={`/`}>
                            <img src={dollarIcon} alt="Dollar Icon" width="16" />
                            <span className="menu-item-label">Accounts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="active" to={`/`}>
                            <img src={checkcircleIcon} alt="Check Circle Icon" width="16" />
                            <span className="menu-item-label">Reminder</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="br-menu-link" to={`/Links`}>

                            <img src={linkIcon} alt="Link Icon" width="16" />
                            <span className="menu-item-label">Helpful Links</span>

                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="active" to={`/`}>
                            <img src={fileIcon} alt="File Icon" width="16" />
                            <span className="menu-item-label">Resource Library</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </Fragment>
    );
}

export default AppHeader;