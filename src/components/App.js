import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AssistantIcon from "@material-ui/icons/Assistant";
import Backdrop from "@material-ui/core/Backdrop";
import { Fade } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Iframe from "react-iframe";
import style from "../common/style";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Tickets from "./Tickets";
import TicketDetails from "./TicketDetails";
import SweetAlert from "sweetalert2-react";
import Profile from "./Profile";

const drawerWidthVal = 280;

const styleIframe = {
  border: "1px solid red",
  padding: 0,
  margin: 0,
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    width: "100%",
    padding: "15px 15px",
  },
  appBar: {
    background: style.primary,
    boxShadow: "none",
    borderBottom: "1px solid white !important",
    height: "70px",
    display: "flex",
    justifyContent: "center",
  },
  hide: {
    display: "none",
  },
  drawer: {
    flexShrink: 0,
    width: drawerWidthVal,
  },

  drawerPaper: {
    width: drawerWidthVal,
    background: style.primary,
    marginTop: "70px",
    paddingTop: "50px",
  },
  content: {
    flexGrow: 1,
  },
  chatBtn: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    cursor: "pointer",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  },
  modalTop: {
    width: "100%",
    borderBottom: "1px solid rgba(1,1,1,0.1)",
    background: "white",
    paddingRight: "10px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    fontSize: "1.4em",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    border: "none",
    padding: "20px 20px",
    background: "white",
  },
  modalBtnClose: {
    marginLeft: "auto",
    width: "20px",
    fontSize: "1.8em",
    cursor: "pointer",
  },
  router: {
    paddingTop: "65px",
    width: "100%",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "2em",
    letterSpacing: "1.5px",
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
    console.log(
      `https://healthaidbot.azurewebsites.net/?userId=${localStorage.getItem(
        "userId"
      )}`
    );
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [isOpenAlert, setIsOpenAlert] = React.useState(false);
  function alertHandler(val) {
    setIsOpenAlert(val);
  }

  return (
    <Router>
      <div className={classes.root}>
        <div className={classes.sweetAlert}>
          <div>
            <SweetAlert
              show={isOpenAlert}
              title="Ticket already opened"
              text="Please close the ongoing ticket to raise a new one"
              onConfirm={() => alertHandler(false)}
            />
          </div>
        </div>

        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Header />
          </Toolbar>
        </AppBar>

        <Drawer
          className={`${classes.drawer}`}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <Sidebar />
        </Drawer>

        <div className={classes.router}>
          <Route
            exact
            path="/stats"
            render={(props) => {
              return <Stats />;
            }}
          />
          <Route
            exact
            path="/profile"
            render={(props) => {
              return <Profile />;
            }}
          />
          <Route
            exact
            path="/tickets"
            render={(props) => {
              return (
                <Tickets
                  handleOpenModal={handleOpenModal}
                  alertHandler={alertHandler}
                />
              );
            }}
          />
          <Route
            path="/tickets/details/"
            render={(props) => {
              return <TicketDetails />;
            }}
          />

          <Route
            exact
            path="/"
            render={(props) => {
              return <Redirect to="/profile" />;
            }}
          />
        </div>

        <div className={classes.drawerHeader} />

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 400,
          }}
          disableBackdropClick={true}
        >
          <Fade in={openModal}>
            <div className={classes.paper}>
              <div id="transition-modal-description">
                <div className={classes.modalTop}>
                  <div>HealthAidBot</div>
                  <div
                    onClick={handleCloseModal}
                    className={classes.modalBtnClose}
                  >
                    &times;
                  </div>
                </div>
                <div className={classes.modalContent}>
                  <Iframe
                    style={styleIframe}
                    url={`http://healthaidbot.southindia.azurecontainer.io:8080/?userId=${localStorage.getItem(
                      "userId"
                    )}`}
                    width="650px"
                    height="550px"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    </Router>
  );
}
