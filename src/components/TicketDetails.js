import React, { useEffect, useState } from "react";
import { makeStyles, emphasize } from "@material-ui/core/styles";
import { getRequest } from "../common/api.js";

const useStyles = makeStyles(() => ({
  root: { paddingLeft: "10px" },
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
  secHeader: {
    fontWeight: "bold",
    fontSize: "2em",
    marginBottom: "20px",
  },
  secCont: {
    borderBottom: "1px solid rgba(1,1,1,0.1)",
    padding: "20px 0",
  },
  medCont: {
    display: "flex",
  },
  medName: {
    width: "100px",
  },
  medDose: {
    width: "100px",
    paddingLeft: "10px",
  },
}));

const TicketDetails = () => {
  const [ticket, setTicket] = useState({
    presc: [],
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
  const classes = useStyles();

  useEffect(() => {
    const url = new URL(window.location.href);
    let ticketId = url.href.split("/")[url.href.split("/").length - 1];
    console.log(ticketId);

    getRequest(`Tickets/${ticketId}`).then((resp) => {
      let data = resp.data.symptoms.symptoms;
      let respData = resp.data;
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

      function bool(a) {
        if (a == 1) return "Yes";
        else if (a == 0) return "No";
        else return "None";
      }

      let stateData = {
        hasPresc: respData.has_prescription,
        presc: respData.prescription,
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

      setTicket(stateData);
      console.log(stateData);
    });
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.secCont}>
        <div className={classes.secHeader}>Doctor Prescription</div>
        <div className={classes.secContent}>
          {ticket.hasPresc ? (
            <div>
              {ticket.presc.map((item) => {
                return (
                  <div className={classes.medCont}>
                    <div className={classes.medName}>{item.name}</div>
                    <div className={classes.medDose}>{item.dosage}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <em>Waiting for remote doctor to prescribe medicines</em>
            </div>
          )}
        </div>
      </div>
      <div className={classes.secCont}>
        <div className={classes.secHeader}>Report</div>
        <div className={classes.secContent}>
          <div className={classes.reportRoot}>
            <div className={classes.reportSec}>
              <div className={classes.fieldCont}>
                <span className={classes.respFieldHeader}>
                  No of days since onset of symptomps-
                </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.days}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respFieldHeader}>Allergy- </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.allergy}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respFieldHeader}>
                  Urinary Infection{" "}
                </span>
                <span className={classes.respValue}>{ticket.symptoms.ui}</span>
              </div>
            </div>
            <div className={classes.reportSec}>
              <span
                className={`${classes.respField} ${classes.respFieldHeader}`}
              >
                Fever -
              </span>
              <span> {ticket.symptoms.feverBool}</span>
              {ticket.symptoms.feverBool === "Yes" ? (
                <div className={classes.reportSec}>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Fever Temp - </span>
                    <span className={classes.respValue}>
                      {ticket.symptoms.fever.feverTemp}
                    </span>
                  </div>
                  <div className={classes.fieldCont}>
                    <span className={classes.respField}>Fever Type - </span>
                    <span className={classes.respValue}>
                      {ticket.symptoms.fever.feverType}
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
                  {ticket.symptoms.gi.vomit}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Diarrhea - </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.gi.diarrhea}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Abdominal Pain - </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.gi.abdominalPain}
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
                  {ticket.symptoms.bodyPain.bodyPainType}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Headache - </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.bodyPain.headache}
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
                  {ticket.symptoms.respDis.cough}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>
                  Loss of smell and taste -
                </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.respDis.lossOfSmell}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Sore Throat - </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.respDis.soreThroat}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Runny Nose - </span>
                <span className={classes.respValue}>
                  {ticket.symptoms.respDis.runnyNose}
                </span>
              </div>
              <div className={classes.fieldCont}>
                <span className={classes.respField}>Shortnes of breath -</span>
                <span className={classes.respValue}>
                  {ticket.symptoms.respDis.soreThroat}
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
                  {ticket.symptoms.covidConnect}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
