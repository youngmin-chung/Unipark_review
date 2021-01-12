import React, { useReducer, useEffect } from "react";
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
import { BASE_URL_RESERVATION } from "../constants";

let moment = require("moment-timezone");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const HistoryCard = () => {
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
    listing: [],
    isLoading: false,
  };

  // Reducer basically takes the old 'state' and copy it into a newState.
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // It's running another sub method called fetchUsers()
  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = async () => {
    console.log(config);
    setState({
      isLoading: true,
    });
    try {
      const res = await axios.get(BASE_URL_RESERVATION, config);

      if (res !== null) {
        console.log(res);
        setState({
          loggedIn: true,
          listing: res.data,
          isLoading: false,
        });
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

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const GetListingCard = (index) => {
    const {
      id,
      dateTimeIn,
      dateTimeOut,
      reservedParkingLot,
    } = state.listing[index];

    return (
      <Grid item xs={12} sm={4} key={index}>
        <Card className="listing_parking_card">
          <CardActionArea>
            {reservedParkingLot.photoUrl ? (
              <CardMedia
                className="listing_parking_card_media"
                image={reservedParkingLot.photoUrl}
                title="Document"
              />
            ) : (
              <CardMedia
                className="listing_parking_card_media"
                image="http://placehold.it/250x350"
                title="PlaceHolder"
              />
            )}

            <CardContent className="listing_parking_card_content">
              <Typography
                gutterBottom
                variant="body2"
                color="textSecondary"
                component="h3"
              >
                <span style={{ fontWeight: "bold" }}>
                  {moment(dateTimeIn).format("yyyy-MM-DD hh:mm")}
                </span>{" "}
                ~{" "}
                <span style={{ fontWeight: "bold" }}>
                  {moment(dateTimeOut).format("yyyy-MM-DD hh:mm")}
                </span>
              </Typography>
              <Typography variant="h5" component="h2">
                {reservedParkingLot.title}
              </Typography>
            </CardContent>
          </CardActionArea>
          <div className={classes.buttons}>
            <div className={classes.button}>
              <Button
                size="small"
                color="primary"
                onClick={() => history.push(`/history/${id}`)}
              >
                Detail
              </Button>
            </div>
            <div className={classes.button}></div>
          </div>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography>Your History</Typography>
        </Toolbar>
      </AppBar>
      <div className="listing_parking_section">
        {state.isLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {Object.keys(state.listing).map((index) => GetListingCard(index))}
          </Grid>
        )}
      </div>
      <Snackbar
        open={state.showMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      >
        <Alert severity={state.snackbarMsgType}>{state.snackbarMsg}</Alert>
      </Snackbar>
    </>
  );
};

export default HistoryCard;
