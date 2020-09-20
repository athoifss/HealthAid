import React from "react";
import App from "./App";
import Login from "./Login";
import Doctor from "./Doctor";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const Container = () => {
  function isLoggedIn() {
    if (localStorage.getItem("userId")) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <div>
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={() => (isLoggedIn() ? <Redirect to="/" /> : <Login />)}
          />
          <Route
            exact
            path="/doctor"
            render={() => (isLoggedIn() ? <Doctor /> : <Login />)}
          />
          <Route
            path="/"
            render={() => (isLoggedIn() ? <App /> : <Redirect to="/login" />)}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default Container;
