import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import SignUp from "../components/Signup";
const MainContainer = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        <Route exact path="/signup" render={() => <SignUp />} />
        <Route exact path="/login" render={() => <Login />} />
      </Switch>
    </>
  );
};
export default MainContainer;
