import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
const SignUp = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const propertyName = event.target.name;
    const newUserCopy = { ...newUser };
    newUserCopy[propertyName] = event.target.value;
    setNewUser(newUserCopy);
  };

  const signUp = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/signup", newUser).then(
      (res) => {
        console.log(res);
        return <Redirect push to="/login" />;
      },
      (err) => {
        console.log(err.response);
        setError(err.response.data.error);
      }
    );
  };

  return (
    <>
      <h1>Signup page</h1>
      <form onSubmit={signUp}>
        Name:{" "}
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleChange}
        />
        Email:{" "}
        <input
          type="text"
          name="email"
          value={newUser.email}
          onChange={handleChange}
        />
        Password:{" "}
        <input
          type="password"
          value={newUser.password}
          name="password"
          onChange={handleChange}
        />
        <input type="submit" value="Sign Up" />
      </form>
      <p>{error}</p>
    </>
  );
};
export default SignUp;
