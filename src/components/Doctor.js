import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { getRequest, postRequest } from "../common/api.js";
import style from "../common/style";
import { splitString } from "../common/helper";
import Preloader from "./Preloader";
import AddIcon from "@material-ui/icons/ControlPoint";

const styleAddIcon = {
  position: "absolute",
  top: "10px",
  right: "150px",
  fill: style.secondary,
  cursor: "pointer",
};

const styleDropdown = {
  marginBottom: "20px",
};

const styleForm = {
  position: "relative",
  border: "1px solid red",
};

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    padding: "0",
    margin: "0",
    boxSizing: "border-box",

    "& td": {
      // border: "1px solid blue",
      height: "35px",
      textAlign: "left",
      width: "250px",
      borderBottom: "1px solid rgba(1,1,1,0.1)",
    },
    "& th": {
      textAlign: "left",
      height: "50px",
      // border: "1px solid red",
    },
  },
  topBar: {
    width: "100%",
    height: "150px",
    background: style.primary,
    display: "flex",
    color: "white",
  },
  left: {
    width: "40%",
  },
  topLeftTop: {
    height: "50px",
    lineHeight: "50px",
    fontSize: "1.8em",
    paddingTop: "13px",
  },
  topLeftBottom: {
    display: "flex",
    alignItems: "flex-end",
    marginTop: "auto",
    height: "100px",
  },
  btnReport: {
    border: "none",
    width: "120px",
    height: "40px",
    marginRight: "1px",
    cursor: "pointer",
    background: "transparent",
    color: "white",
    border: "1px solid white",
  },
  btnPresc: {
    border: "none",
    width: "120px",
    height: "40px",
    cursor: "pointer",
    background: "#0c69cf",
    color: "white",
  },
  right: {
    paddingTop: "20px",
    width: "60%",
    padding: "10px 10px",
  },
  logo: {
    textAlign: "center",
    paddingLeft: "50px",
  },
  main: {
    padding: "30px 30px",
  },
  rightDiv: {
    marginBottom: "10px",
  },
  rightDivField: {
    display: "inline-block",
    width: "100px",
  },
  respField: {
    display: "inline-block",
  },
  respFieldHeader: {
    paddingBottom: "10px",
    fontWeight: "bold",
  },
  reportSec: {
    marginBottom: "30px",
  },
  fieldCont: {
    padding: "5px 0",
  },
  input: {
    padding: "0px 10px",
    height: "40px",
    width: "300px",
    marginRight: "20px",
    border: "1px solid rgba(1,1,1,0.4)",
    marginBottom: "20px",
  },
  trow: {
    width: "200px",
    textAlign: "center",
  },
  tabValue: {
    align: "right",
  },
  buttons: {
    padding: "10px 0",
  },
  apptBtn: {
    background: style.secondary,
    border: "none",
    color: "white",
    width: "250px",
    height: "40px",
    marginRight: "10px",
    cursor: "pointer",
  },
  orBox: {
    padding: "20px 0",
    // border: "1px solid red",
  },
  dropdown: {
    marginBottom: "20px",
  },
  btnSubmit: {
    background: style.primary,
    color: "white",
    height: "40px",
    width: "100px",
    border: "none",
  },
}));

