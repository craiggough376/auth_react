# Using Authenication with React and MongoDb

## Lesson Objectives

- Know how to use axios, jsonwebtoken and mongoose
- Understand how to verify a user
- Be able to make a basic authenication app.

### Introduction

We are going to make a basic application with authenication functionality using a React frontend and mongodb/express backend incorporating mongoose, axios, jsonwebtoken and bcrypt.

> Hand out start code

```bash
// terminal server directory
npm install
npm run server:dev
```

```bash
// terminal client directory
npm install
npm start
```

Visit `localhost:5000` and you should see "hello world".

Visit `localhost:3000` and you should see "Home".

## Signup

> Give 5 mins to look over the code.

You'll notice in the front end, we have a very basic application implementing React router with 3 routes. The Home page ("/"), login page("/login") and signup page ("/signup"). Signup page has a form ready for use to use but isnt being posted anywhere. When we click signup we should see only 'click' console logged in the browser dev tools.

We have a client and server folder. Let's start by connecting the two.

First we want the body of our requests parsed by our server.js.

```js
// server.js
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.

A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).

```js
app.post("/signup", (req, res) => {});
```

Next we will go back to the frontend and install Axios to call and send data back to the backend.

`npm install axios`

And we can include it in our signup.js

```js
// signup.js
import axios from "axios";
```

## Axios

Axios is a promise based HTTP request library which allows us to interface with REST APIs.

### Axios v Fetch

- Fetch's body = Axios' data
- Fetch's body has to be stringified, Axios' data contains the object
- Fetch has no url in request object, Axios has url in request object
- Fetch request function includes the url as parameter, Axios request function does not include the url as parameter.
- Fetch request is ok when response object contains the ok property, Axios request is ok when status is 200 and statusText is 'OK'
- To get the json object response: in fetch call the json() function on the response object, in Axios get data property of the response object.

We will now use axios to send the data to the backend. Post requires the URL as the first parameter and data to be passed as the second.

```js
axios.post("http://localhost:5000/signup", newUser);
```

Lets check if the data is sent to the backend.

```js
// server.js
app.post('/signup', (req, res) =>{
  console.log(req.body) <!--added-->
})

```

Doing this alone with run into a cors issue. Let us resolve this now by
` npm install cors`

```js
// server.js
const cors = require("cors");
app.use(cors());
```

When submitting form you should now see the data on the displayed in your terminal screen.

### Mongoose

Now that we can access our front end data and send it to the backend lets look into creating our mongoose model.

In terms of Node.js, mongodb is the native driver for interacting with a mongodb instance and mongoose is an Object modeling tool for MongoDB. Using Mongoose, a user can define the schema for the documents in a particular collection. It provides a lot of convenience in the creation and management of data in MongoDB.

```js
terminal - server folder
npm install mongoose
mkdir models
touch models/User.js
```

First we will grab mongoose by requiring it in and creating our Schema. We will set the email to unique so that only one account can have one email.

```js
// User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    unique: true,
    type: String,
  },
  password: String,
});
```

Mongoose's inbuild validators are when we add a criteria to the data we want to persist. Another example is `required: true`, `minLength: 2`, `maxLength: 6`, `enums`.
We can also make custom validators by adding logic.

Then we will set a collection for where this schema will be sent to.

```js
const User = mongoose.model("User", userSchema);

