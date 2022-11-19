import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";

export default class app extends Component {
  render() {
    return (
      <div className = "app">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </div>
    );
  }
}
