import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register, NoiQuyCty } from './views/Pages';
import clientUtils from './utils/client-utils';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  async componentWillMount() {
    var logedin = await JSON.parse(localStorage.getItem('isofh'))
    clientUtils.auth = logedin && logedin.employees ? logedin.employees.loginToken : '';
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/noiquy" name="Login Page" component={NoiQuyCty} />
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
