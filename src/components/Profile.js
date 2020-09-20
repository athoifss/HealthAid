import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getRequest } from "../common/api.js";

import style from "../common/style";

const useStyles = makeStyles(() => ({
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
    marginBottom: "20px",
  },
  profileSec: {
    display: "flex",
    padding: "10px 0",
  },
  field: {
    width: "150px",
  },
}));
const Profile = () => {
  const [user, setUser] = React.useState({});
  useEffect(() => {
    getRequest(`Users/${localStorage.getItem("userId")}`).then((resp) => {
      setUser(resp.data);
    });
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
        <div className={classes.profileSec}>
          <div className={classes.field}>Age</div>
          <div className={classes.value}>{user.age}</div>
        </div>
        <div className={classes.profileSec}>
          <div className={classes.field}>Gender</div>
          <div className={classes.value}>{user.gender}</div>
        </div>
      </div>

      <div className={classes.logout}>
        <button
          style={{
            marginTop: "20px",
            width: "200px",
            background: style.secondary,
            height: "40px",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