const Doctor = () => {
  const classes = useStyles();
  const [user, setUser] = React.useState({
    name: "Atif Hossain",
    age: "21",
    gender: "Male",
  });

  const [areaStats, setAreaStats] = React.useState({ percent: {}, count: {} });
  const [payload, setPayload] = useState({
    symptoms: {
      fever: {
        feverTemp: "",
        feverType: "",
      },
      gi: {
        vomit: true,
        diarhhea: true,
        abdomenPain: true,
      },
      bodyPain: {
        bodyPainType: "",
        headache: true,
      },
      respDis: {
        cough: "",
        lossSmell: true,
        soreThroat: true,
        shortnessBreath: true,
        runnyNose: true,
        noseBlock: true,
      },
      days: 0,
      ui: true,
      allergy: 0,
      medicRelief: true,
      covidConnect: true,
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [screen, setScreen] = React.useState("report");
  const [presc, setPresc] = React.useState({
    count: 1,
    data: [{ medicine: `medicine_1`, dosage: `dosage_1` }],
  });

  const [ticketId, setTicketId] = React.useState("");
  const [formData, setFormData] = React.useState([]);
  const [feedbackData, setFeedbackData] = React.useState({});

  function updatePrescForm() {
    let newCount = presc.count + 1;
    let newArray = presc.data;
    newArray.push({
      medicine: `medicine_${newCount}`,
      dosage: `dosage_${newCount}`,
    });
    let newData = {
      count: presc.count + 1,
      data: newArray,
    };

    console.log(newData);
    setPresc(newData);
  }

  function switchScreen(screen) {
    if (screen === "report") {
      setScreen("report");
    } else {
      setScreen("presc");
    }
  }

  function bool(a) {
    if (a == 1) return "Yes";
    else if (a == 0) return "No";
    else return "None";
  }

  function formChangeHandler(e) {
    let newData = { ...formData };
    newData[e.target.name] = e.target.value;
    setFormData(newData);
  }

  function appointmentSubmitHandler(type) {
    postRequest("Appointment/change", {
      ticket_id: parseInt(ticketId),
      type: type,
      date: "21 Sept",
      time_slot: "2PM-5PM",
    })
      .then((resp) => {
        onSubmitResponse();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSubmitResponse() {
    getRequest(`Tickets/${ticketId}`).then((resp2) => {
      let respData = resp2.data;
      let data = resp2.data.symptoms.symptoms;
      let feverTemp;
      let feverType;
      let bodyPainType;
      let coughType;

      switch (data.fever_temp) {
        case 0:
          feverTemp = "Not Measured";
          break;
        case 1:
          feverTemp = "Mild (98F to 100F)";
          break;
        case 2:
          feverTemp = "Moderate (100F to 102F)";
          break;
        case 3:
          feverTemp = "High (Above 102F)";
        default:
          feverType = "None";
          break;
      }

      switch (data.fever_type) {
        case 0:
          feverType = "Continous";
          break;
        case 1:
          feverType = "With Chills";
          break;
        case 2:
          feverType = "Increase at night";
        default:
          feverType = "None";
          break;
      }

      switch (data.body_pain_type) {
        case 0:
          bodyPainType = "Weakness and fatigue";
          break;
        case 1:
          bodyPainType = "Joint pain & Lower back pain";
          break;
        case 2:
          bodyPainType = "Chestpain";
          break;
        case 3:
          bodyPainType = "Stiffness & Swells";
        default:
          bodyPainType = "None";
          break;
      }

      switch (data.cough) {
        case 0:
          coughType = "Dry Cough";
          break;
        case 1:
          coughType = "Sore Throat";
          break;
        case 2:
          coughType = "Wet cough with sputtum";
          break;
        default:
          coughType = "None";
          break;
      }

      let hasPresc = true;
      if (respData.prescription) {
        hasPresc = true;
      } else {
        hasPresc = false;
      }

      let stateData = {
        covidClass: respData.covid_class,
        hasPresc,
        symptoms: {
          days: data.days_since_onset,
          ui: bool(data.ui),
          allergy: bool(data.allergy),
          feverBool: bool(data.fever),
          covidConnect: bool(data.covid_connect),
          fever: {
            feverType,
            feverTemp,
          },
          gi: {
            vomit: bool(data.vomit),
            diarrhea: bool(data.diarrhea),
            abdominalPain: bool(data.abdominal_pain),
          },
          bodyPain: {
            bodyPainType,
            headache: bool(data.headache),
          },
          respDis: {
            cough: coughType,
            lossOfSmell: bool(data["loss_of_smell_taste"]),
            soreThroat: bool(data.sore_throat),
            runnyNose: bool(data.runny_nose),
            noseBlock: bool(data["nose_block"]),
            shortnessBreath: bool(data["shortness_of_breath"]),
          },
        },
      };
      console.log(stateData);
      setPayload(stateData);
    });
  }

  function formSubmitHandler(e) {
    e.preventDefault();
    let actualData = [];

    for (let key in formData) {
      let splitt = key.split("_");
      if (splitt[0] == "medicine") {
        actualData.push({
          name: formData[key],
          dosage: formData[`dosage_${splitt[1]}`],
        });
      }
    }

    let ticketClose = true;
    if (payload.covidClass === "Medium") {
      ticketClose = false;
    } else if (payload.covidClass === "Low") {
      ticketClose = true;
    }

    let feedbackData = {
      ticket_id: ticketId,
      feedback: feedbackData.feedback,
      monitoring_days: feedbackData.monitoring_days,
      ticket_close: ticketClose,
    };

    console.log(actualData);
    let postData = {
      ticket_id: ticketId,
      prescription: actualData,
    };
    postRequest("Prescription/add", postData)
      .then((resp) => {
        console.log("prescription submited");

        postRequest("Tickets/feedback")
          .then((resp) => {
            console.log("feedback submitted");
            onSubmitResponse();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onSelectDays(e) {
    console.log(e);
    setFeedbackData(e);
  }

  function onSelectFeedback(e) {
    console.log(e);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    let userId = url.searchParams.get("userId"); // => 'hello'

    getRequest(`Users/${userId}`)
      .then((resp) => {
        setUser(resp.data);
        let ticketId = resp.data.active_ticket.ticket_id;
        setTicketId(ticketId);
        getRequest(`Tickets/${ticketId}`).then((resp2) => {
          let respData = resp2.data;
          let data = resp2.data.symptoms.symptoms;

          let feverTemp;
          let feverType;
          let bodyPainType;
          let coughType;

          switch (data.fever_temp) {
            case 0:
              feverTemp = "Not Measured";
              break;
            case 1:
              feverTemp = "Mild (98F to 100F)";
              break;
            case 2:
              feverTemp = "Moderate (100F to 102F)";
              break;
            case 3:
              feverTemp = "High (Above 102F)";
            default:
              feverType = "None";
              break;
          }

          switch (data.fever_type) {
            case 0:
              feverType = "Continous";
              break;
            case 1:
              feverType = "With Chills";
              break;
            case 2:
              feverType = "Increase at night";
            default:
              feverType = "None";
              break;
          }

          switch (data.body_pain_type) {
            case 0:
              bodyPainType = "Weakness and fatigue";
              break;
            case 1:
              bodyPainType = "Joint pain & Lower back pain";
              break;
            case 2:
              bodyPainType = "Chestpain";
              break;
            case 3:
              bodyPainType = "Stiffness & Swells";
            default:
              bodyPainType = "None";
              break;
          }

          switch (data.cough) {
            case 0:
              coughType = "Dry Cough";
              break;
            case 1:
              coughType = "Sore Throat";
              break;
            case 2:
              coughType = "Wet cough with sputtum";
              break;
            default:
              coughType = "None";
              break;
          }

          let hasPresc = true;
          if (respData.prescription) {
            hasPresc = true;
          } else {
            hasPresc = false;
          }

          let stateData = {
            covidClass: respData.covid_class,
            hasPresc,
            ticketStatus: respData.ticket_status,
            symptoms: {
              days: data.days_since_onset,
              ui: bool(data.ui),
              allergy: bool(data.allergy),
              feverBool: bool(data.fever),
              covidConnect: bool(data.covid_connect),
              fever: {
                feverType,
                feverTemp,
              },
              gi: {
                vomit: bool(data.vomit),
                diarrhea: bool(data.diarrhea),
                abdominalPain: bool(data.abdominal_pain),
              },
              bodyPain: {
                bodyPainType,
                headache: bool(data.headache),
              },
              respDis: {
                cough: coughType,
                lossOfSmell: bool(data["loss_of_smell_taste"]),
                soreThroat: bool(data.sore_throat),
                runnyNose: bool(data.runny_nose),
                noseBlock: bool(data["nose_block"]),
                shortnessBreath: bool(data["shortness_of_breath"]),
              },
            },
          };
          console.log(stateData);
          setPayload(stateData);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    let userId = localStorage.getItem("userId");
    getRequest(`Users/area/stats/${userId}`).then((resp) => {
      setAreaStats(resp.data.area_stats);
      console.log(resp.data.area_stats);
    });
  }, []);

  return (
    <div className={classes.root}>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <div className={classes.topBar}>
            <div className={classes.left}>
              <div className={classes.topLeftTop}>
                <div className={classes.logo}>HealthAid</div>
              </div>
              <div className={classes.topLeftBottom}>
                <button
                  className={`${classes.btnReport}`}
                  onClick={() => {
                    switchScreen("report");
                  }}
                >
                  Report
                </button>
                <button
                  className={classes.btnReport}
                  onClick={() => {
                    switchScreen("presc");
                  }}
                >
                  Prescription
                </button>
              </div>
            </div>
            <div className={classes.right}>
              <div className={classes.rightDiv}>
                <span className={classes.rightDivField}>Name</span>
                {user.name}
              </div>
              <div className={classes.rightDiv}>
                <span className={classes.rightDivField}>Age</span>
                {user.age}
              </div>
              <div className={classes.rightDiv}>
                <span className={classes.rightDivField}>Gender</span>
                {user.gender}
              </div>
            </div>
          </div>
          <div className={classes.main}>
            {screen === "report" ? (
              <div className={classes.reportRoot}>
                <div className={classes.reportSec}>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>
                      No of days since onset of symptomps-
                    </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.days}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>Allergy- </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.allergy}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>
                      Urinary Infection{" "}
                    </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.ui}
                    </span>
                  </div>
                </div>
                <div className={classes.reportSec}>
                  <span
                    className={`${classes.respField} ${classes.respFieldHeader}`}
                  >
                    Fever -
                  </span>
                  <span> {payload.symptoms.feverBool}</span>
                  {payload.symptoms.feverBool === "Yes" ? (
                    <div className={classes.reportSec}>
                      <div className={classes.fieldCont}>
                        <span className={classes.respField}>Fever Temp - </span>
                        <span className={classes.respValue}>
                          {payload.symptoms.fever.feverTemp}
                        </span>
                      </div>
                      <div className={classes.fieldCont}>
                        <span className={classes.respField}>Fever Type - </span>
                        <span className={classes.respValue}>
                          {payload.symptoms.fever.feverType}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className={classes.reportSec}>
                  <div
                    className={`${classes.respField} ${classes.respFieldHeader}`}
                  >
                    Gastrointestinal (GI) symptoms
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Vomit - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.gi.vomit}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Diarrhea - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.gi.diarrhea}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Abdominal Pain - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.gi.abdominalPain}
                    </span>
                  </div>
                </div>

                <div className={classes.reportSec}>
                  <div
                    className={`${classes.respField} ${classes.respFieldHeader}`}
                  >
                    Body Pain
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Body Pain Type - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.bodyPain.bodyPainType}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Headache - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.bodyPain.headache}
                    </span>
                  </div>
                </div>

                <div className={classes.reportSec}>
                  <div
                    className={`${classes.respField} ${classes.respFieldHeader}`}
                  >
                    Respiratory Disorder
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Cough - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.respDis.cough}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>
                      Loss of smell and taste -
                    </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.respDis.lossOfSmell}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Sore Throat - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.respDis.soreThroat}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Runny Nose - </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.respDis.runnyNose}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>
                      Shortnes of breath -
                    </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.respDis.soreThroat}
                    </span>
                  </div>
                </div>

                <div className={classes.reportSec}>
                  <div className={classes.fieldCont}>
                    <span
                      className={`${classes.respField} ${classes.respFieldHeader}`}
                    >
                      Recent Covid Interactions -
                    </span>
                    <span className={classes.respValue}>
                      {payload.symptoms.covidConnect}
                    </span>
                  </div>
                </div>

                <div className={classes.reportSec}>
                  <div className={classes.respFieldHeader}>Area Stats</div>
                  <table>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                    {Object.entries(areaStats.percent).map((item) => {
                      return (
                        <tr className={classes.trow}>
                          <td>{splitString(item[0])}</td>
                          <td align="right" className={classes.tabValue}>
                            {item[1]}
                          </td>
                        </tr>
                      );
                    })}
                    {Object.entries(areaStats.count).map((item) => {
                      return (
                        <tr className={classes.trow}>
                          <td>{splitString(item[0])}</td>
                          <td align="right" className={classes.tabValue}>
                            {item[1]}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <form
                  style={styleForm}
                  onChange={formChangeHandler}
                  onSubmit={formSubmitHandler}
                >
                  <AddIcon
                    style={styleAddIcon}
                    onClick={updatePrescForm}
                    fontSize="large"
                  />
                  {payload.ticketStatus === "closed" ? (
                    <div>This ticket has already closed</div>
                  ) : (
                    <>
                      {!payload.hasPresc ? (
                        <>
                          <>
                            {payload.covidClass === "Medium" ? (
                              <>
                                <div className={classes.buttons}>
                                  <button
                                    onClick={() => {
                                      appointmentSubmitHandler("covid");
                                    }}
                                    className={classes.apptBtn}
                                  >
                                    Recommend Covid Test
                                  </button>
                                  <button
                                    onClick={() => {
                                      appointmentSubmitHandler("offline");
                                    }}
                                    className={classes.apptBtn}
                                  >
                                    Recommend Offline consultation
                                  </button>
                                </div>
                                <div className={classes.orBox}>
                                  Or Prescrbe medicine
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                          {presc.data.map((item, i) => {
                            return (
                              <div className={classes.row}>
                                <input
                                  className={classes.input}
                                  type="text"
                                  name={`medicine_${i}`}
                                  placeholder="Medicine"
                                ></input>
                                <input
                                  className={classes.input}
                                  type="text"
                                  name={`dosage_${i}`}
                                  placeholder="Dosage"
                                ></input>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div>Already Prescrbibed</div>
                      )}
                    </>
                  )}

                  <Dropdown
                    className={classes.dropdown}
                    options={[
                      { value: 3, label: "3" },
                      { value: 5, label: "5" },
                    ]}
                    onChange={onSelectDays}
                    // value={"Material"}
                    placeholder="Number of days to monitor patient"
                  />
                  <Dropdown
                    className={classes.dropdown}
                    options={[
                      { value: "malerial", label: "Malerial" },
                      { value: "bacterial", label: "Bacterial" },
                      { value: "viral", label: "Viral" },
                    ]}
                    onChange={onSelectFeedback}
                    // value={"Material"}
                    placeholder="Type of illness"
                  />

                  <button className={classes.btnSubmit}>Submit</button>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Doctor;
