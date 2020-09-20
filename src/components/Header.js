import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import style from "../common/style.js";

const useStyles = makeStyles(() => ({
  root: {
    background: "transparent",
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  logo: {
    fontSize: "2em",
    letterSpacing: "1.1px",
    fontWeight: "bold",
  },
  aid: {
    color: "white",
  },
  profilePicContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    background: style.greyMid,
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    cursor: "pointer",
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <span className={classes.aid}>Health</span>
        <span>Aid</span>
      </div>
      <div className={classes.profilePicContainer}>A</div>
    </div>
  );
};

export default Header;
