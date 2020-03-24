import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "../../helpers/history";
import PrivateRoute from '../components/functional/PrivateRoute';
import IdleTimer from 'react-idle-timer';
import Alert from '../components/ui/alert'
import * as actions from '../../store/actions';
import appRoutes from '../../routes/app';
import { bindActionCreators } from 'redux';
import { apiService } from '../../services/api.service';
import { localStorageService } from '../../services';
import moment from "moment";
import * as signalR from '@aspnet/signalr';

class AppLayout extends Component {
    constructor(props) {
        super(props)
        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.state = {
            showMenu: false,
            username: '',
            message: '',
            messages: [],
            connection: null,
        };
    }

    _onAction(e) {
        //console.log('user did something', e);
        localStorageService.SetExpiresAtInMinutes();
    }

    _onActive(e) {
    }

    _onIdle(e) {
        //console.log('user is idle');
        this.handleLogout();
    }


    handleToggleMenu = (e) => {
        this.setState({
            showMenu: !this.state.showMenu,
        })
    }


    handleLogout = (e) => {

        apiService.logout();
        this.props.actions.logout();
        history.push("/account/login");
    }
    // getNotifications = () => {
    //     const {   } = this.props;
    //     apiService.post('RECENTACTIVITY', { ClientId: auth.user.ClientId, IncludeAck: 0, Offset: "" }).then(response => {
    //         if (response.Success && response.Notifications) {
    //             this.setState({ notifications: response.Notifications });
    //         }
    //     }, error => {
    //         this.props.actions.showAlert({ message: error, variant: 'error' });

    //     });
    // }
    componentDidMount() {
        history.listen((location, action) => {
            this.setState({ showMenu: false });
        });
        
        // this.getGlobalCodes();
        // this.interval = setInterval(() => {
        //     this.getGlobalCodes();
        // }, 50000);
        //this.getGlobalCodesToStore();
        // this.sendMessage();
       // const hubConnection = new HubConnection('http://localhost:52188/signalr-myChatHub');
    //    const connection = new signalR.HubConnectionBuilder()
    //    .configureLogging(signalR.LogLevel.Debug)
    //    .withUrl("http://localhost:52188/signalr-myChatHub", {
    //     skipNegotiation: true,
    //     transport: signalR.HttpTransportType.WebSockets
    //   })
    //    .build();
   
    //     this.setState({ connection }, () => {
    //         this.state.connection
    //           .start()
    //           .then(() => console.log('Connection started!'))
    //           .catch(err => console.log('Error while establishing connection :('));
      
    //         this.state.connection.on('sendToAll', this.getGlobalCodesToStore)
    //       });
            // this.updateGlobalCodes();
    }
   
//  testing Purpose of signalR for updation of GlobalCodes
updateGlobalCodes = () => {
    apiService.post('UPDATEGLOBALCODES', { CategoryId: 1, GlobalCodeId: 1, CodeName: "Female", Description: "Female", Active: "N", UserName: "tom" }).then(response => {
        if (response.StatusCode == 200) {
// this.sendMessage();
            //localStorage.setItem('globalcodes', JSON.stringify(response.data.globalCodeMainResponse.globalCodeResponse));
        }

    }, error => {

    });

}

    componentWillUnmount() {
        clearInterval(this.interval);
    }

getGlobalCodesToStore = () => {
    if(localStorage.getItem('globalcodes').length > 0){
        localStorage.removeItem("globalcodes");
        let latestRecordDate = this.getLatestDate(JSON.parse(localStorage.getItem('globalcodes')));
        this.updateAllGlobalCodesInLocalStorage(latestRecordDate);
    }
    else{
        this.getAllActiveInactiveGlobalCodes();
    }
}

