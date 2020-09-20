import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getRequest, postRequest } from "../common/api.js";

const useStyles = makeStyles((theme) => ({
  root: {},
}));
const Profile = () => {
  useEffect(() => {
    getRequest(`Users/${localStorage.getItem("userId")}`);
  });
  const classes = useStyles();
  return <div className={classes.root}>Profile</div>;
};

export default Profile;
