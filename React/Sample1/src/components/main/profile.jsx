import React, { Component } from "react";
import BasicDetail from "./profile/basicDetail";
import ContactDetail from "./profile/contactDetail";
import EmergencyContacts from "./profile/emergencyContactDetail";
import EducationDetail from "./profile/educationDetail";
import WorkDetail from "./profile/workDetail";
import BlockUi from "react-block-ui";
import AjaxHelper from "../common/ajaxHelper";

//Parent Component for profile page
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocking: false
    };
    this.handler = this.handler.bind(this);
    this.APICall = this.APICall.bind(this);
  }

  APICall(url, data) {
    return AjaxHelper(url, data);
  }

  handler(blocking) {
    this.setState({
      blocking: blocking
    });
  }

  handleActive = event => {
    event.preventDefault();
    for (
      let i = 0;
      i < document.getElementsByClassName("tabclick").length;
      i++
    ) {
      document.getElementsByClassName("tabclick")[i].classList.remove("active");
    }
    event.target.parentElement.classList.add("active");
  };

  render() {
    return (
      //Profile section that contains all profile components
      <section>
        <BlockUi tag="div" blocking={this.state.blocking} />
        <div className="row clearfix">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="card">
              <div className="header">
                <h2>Profile</h2>
              </div>
              <div className="body">
                <div className="row clearfix">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <ul className="nav nav-tabs tab-nav-right" role="tablist">
                      <li role="presentation" className="tabclick active">
                        <a
                          href="#home_animation_2"
                          data-toggle="tab"
                          onClick={event => this.handleActive(event)}
                        >
                          Basic Detail
                        </a>
                      </li>
                      <li role="presentation" className="tabclick">
                        <a
                          href="#profile_animation_2"
                          data-toggle="tab"
                          onClick={event => this.handleActive(event)}
                        >
                          Contact Detail
                        </a>
                      </li>
                      <li role="presentation" className="tabclick">
                        <a
                          href="#messages_animation_2"
                          data-toggle="tab"
                          onClick={event => this.handleActive(event)}
                        >
                          Emergency Contact Detail
                        </a>
                      </li>
                      <li role="presentation" className="tabclick">
                        <a
                          href="#settings_animation_2"
                          data-toggle="tab"
                          onClick={event => this.handleActive(event)}
                        >
                          Education Detail
                        </a>
                      </li>
                      <li role="presentation" className="tabclick">
                        <a
                          href="#work_animation_2"
                          data-toggle="tab"
                          onClick={event => this.handleActive(event)}
                        >
                          Work Detail
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content">
                      <div
                        role="tabpanel"
                        className="tab-pane animated fadeInRight active"
                        id="home_animation_2"
                      >
                        {/* Component to bind basic details section */}
                        <BasicDetail
                          handler={this.handler}
                          APICall={this.APICall}
                        />
                      </div>
                      <div
                        role="tabpanel"
                        className="tab-pane animated fadeInRight"
                        id="profile_animation_2"
                      >
                        {/* Component to bind contact details section */}
                        <ContactDetail
                          handler={this.handler}
                          APICall={this.APICall}
                        />
                      </div>
                      <div
                        role="tabpanel"
                        className="tab-pane animated fadeInRight"
                        id="messages_animation_2"
                      >
                        {/* Component to bind emergency contact detail section */}
                        <EmergencyContacts
                          handler={this.handler}
                          APICall={this.APICall}
                        />
                      </div>
                      <div
                        role="tabpanel"
                        className="tab-pane animated fadeInRight"
                        id="settings_animation_2"
                      >
                        {/* Component to bind education detail section */}
                        <EducationDetail
                          handler={this.handler}
                          APICall={this.APICall}
                        />
                      </div>
                      <div
                        role="tabpanel"
                        className="tab-pane animated fadeInRight"
                        id="work_animation_2"
                      >
                        {/* Component to bind work detail section */}
                        <WorkDetail
                          handler={this.handler}
                          APICall={this.APICall}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Profile;
