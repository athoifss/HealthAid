import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import TimelineIcon from "@material-ui/icons/Timeline";
import Divider from "@material-ui/core/Divider";
import AccountBoxIcon from "@material-ui/icons/PermIdentity";

import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: "none",
    "&:link": {
      color: "white",
    },
    "&:hover": {
      color: "white",
    },
    "&:visited": {
      color: "white",
    },
  },
}));
const Sidebar = () => {
  const classes = useStyles();
  return (
    <List>
      <Link className={classes.link} to="/profile">
        <ListItem button>
          <ListItemIcon>
            <AccountBoxIcon style={{ fill: "white" }} />
          </ListItemIcon>
          <ListItemText className={classes.textLink} primary={"Profile"} />
        </ListItem>
      </Link>
      <Divider style={{ backgroundColor: "white" }} />

      <Link className={classes.link} to="/tickets">
        <ListItem button>
          <ListItemIcon>
            <LocalHospitalIcon style={{ fill: "white" }} />
          </ListItemIcon>
          <ListItemText className={classes.textLink} primary={"Tickets"} />
        </ListItem>
      </Link>
      <Divider style={{ backgroundColor: "white" }} />
      <Link className={classes.link} to="/stats">
        <ListItem button>
          <ListItemIcon>
            <TimelineIcon style={{ fill: "white" }} />
          </ListItemIcon>
          <ListItemText primary={"Statistics"} />
        </ListItem>
      </Link>
      <Divider style={{ backgroundColor: "white" }} />
    </List>
  );
};

export default Sidebar;