module.exports = User;
```

Then require the User into the server.js

```js
// server.js
const User = require("./models/User");
```

```js
app.post("/signup", (req, res) => {
  let newUser = new User({
    email: req.body.email,
    name: req.body.name,
  });
});
```

We will decrypt our password by using bcrypt.

`npm i bcrypt`

```js
// server.js
const bcrypt = require("bcrypt");
```

Then we should use bcrypt when storing our password

```js
app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email
    name: req.body.name
    password: bcrypt.hashSync(req.body.password, 10)<!--added-->
  })
  console.log(newUser) <!--added-->
})
```

We should have our schema model in the terminal. You may have to restart server to get the password to decrypt.

Now we can point our mongoose to our localhost.

```js
// server.js
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/signups");
```

We will now save the new user to the database. First we will set up if there are any errors.

```js
// server.js
app.post('/signup', (req,res) =>{
  let newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save((err) => { <!--modified-->
	  if(err){
	    return res.status(400).json({
	      title:'error',
	      error:'email in use'
    })
  })
})

```

This would be a status of 400 Bad Request
This response means that server could not understand the request due to invalid syntax. Most likely caused by user entering an email that is already in use.

If there is no error lets return a successful status of 200.

```js
// server.js
  newUser.save(err => {
    if(err){
      return res.status(400).json({
        title:'error',
        error:'email in use'
      })
    }
    return res.status(200).json({ <!--added-->
      title:'signup success'
    })
  })
})
```

When we try to add multiple names with the same email we should get an error in our console. We should also check MongoDB Compass we should see our new user.

In order to get some feedback from when we add the user.

```js
// signup.js
axios.post('http://localhost:3000/signup', newUser)
        .then(res => { 			<!--added-->
          console.log(res);
        }, err => {
          console.log(err.response);
        })
```

Lets test this out by adding a new user and you should receive some feedback from the console saying it has been successful. Clicking again with the same email should flag an error saying email is in use.

## Login

Lets set up our login page.

```js
// login.js
import React, { useState } from "react"; //added
const Login = () => {
  //added
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //added
  const handleChange = (event) => {
    const copiedUser = { ...user };
    const propertyName = event.target.name;
    copiedUser[propertyName] = event.target.value;
    setUser(copiedUser);
  };

  return (
    <>
      <h1>Login Page</h1>
      <form>
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
    </>
  );
};
export default Login;
```

We would like to connect to the backend. For which we will use axios.

```js
// login.js
import axios from "axios";
```

Lets make the click button call a function

```js
      <form onSubmit={login}> <!--modified-->
```

```js
// login.js
const login = (event) => {
  event.preventDefault();
  axios.post("http://localhost:5000/login", user);
};
```

We will send it to the backend and check that we are receiving the data.

```js
app.post("/login", (req, res) => {
  console.log(req.body);
});
```

After attempting to login we should see our email and password in our terminal.

We should then use the mongoose function findOne. Since all of our emails are set up to be unique there should only be one. We will also flag up an error if an email in not found on the front end.

```js
// server.js
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    if (!user)
      return res.status(401).json({
        title: "user not found",
        error: "invalid creditentials",
      });
  });
});
```

We will use bcrypt.compareSync method which takes only 2 arguments and returns a boolean value true or false. We will flag up if the password is incorrect.

```js
// server.js
if (!user)
  return res.status(401).json({
    title: "user not found",
    error: "invalid creditentials",
  });
// incorrect Password <!--added-->
if (!bcrypt.compareSync(req.body.password, user.password)) {
  return res.status(401).json({
    title: "login failed",
    error: "invalid creditentials",
  });
}
```

And then only if everything is all good, we will use json web token to verify the user and the credentials. We will send a token back to the frontend for the user to use that token.

` npm install jsonwebtoken`

We could also add some visual feedback to incorporate the error messages we have flagged up in our backend by adding them to our signup.js

> show the error when trying to sign up for same email address and route that it takes to get to error message. Should be err.response.data.title

```js
// signup.js
import React, { useState } from "react";
import axios from "axios";
const SignUp = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); //added

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
        window.location = "/login"; //added
      },
      (err) => {
        console.log(err.response);
        setError(err.response.data.error); //added
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
        Email: <input
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
      <p>{error}</p> //added
    </>
  );
};
export default SignUp;
```

We can also push this user towards the login page as we know they have signed up successfully.

```js
//signup.js
axios.post('http://localhost:3000/signup', newUser)
        .then(res => {
          console.log(res);
          window.location = '/login' <!--added-->
```

If we check with our mongodb compass we should have a new user.

Lets now give some feedback to the login for wrong password.

```js
// login.js
import React, { useState } from "react";
import axios from "axios";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); //added

  const login = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/login", user).then(
      //added
      (res) => {
        console.log(res);
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
      <p>{error}</p> //added
    </>
  );
};
export default Login;
```

Now lets go back to the backend and if successful send a token to the frontend.

```js
// server.js
const jwt = require("jsonwebtoken");
```

In order to generate a web token we use the function .sign(). In the first parameter include a payload and the second parameter include a secret key. We will send the `userId: user_id` as we know by logging out the user we get a `_id`. And we will create a global variable of random letters which can't be hacked. Then we will send this json back to the frontend.

```js
// server.js
let token = jwt.sign({ userId: user._id }, secretKey);
return res.status(200).json({
  title: "login successful",
  token: token,
});
```

Create a global variable above the function

```js
const secretKey = "hfdsahgjkhfvsdaljgdisajg23452asgasg";
```

Now lets go back to the frontend and log out our response and it should give us a token.

```js
// login.js
axios.post('http://localhost:3000/login', user)
        .then(res => {
          if (res.status === 200){ <!--added-->
          console.log(res)}
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error
        })
    }
