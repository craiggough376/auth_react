import React from "react";
import { Redirect } from "react-router";
const Home = () => {
  if (localStorage.getItem("token") === null) {
    return <Redirect to="/login" />;
  }
  const logout = () => {
    localStorage.clear();
    window.location = "/login";
  };
  return (
    <>
      <p>Home Page</p>
      <button onClick={logout}>Logout</button>
    </>
  );
};
export default Home;
