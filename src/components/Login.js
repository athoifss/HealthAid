import React, { useState, useEffect } from "react";
import Preloader from "./Preloader";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import { postRequest } from "../common/api";

import style from "../common/style.js";
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  left: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: style.primary,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 20px",
  },
  leftText: {
    "& h1": {
      fontSize: "3em",
    },
    "& p": {
      fontSize: "1.5em",
    },
  },
  right: {
    width: "70%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  input: {
    width: "100%",
    height: "40px",
    border: `1px solid ${style.greyLight}`,
    marginBottom: "10px",
    color: style.greyDark,
    fontSize: "1em",
    display: "flex",
    "& input": {
      height: "100%",
      border: "none",
      padding: "0 10px 0 10px",
    },
  },
  inputIcon: {
    height: "100%",
    width: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  order1: {
    order: 1,
  },
  order2: {
    order: 2,
  },
  btnLogin: {
    background: style.primary,
    color: style.primaryText,
    border: "none",
    height: "40px",
    width: "100%",
    cursor: "pointer",
  },
}));

const Login = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [segLogin, setSegLogin] = useState(true);
  const [orderLeft, setOrderLeft] = useState(classes.order1);
  const [orderRight, setOrderRight] = useState(classes.order2);
  const [loginData, setLoginData] = useState({
    "e-mail": "sai.hack.2021@gmail.com",
    password: "test159",
  });

  let history = useHistory();

  function switchSides() {
    if (segLogin) {
      setOrderLeft(classes.order2);
      setOrderRight(classes.order1);
      setSegLogin(false);
    } else {
      setOrderRight(classes.order2);
      setOrderLeft(classes.order1);
      setSegLogin(true);
    }
  }

  function LoginChangeHandler(e) {
    let newData = { ...loginData };
    newData[e.target.name] = e.target.value;
    setLoginData(newData);
    console.log(newData);
  }

  function LoginSubmitHandler(e) {
    e.preventDefault();
    setLoading(true);
    console.log(loginData);
    postRequest("Users/login", loginData)
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("userId", resp.data.user_id);
        console.log(resp.data);
        history.push("/");
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <div className={`${classes.left} ${orderLeft}`}>
            <div className="logo"></div>
            <div className={classes.leftText}>
              <h1>WELCOME BACK</h1>
              <p>Please login with your details to use our services</p>
              <button onClick={switchSides}>Click Me</button>
            </div>
          </div>
          <div className={`${classes.right} ${orderRight}`}>
            <form
              onChange={LoginChangeHandler}
              onSubmit={LoginSubmitHandler}
              className={classes.form}
            >
              <div className={classes.input}>
                <div className={classes.inputIcon}>
                  <EmailIcon />
                </div>
                <input
                  placeholder="email"
                  value={loginData["e-mail"]}
                  name="e-mail"
                />
              </div>
              <div className={classes.input}>
                <div className={classes.inputIcon}>
                  <LockIcon />
                </div>
                <input
                  placeholder="password"
                  value={loginData["password"]}
                  className={classes.input}
                  type="password"
                  name="password"
                />
              </div>

              <button class={classes.btnLogin} onClick={LoginSubmitHandler}>
                Sign In
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
