import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { getRequest, postRequest } from "../common/api.js";
import style from "../common/style";
import Preloader from "./Preloader";
import AddIcon from "@material-ui/icons/ControlPoint";

const styleAddIcon = {
  position: "absolute",
  top: "190px",
  right: "160px",
  fill: style.secondary,
  cursor: "pointer",
};

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    padding: "0",
    margin: "0",
    boxSizing: "border-box",
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
}));

const Doctor = () => {
  const classes = useStyles();
  const [user, setUser] = React.useState({
    name: "Atif Hossain",
    age: "21",
    gender: "Male",
  });

  const [payload, setPayload] = useState({
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
  });
  const [loading, setLoading] = React.useState(false);
  const [screen, setScreen] = React.useState("report");

  const [presc, setPresc] = React.useState({
    count: 1,
    data: [{ medicine: `medicine_1`, dosage: `dosage_1` }],
  });

  const [ticketId, setTicketId] = React.useState("");

  const [formData, setFormData] = React.useState([]);

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

  // medicine_1 : "asas" , dosage_1:assa , medicine_2:asas, dosage_2:'as'

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

    console.log(actualData);

    let postData = {
      ticket_id: ticketId,
      prescription: actualData,
    };

    postRequest("Prescription/add", postData)
      .then((resp) => {
        console.log("prescription submited");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    let userId = url.searchParams.get("userId"); // => 'hello'

    getRequest(`Users/${userId}`)
      .then((resp) => {
        setUser(resp.data);
        let ticketId = resp.data.active_ticket.ticket_id;
        setTicketId(ticketId);
        getRequest(`Tickets/symptoms/${ticketId}`).then((resp2) => {
          let data = resp2.data.symptoms.symptoms_info;
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

          console.log(typeof data.sore_throat);

          let stateData = {
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
          };
          console.log(stateData);
          setPayload(stateData);
        });
      })
      .finally(() => {
        setLoading(false);
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
                <div class={classes.reportSec}>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>
                      No of days since onset of symptomps-
                    </span>
                    <span className={classes.respValue}>{payload.days}</span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>Allergy- </span>
                    <span className={classes.respValue}>{payload.allergy}</span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respFieldHeader}>
                      Urinary Infection{" "}
                    </span>
                    <span className={classes.respValue}>{payload.ui}</span>
                  </div>
                </div>
                <div className={classes.reportSec}>
                  <span
                    className={`${classes.respField} ${classes.respFieldHeader}`}
                  >
                    Fever -
                  </span>
                  <span> {payload.feverBool}</span>
                  {payload.feverBool === "Yes" ? (
                    <div class={classes.reportSec}>
                      <div className={classes.fieldCont}>
                        <span className={classes.respField}>Fever Temp - </span>
                        <span className={classes.respValue}>
                          {payload.fever.feverTemp}
                        </span>
                      </div>
                      <div className={classes.fieldCont}>
                        <span className={classes.respField}>Fever Type - </span>
                        <span className={classes.respValue}>
                          {payload.fever.feverType}
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
                      {payload.gi.vomit}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Diarrhea - </span>
                    <span className={classes.respValue}>
                      {payload.gi.diarrhea}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Abdominal Pain - </span>
                    <span className={classes.respValue}>
                      {payload.gi.abdominalPain}
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
                      {payload.bodyPain.bodyPainType}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Headache - </span>
                    <span className={classes.respValue}>
                      {payload.bodyPain.headache}
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
                      {payload.respDis.cough}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>
                      Loss of smell and taste -
                    </span>
                    <span className={classes.respValue}>
                      {payload.respDis.lossOfSmell}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Sore Throat - </span>
                    <span className={classes.respValue}>
                      {payload.respDis.soreThroat}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Runny Nose - </span>
                    <span className={classes.respValue}>
                      {payload.respDis.runnyNose}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>
                      Shortnes of breath -
                    </span>
                    <span className={classes.respValue}>
                      {payload.respDis.soreThroat}
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
                      {payload.covidConnect}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <AddIcon
                  style={styleAddIcon}
                  onClick={updatePrescForm}
                  fontSize="large"
                />
                <form onChange={formChangeHandler} onSubmit={formSubmitHandler}>
                  {/*//////////////////////////////////////////////////////////////////////////////////////////////////*/}
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

                  <button>Submit</button>
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
