import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getRequest, postRequest } from "../common/api.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  profilePicContainer: {
    width: "200px",
    height: "200px",
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
}));
const Profile = () => {
  const [user, setUser] = React.useState({});
  useEffect(() => {
    getRequest(`Users/${localStorage.getItem("userId")}`);
  });

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.profilePicContainer}>
        <img src="https://www.ibts.org/wp-content/uploads/2017/08/iStock-476085198.jpg" />
      </div>
      <div className={classes.profileDetails}>
        <div className={classes.profileSec}>
          <div className={classes.field}>Name</div>
          <div className={classes.value}>{user.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