```

If we attempt to login in with a registered email and password we should see in our console that we have now have a token.

```js
data: title: "login successful";
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDUyN2";
```

Now that we have our token we will store it in our local storage and then push them to our home page.

```js
//login.js
axios.post('http://localhost:3000/login', user)
        .then(res => {
          if (res.status === 200){
          localStorage.setItem('token', res.data.token) <!--modified-->
          window.location = "/"
          }
```

This will redirect us to the loading page. Which we will add in some conditional logic to check if the user has been authorised (includes a token in local storage).

```js
// home.js
import React from "react";
import { Redirect } from "react-router-dom"; //added
const Home = () => {
  //added
  if (localStorage.getItem("token") === null) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <p>Home Page</p>
    </>
  );
};
export default Home;
```

Now let us add a logout button to the home page. All we need to do is clear our localStorage.

```js
// home.js
import React from "react";
import { Redirect } from "react-router-dom";
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
```

## User Details

Since we know the user is logged in we can personallise the page using the details acquired. We will send the token through the header.

```js
// home.js
import React, { useEffect } from "react"; //added
import { Redirect } from "react-router-dom";
import axios from "axios"; //added

const Home = () => {
  if (localStorage.getItem("token") === null) {
    return <Redirect to="/login" />;
  }

//added
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err);
        }
      );
  }, []);
```

This will flag up a 404 as we have yet to create this route. Lets do this now in the backend.

We will use jwt.verify() which takes two parameters, first is a token, second is our secret key. We will also provide an error response which we will provide a decoded response.

```js
// server.js
app.get("/user", (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorised",
      });
    console.log(decoded);
  });
});
```

There should only be a decoded userId if the user exists in the system.

```js
// server.js
app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({ _id: decoded.userId }, ( err, user ) => { <!--modified-->
      if (err) return console.log(err);
      console.log(user);
    })
  })
})
```

This should then log out the user details to the console. Since we can now log all of the data we can send all of the data to the frontend. Incidently we will not send back the whole object of user since we don't want to send our password so will only send email and name.

```js
// server.js
app.get('/user', (req, res) => {
  let token = req.headers.token;
  jwt.verify(token, secretkey, (err, decoded) => {
    if(err) return res.status(401).json({
      title: 'unauthorised'
    })
    User.findOne({ _id: decoded.userId }, ( err, user ) => {
      if (err) return console.log(err);
      return res.status(200).json({ <!--modified-->
        title: 'user grabbed', <!--added-->
        user: {					<!--addded-->
          email: user.email,
          name: user.name
        }
      })
    })
  })
})

```

This should now pop up on our console and we can then use that data to display to the user.

```js
// home.js
import React, { useState, useEffect } from "react"; //added
import { Redirect } from "react-router-dom";
import axios from "axios";
const Home = () => {
  //added
  const [user, setUser] = useState({
    name: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          setUser(res.data.user); //added
        },
        (err) => {
          console.log(err);
        }
      );
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
      <p>Hello {user.name}</p> //added
      <button onClick={logout}>Logout</button>
    </>
  );
};
export default Home;
```

### Summary

We now know how to use axios to make get and post requests.

Can make Schema and use the methods in build to mongoose to

- Know how to use axios, jsonwebtoken and mongoose
- Understand how to verify user
- Be able to make a basic authenication app.
