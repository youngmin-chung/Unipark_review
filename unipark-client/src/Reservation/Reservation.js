import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import * as axios from "axios";
import { useHistory } from "react-router-dom";

import ImageModal from "../Modal/ImageModal";

import {
  BASE_URL_PARKINGLOTS,
  BASE_URL_USER_PAYMENTCARD,
  BASE_URL_RESERVATION
} from "../constants";
import PaymentConfirm from "./PaymentConfirm";
import ParkingLotDetail from "./ParkingLotDetail";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["ParkingLot Detail", "Confirm"];

const Reservation = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const token = JSON.parse(localStorage.getItem("token"));
  const [activeStep, setActiveStep] = useState(0);
  const [currentParkingLotId, setCurrentParkingLotId] = useState(0);
  const [parkingLotData, setParkingLotData] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  //fetching Data
  useEffect(() => {
    setCurrentParkingLotId(props.match.params.parkingId);
    fetchParkingLot();
    fetchPaymentCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchParkingLot = () => {
    axios
      .get(BASE_URL_PARKINGLOTS + props.match.params.parkingId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setParkingLotData(response.data);
        console.log(JSON.stringify(response.data));
        setPhotoData(response.data.photos);
        console.log(JSON.stringify(response.data.photos));
        setPriceData(response.data.price);
      });
  };

  const fetchPaymentCard = () => {
    axios
      .get(BASE_URL_USER_PAYMENTCARD, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setPaymentData(response.data);
        console.log(response.data);
      });
  };

  // This function execute on the InformationForm page
  const handleNext = (values) => {
    console.log(activeStep);
    setActiveStep(activeStep + 1);
    console.log("Hit " + JSON.stringify(values))
    setReservationData(values);
  };

  const handleBackToHome = () => {
    history.push("/home");
  };

  const handleReservation = () => {
    axios
      .post(BASE_URL_RESERVATION + currentParkingLotId, reservationData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`create reservation!`);
        console.log(response);

      });

      history.push("/home")
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        console.log("Reservation: " + parkingLotData);
        return (
          <ParkingLotDetail
            parkingLotdata={parkingLotData}
            photoData={photoData}
            passUpdatedReservation={handleNext}
            setSelectedImage={setSelectedImage}
            priceData={priceData}
            reservationData={reservationData}
          />
        );
      case 1:
        return <PaymentConfirm 
                paymentData={paymentData}
                reservationData={reservationData}
                />;
      default:
        throw new Error("Unknown step");
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Reservation
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Your reservation has been created!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => history.push("/home")}
                  className={classes.button}
                >
                  Back to Home
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button 
                        onClick={handleReservation}
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                      Reservation
                    </Button>
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        {selectedImage && (
          <ImageModal
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default Reservation;
