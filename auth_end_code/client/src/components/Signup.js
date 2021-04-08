import React, { useState } from "react";
const SignUp = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const propertyName = event.target.name;
    const newUserCopy = { ...newUser };
    newUserCopy[propertyName] = event.target.value;
    setNewUser(newUserCopy);
  };

  const signUp = (event) => {
    event.preventDefault();
    console.log("Click");
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
    </>
  );
};
export default SignUp;
