import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getRequest, postRequest } from "../common/api";

import Backdrop from "@material-ui/core/Backdrop";
import { Fade } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { useHistory } from "react-router-dom";
import style from "../common/style";

import { splitString } from "../common/helper.js";
import Preloader from "./Preloader";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "15px",
  },
  ticketCard: {
    width: "80%",
    height: "100px",
    border: style.secondary,
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    background: "rgba(1,1,1,0.1)",
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  cardLeft: {
    width: "50%",
    padding: "0 20px",
  },
  cardRight: {
    padding: "0 20px",
    width: "50%",
    display: "flex",
  },
  btnCard: {
    display: "block",
    marginRight: "5px",
    width: "150px",
    height: "40px",
    background: style.secondary,
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
    "&:hover": {
      opacity: "0.5",
    },
  },
  btnDoctor: {
    width: "200px !important",
  },

  btnClosed: {
    background: "rgba(1,1,1,0.2)",
    width: "100px",
    lineHeight: "40px",
    height: "40px",
    padding: "0 5px",
    textAlign: "center",
    borderRadius: "5px",
    marginRight: "5px",
    "&:hover": {
      opacity: "0.5",
    },
  },
  covidClass_High: {
    color: "red",
    fontWeight: "bold",
  },
  covidClass_Medium: {
    color: "orange",
    fontWeight: "bold",
  },
  covidClass_Low: {
    color: "green",
    fontWeight: "bold",
  },
  field: {
    display: "inline-block",
    width: "100px",
    fontSize: "1.1em",
    fontWeight: "medium",
  },
  addIcon: {
    position: "absolute",
    top: "110px",
    right: "70px",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  addTicketText: {
    paddingBottom: "15px",
    fontSize: "1.5em",
    cursor: "pointer",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    width: "100%",
    border: "none",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    border: "none",
    padding: "5px 20px",
    background: "white",
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
  modalBtnClose: {
    marginLeft: "auto",
    width: "20px",
    fontSize: "2em",
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    marginLeft: "auto",
  },
  addIconButton: {
    background: style.primary,
    color: "white",
    border: "none",
    height: "35px",
    width: "100px",
    "&:hover": {
      opacity: "0.5",
    },
  },

  cardGreen: {
    background: "white",
    border: "1px solid rgba(1,1,1,0.2)",
  },

  apptSec: {
    padding: "5px 0",
  },

  apptField: {
    paddingRight: "10px",
    fontSize: "1.1em",
    display: "block",
  },
}));

