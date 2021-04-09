import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import axios from "axios";
const Home = () => {
  const [user, setUser] = useState({
    name: "",
  });
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      axios
        .get("http://localhost:5000/user", {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setUser(res.data.user);
        });
    }
  }, []);
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
      <p>Hello {user.name}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
};
export default Home;