    getGlobalCodes = (e) => {
        const selval = -1;
        this.setState({ selectValue: selval });
        apiService.post('GETALLMODIFIEDGLOBALCODES', { CategoryId: selval, UserName: "tom" }).then(response => {
            if (response.Message && response.data.globalCodeMainResponse.totalRecords > 0) {
                let updatedGlobalCodeJson = response.data.globalCodeMainResponse.globalCodeResponse;
                let availedGlobalCodesJson = JSON.parse(localStorage.getItem('globalcodes'));


                updatedGlobalCodeJson.map((value, index) => {
                    let globalCodeExistence = "N";
                    if (availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])) {
                        globalCodeExistence = "Y";
                        //    let oldGlobalCodeJsonObject = availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["Active"] = value["Active"]
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["CodeName"] = value["CodeName"]
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["Description"] = value["Description"]
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["TOMREXName"] = value["TOMREXName"]
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["CannotModifyNameOrDelete"] = value["CannotModifyNameOrDelete"]
                        availedGlobalCodesJson.find(g => g.GlobalCodeId == value["GlobalCodeId"])["RecordDeleted"] = value["RecordDeleted"]

                        //    availedGlobalCodesJson.map((row, num) => {

                        //     if(value["GlobalCodeId"] === row["GlobalCodeId"])
                        //     {
                        //         row["Active"] = value["Active"]
                        //         row["CodeName"] = value["CodeName"]
                        //         row["Description"] = value["Description"]
                        //         row["TOMREXName"] = value["TOMREXName"]
                        //         row["CannotModifyNameOrDelete"] = value["CannotModifyNameOrDelete"]
                        //         row["RecordDeleted"] = value["RecordDeleted"]
                        //     }

                        // });
                    }
                    else {
                        availedGlobalCodesJson.push(value);
                    }

                });
                console.log(availedGlobalCodesJson);
                // localStorage.setItem('globalcodes', JSON.stringify(response.data.globalCodeMainResponse.globalCodeResponse));
                // localStorage.setItem('globalcodes', availedGlobalCodesJson);
            }

        }, error => {

        });

    }

    getLatestDate = (data) => {
        // convert to timestamp and sort
        var sorted_ms = data.map(function (item) {
            return new Date(item.ModifiedDate).getTime()
        }).sort();
        // take latest
        var latest_ms = sorted_ms[sorted_ms.length - 1];
        // convert to js date object 
        return new Date(latest_ms);
    }
    
        updateAllGlobalCodesInLocalStorage = (latestdatetime) => {
            const selval = -1;
            this.setState({ selectValue: selval });
            apiService.post('GETALLGLOBALCODES', { CategoryId: selval, ModifiedDate: moment(latestdatetime).format("MMMM D, YYYY hh:mm:ss") , UserName: "tom" }).then(response => {
                if (response.Message && response.data.globalCodeMainResponse.totalRecords > 0) {

                    localStorage.setItem('globalcodes', JSON.stringify(response.data.globalCodeMainResponse.globalCodeResponse));
                }

            }, error => {

            });

        }
    
        getAllActiveInactiveGlobalCodes = () => {
            const selval = -1;
            this.setState({ selectValue: selval });
            apiService.post('GETALLACTIVEINACTIVEGLOBALCODES', { CategoryId: selval, UserName: "tom" }).then(response => {
                if (response.Message && response.data.globalCodeMainResponse.totalRecords > 0) {

                    localStorage.setItem('globalcodes', JSON.stringify(response.data.globalCodeMainResponse.globalCodeResponse));
                }

            }, error => {

            });
        }

       

    render() {
        const { auth, alert, actions, showHeaderFooter, global } = this.props;

      


        return (
            <Fragment>
                {/* {
                    auth.loggedIn &&
                    !localStorageService.isRememberMeChecked() &&
                    (
                        <IdleTimer
                            ref={ref => { this.idleTimer = ref }}
                            element={document}
                            onActive={this.onActive}
                            onIdle={this.onIdle}
                            onAction={this.onAction}
                            debounce={250}
                            timeout={1000 * 60 * TIMEOUT_IN_MINUTES} />)
                } */}
                <Router history={history} >
                    {/* {
                        showHeaderFooter && auth.loggedIn &&
                        <AppHeader auth={auth} onLogout={this.handleLogout} showMenu={this.state.showMenu} onToggleMenu={this.handleToggleMenu} Notifications={this.state.notifications} />
                    } */}
                    <main id="main" >
                        <div className="pcoded-inner-content">
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <div className="page-body">
                                        <Switch>
                                            {
                                                appRoutes.map((prop, key) => {
                                                    if (prop.redirect)
                                                        return <Redirect from={prop.path} to={prop.to} key={key} />;

                                                    return (
                                                        prop.auth ?
                                                            <PrivateRoute {...prop} key={key} />
                                                            : <Route {...prop} key={key} />
                                                    );
                                                })

                                            }

                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    {/* {
                        showHeaderFooter && auth.loggedIn && <AppFooter />
                    } */}
                </Router>

                {/* <Alert {...alert} onHideAlert={actions.hideAlert} /> */}

            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        alert: state.alert,
        auth: state.auth,
        // global: state.global
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            logout: bindActionCreators(
                actions.logout,
                dispatch
            ),
            hideAlert: bindActionCreators(
                actions.hideAlert,
                dispatch
            ),
            // globalCodesOld: bindActionCreators(
            //     actions.globalCodesOld,
            //     dispatch
            // ),
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