const Tickets = (props) => {
  const classes = useStyles();
  const [ticket, setTicket] = useState([]);
  const [ticketClicked, setTicketClicked] = React.useState(0);

  const [loading, setLoading] = React.useState(true);

  const [ticketModal, setTicketModal] = React.useState({
    appointment: {},
  });

  const [openModal, setOpenModal] = React.useState();
  const [isOpenAddText, setIsOpenAddText] = useState(false);

  function handleOpenModalAppt() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  let history = useHistory();
  function handleTicketClick(id) {
    history.push(`tickets/details/${id}`);
  }

  function handleApptClick(id) {
    setTicketClicked(id);
    getRequest(`Tickets/${id}`).then((resp) => {
      let data = resp.data;
      handleOpenModalAppt();
      let date = new Date(0);
      date.setUTCSeconds(data.created_at);

      let newTicketModal = {
        userId: data.user_id,
        status: data.ticket_status,
        timeCreated: [date.getDate(), date.getMonth(), date.getFullYear()],
        covidClass: data.covid_class,
        hasAppt: data.has_appointment,
        appointment: data.appointment,
        hasPresc: data.has_prescription,
        prescription: data.prescription,
        ticketId: data.ticket_id,
      };

      setTicketModal(newTicketModal);
      console.log(newTicketModal);
    });
  }

  function addClickHandler() {
    let userId = localStorage.getItem("userId");
    postRequest("Tickets/create", { user_id: parseInt(userId) })
      .then((resp) => {
        if (resp.data.message === "Already has a open ticket") {
          props.alertHandler(true);
        } else {
          props.handleOpenModal();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    postRequest("Tickets/history", {
      user_id: localStorage.getItem("userId"),
    })
      .then((resp) => {
        let stateData = [];
        resp.data["history"].forEach((data) => {
          let covidClass = "";
          if (data.covid_class) {
            covidClass = data.covid_class;
          } else {
            covidClass = "N/A (no consulation done)";
          }

          let date = new Date(0);
          date.setUTCSeconds(data.created_at);

          stateData.push({
            userId: data.user_id,
            status: data.ticket_status,
            timeCreated: [date.getDate(), date.getMonth(), date.getFullYear()],
            covidClass: covidClass,
            hasAppt: data.has_appointment,
            appointments: data.appointment,
            hasPresc: data.has_prescription,
            prescription: data.prescription,
            ticketId: data.ticket_id,
            appointmentType: data.appointment_type,
          });
        });
        setTicket(stateData);
        console.log(stateData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props]);

  return (
    <div className={classes.root}>
      {loading ? (
        <Preloader />
      ) : (
        <>
          {" "}
          <div className={classes.addIcon}>
            {isOpenAddText ? (
              <div className={classes.addTicketText}>Add a new ticket</div>
            ) : (
              <></>
            )}
            <button className={classes.addIconButton} onClick={addClickHandler}>
              Add Ticket
            </button>
          </div>
          <h2>View Ticket History</h2>
          {ticket.map((item) => {
            return (
              <div
                key={`${item.ticketId}_${item.classes}`}
                className={`${classes.ticketCard} ${
                  item.status === "closed" ? "" : classes.cardGreen
                }`}
                onClick={() => {
                  handleTicketClick(item.ticketId);
                }}
              >
                <div className={classes.cardLeft}>
                  <div className={`${classes.createdDate} ${classes.cardItem}`}>
                    <span className={classes.field}>Created On</span>
                    {item.timeCreated[0]}/{item.timeCreated[1] + 1}/
                    {item.timeCreated[2]}
                  </div>
                  <div className={`${classes.covidClass} ${classes.cardItem}`}>
                    <span className={classes.field}>Covid Risk</span>
                    <span className={classes[`covidClass_${item.covidClass}`]}>
                      {item.covidClass}
                    </span>
                  </div>
                </div>

                <div className={classes.cardRight}>
                  <div className={classes.buttons}>
                    {item.status === "open" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.handleOpenModal();
                        }}
                        className={`${classes.btnBot} ${classes.btnCard}`}
                      >
                        Consult Now
                      </button>
                    ) : item.status === "monitoring" ? (
                      <button
                        onClick={props.handleOpenModal}
                        className={`${classes.btnCard} ${classes.btnAppt}`}
                      >
                        Update Symptomps
                      </button>
                    ) : item.status === "consulting" ? (
                      <div
                        className={`${classes.btnClosed} ${classes.btnDoctor}`}
                      >
                        Awating Doctor Response
                      </div>
                    ) : item.status === "in-progress" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.handleOpenModal();
                        }}
                        className={`${classes.btnBot} ${classes.btnCard}`}
                      >
                        Consult Now
                      </button>
                    ) : (
                      <>
                        <div className={`${classes.btnClosed}`}>
                          View Details
                        </div>
                      </>
                    )}

                    {item.hasAppt ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApptClick(item.ticketId);
                        }}
                        className={`${classes.btnBot} ${classes.btnCard}`}
                      >
                        View Appointment
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              // </Link>
            );
          })}
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
                    <div>View Appointment</div>
                    <div
                      onClick={handleCloseModal}
                      className={classes.modalBtnClose}
                    >
                      &times;
                    </div>
                  </div>
                  <div className={classes.modalContent}>
                    {Object.entries(ticketModal.appointment).map((item) => {
                      return (
                        <div className={classes.apptSec}>
                          <span className={classes.apptField}>
                            <strong>{splitString(item[0])}</strong>
                          </span>
                          <span className={classes.apptValue}>
                            {splitString(item[1])}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Tickets;
