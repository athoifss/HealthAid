import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getRequest, postRequest } from "../common/api";
import AddIcon from "@material-ui/icons/ControlPoint";

import Backdrop from "@material-ui/core/Backdrop";
import { Fade } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";

import style from "../common/style";
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
    transition: "all 0.3s",
    cursor: "pointer",
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
    marginLeft: "auto",
    width: "150px",
    height: "40px",
    background: style.secondary,
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  btnClosed: {
    background: "rgba(1,1,1,0.2)",
    display: "block",
    marginLeft: "auto",
    width: "150px",
    lineHeight: "40px",
    height: "40px",
    padding: "0 5px",
    textAlign: "center",
    borderRadius: "5px",
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
    bottom: "50px",
    right: "90px",
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
    // alignItems: "center",
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
  scale: {
    transform: "scale(1.05)",
  },
}));

// appt: data.appointment,
// apptType: data.appointmentType,
// feverClass: data.predicted_fever_class,

const Tickets = (props) => {
  const classes = useStyles();
  const [ticket, setTicket] = useState([]);

  const [ticketClicked, setTicketClicked] = React.useState(0);

  const [ticketModal, setTicketModal] = React.useState({
    appointment: {
      Message: "",
      Nearest_Covid_Center: "",
      Map_link: "",
      "Contact Number": "",
    },
  });

  const [openModal, setOpenModal] = React.useState();
  const [isOpenAddText, setIsOpenAddText] = useState(false);

  const [isHoverCard, setIsHoverCard] = React.useState(false);

  function handleOpenModalAppt() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleTicketClick(id) {
    setTicketClicked(id);
    getRequest(`Tickets/${id}`).then((resp) => {
      let data = resp.data;

      let newTicketModal = {
        userId: data.user_id,
        status: data.ticket_status,
        timeCreated: [
          new Date(data.created_at).getMonth(),
          new Date(data.created_at).getDate(),
          new Date(data.created_at).getFullYear(),
        ],
        covidClass: data.covid_class,
        hasAppt: data.has_appointment,
        appointment: data.appointment,
        hasPresc: data.has_prescription,
        prescription: data.prescription,
        ticketId: data.ticket_id,
      };

      setTicketModal(newTicketModal);
      console.log(newTicketModal);
      handleOpenModalAppt();
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
        let covidClass = "";
        if (resp.data["history"]["covid_class"]) {
          covidClass = resp.data["history"].covid_class;
        } else {
          covidClass = "N/A (no consulation done)";
        }
        resp.data["history"].forEach((data) => {
          stateData.push({
            userId: data.user_id,
            status: data.ticket_status,
            timeCreated: [
              new Date(data.created_at).getMonth(),
              new Date(data.created_at).getDate(),
              new Date(data.created_at).getFullYear(),
            ],
            covidClass: covidClass,
            hasAppt: data.has_appointment,
            appointments: data.appointment,
            hasPresc: data.has_prescription,
            prescription: data.prescription,
            ticketId: data.ticket_id,
          });
        });
        setTicket(stateData);
        console.log(stateData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props]);

  return (
    <div className={classes.root}>
      <div className={classes.addIcon}>
        {isOpenAddText ? (
          <div className={classes.addTicketText}>Add a new ticket</div>
        ) : (
          <></>
        )}
        <AddIcon
          onClick={addClickHandler}
          fontSize="large"
          onMouseEnter={() => setIsOpenAddText(true)}
          onMouseLeave={() => setIsOpenAddText(false)}
        />
      </div>
      {ticket.map((item) => {
        return (
          <div
            key={item.ticketId}
            className={`${classes.ticketCard} ${
              isHoverCard ? classes.scale : ""
            }`}
            onMouseEnter={() => setIsHoverCard(true)}
            onMouseLeave={() => setIsHoverCard(false)}
          >
            <div className={classes.cardLeft}>
              <div className={`${classes.createdDate} ${classes.cardItem}`}>
                <span className={classes.field}>Created On</span>
                {item.timeCreated[1]}/{item.timeCreated[0] + 1}/
                {item.timeCreated[2]}
              </div>
              <div className={`${classes.covidClass} ${classes.cardItem}`}>
                <span className={classes.field}>Covid Risk</span>
                <span className={classes[`covidClass_${item.covidClass}`]}>
                  {item.covidClass}
                </span>
              </div>
            </div>

            {
              // Open -> Inprogress -> Consulting -> [Monitoring] -> Closed
              // Open = Consult Now
              // In Progress = Consult Now -> Consulting ->
              // Monitoring = Update Symptomps
              // Consulting = Awaiting Doctor Response
              // Closed = Closed
            }
            <div className={classes.cardRight}>
              {item.status === "open" ? (
                <button
                  onClick={props.handleOpenModal}
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
              ) : item.status === "Consulting" ? (
                <div className={`${classes.btnClosed}`}>
                  Awating Doctor Response
                </div>
              ) : item.status === "in-progress" ? (
                <button
                  onClick={props.handleOpenModal}
                  className={`${classes.btnBot} ${classes.btnCard}`}
                >
                  Consult Now
                </button>
              ) : (
                <>
                  <div className={`${classes.btnClosed}`}>Closed</div>
                </>
              )}
              {item.hasAppt ? (
                <button
                  onClick={() => {
                    handleTicketClick(item.ticketId);
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
                <div>{ticketModal.appointment.Message}</div>
                <div>
                  Location : {ticketModal.appointment.Nearest_Covid_Center}
                </div>
                <div> Map: {ticketModal.appointment.Map_link}</div>
                <div>Contact: {ticketModal.appointment["Contact Number"]}</div>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Tickets;
