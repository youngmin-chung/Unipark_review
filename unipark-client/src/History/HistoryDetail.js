import React, { useReducer, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import "./History.css";
import { BASE_URL_RESERVATION, BASE_URL_USER_PAYMENTCARD } from "../constants";

let moment = require("moment-timezone");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  overview: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const HistoryDetail = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    },
  };

  const initialState = {
    showMsg: false,
    loggedIn: false,
    snackbarMsg: "",
    snackbarMsgType: "success",
    contactServer: false,
    reservation: [],
    reservedParkingLot: [],
    paymentCard:[],
    isLoading: false,
    userCurrentMode: 0,
    totalHours: 0,
    totalMinutes: 0
  };

  // Reducer basically takes the old 'state' and copy it into a newState.
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const token = JSON.parse(localStorage.getItem("token"));
  const [cardNum, setCardNum] = useState("");

  // It's running another sub method called fetchUsers()
  useEffect(() => {
    fetchReservation();
    fetchPaymentCard();
  }, []);

  const fetchReservation = async () => {
    console.log(config);
    setState({
      isLoading: true,
    });
    try {
      const res = await axios.get(
        BASE_URL_RESERVATION + props.match.params.reservationId,
        config
      );

      if (res !== null) {
        console.log(res);
        setState({
          loggedIn: true,
          reservation: res.data,
          reservedParkingLot: res.data.reservedParkingLot,
          isLoading: true,
          userCurrentMode: JSON.parse(localStorage.getItem("currentMode"))
        });
        console.log(
          "ReservedParkingLot:" + JSON.stringify(state.reservedParkingLot)
        );
      }
    } catch (err) {
      setState({
        snackbarMsgType: "error",
        snackbarMsg: "Failed to load data from the server",
        showMsg: true,
        isLoading: false,
      });
    }
  };

  const fetchPaymentCard = () => {
    axios
      .get(BASE_URL_USER_PAYMENTCARD, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setState({
          paymentCard: response.data
        })
        setCardNum(response.data.cardNumber.toString());
      });
  };
  
  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const calculateHoursMinutes = () => {
    // TO-DO: get hours and minutes from the total time
  }

  return (
    <div className="history">
      <AppBar position="static">
        <Toolbar>
          <Typography>Your History</Typography>
        </Toolbar>
      </AppBar>
      <div className="history_section">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card className="history_detail_card">
              <CardActionArea>
                {state.reservedParkingLot.photoUrl ? (
                  <CardMedia
                    className="history_detail_card_media"
                    image={state.reservedParkingLot.photoUrl}
                    title="PlaceHolder"
                  />
                ) : (
                  <CardMedia
                    className="history_detail_card_media"
                    image="http://placehold.it/250x350"
                    title="PlaceHolder"
                  />
                )}

                <CardContent>
                  <Typography variant="h5" component="h2">
                   {state.reservedParkingLot.title}
                  </Typography>
                  <div className={classes.buttons}>
                    <Card variant="outlined" className={classes.button}>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textSecondary"
                        component="h3"
                      >
                        Start Time
                      </Typography>
 
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textSecondary"
                        component="h3"
                      >
                        {moment(state.reservation.startTime).format("yyyy-MM-DD hh:mm")}
                      </Typography>
                    </Card>
                    <Card variant="outlined" className={classes.button}>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textSecondary"
                        component="h3"
                      >
                        End Time
                      </Typography>
                     
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="textSecondary"
                        component="h3"
                      >
                        {moment(state.reservation.endTime).format("yyyy-MM-DD hh:mm")}
                      </Typography>
                    </Card>
                  </div>
                  <Card variant="outlined" className={classes.overview}>
                    <Typography>Overview</Typography>
                    <div style={{ textAlign: "start" }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Address: {state.reservedParkingLot.address}, {state.reservedParkingLot.city}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Parking Time: {state.reservation.hoursMinutesOfReservation}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      > {state.userCurrentMode === 0 ? (
                        `Total Cost: \$${state.reservation.costPaid_Driver}`
                      ):(
                        `Total Income: \$${state.reservation.costEarned_Owner}`
                      )}
                        
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Payment Card: {"xxxx-xxxx-xxxx-"+ cardNum.substr(cardNum.length - 4)}
                      </Typography>
                    </div>
                  </Card>
                </CardContent>
              </CardActionArea>
              <div className={classes.buttons}>
                <div className={classes.button}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => history.push(`/history`)}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
      <Snackbar
        open={state.showMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      >
        <Alert severity={state.snackbarMsgType}>{state.snackbarMsg}</Alert>
      </Snackbar>
    </div>
  );
};

export default HistoryDetail;
