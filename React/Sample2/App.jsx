import React, { Component } from 'react';

import { history } from './helpers';

import AppLayout from './shared/layouts/AppLayout';

const withoutHeaderFooterRoutes = ['/account/login', '/account/changepassword'];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1
    }
  }
  componentDidMount() {
    this.setState({ showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1 });
    history.listen((location, action) => {
      this.setState({ showHeaderFooter: withoutHeaderFooterRoutes.indexOf(window.location.pathname) === -1 });
    });
  }


  render() {
    const { showHeaderFooter } = this.state;
    return (
      <AppLayout showHeaderFooter={showHeaderFooter} />
    );
  }
}



export default App;
