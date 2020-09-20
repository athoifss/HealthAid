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
import SweetAlert from "sweetalert2-react";

const drawerWidthVal = 280;

const styleIframe = {
  border: "1px solid red",
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
  modalContent: {
    display: "flex",
    flexDirection: "column",
    border: "none",
    padding: "5px 20px",
    background: "white",
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
  const [url, setUrl] = React.useState();

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
            exact
            path="/tickets/details"
            render={(props) => {
              return <TicketDetails />;
            }}
          />

          <Route
            exact
            path="/"
            render={(props) => {
              return <Redirect to="/tickets" />;
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
                <div className={classes.modalContent}>
                  <Iframe
                    style={styleIframe}
                    url={`https://healthaidbot.azurewebsites.net/?userId=${localStorage.getItem(
                      "userId"
                    )}`}
                    width="500px"
                    height="600px"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
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
