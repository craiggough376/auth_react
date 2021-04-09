import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const login = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/login", user).then(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          localStorage.setItem("token", res.data.token);
          window.location = "/";
        }
      },
      (err) => {
        console.log(err.response);
        setError(err.response.data.error);
      }
    );
  };

  const handleChange = (event) => {
    const copiedUser = { ...user };
    const propertyName = event.target.name;
    copiedUser[propertyName] = event.target.value;
    setUser(copiedUser);
  };
  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={login}>
        Email:
        <input
          type="text"
          value={user.name}
          name="email"
          onChange={handleChange}
        />
        Password:
        <input
          type="password"
          value={user.password}
          name="password"
          onChange={handleChange}
        />
        <input type="submit" value="Login" />
      </form>
      <p>{error}</p>
    </>
  );
};
export default Login;
