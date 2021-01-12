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

import "./Listing.css";
import {
  BASE_URL_PARKINGLOTS_LISTING,
  BASE_URL_PARKINGLOTS,
} from "../constants";

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

const ListingParkingLotCard = () => {
  const history = useHistory();
  const classes = useStyles();
  const token = JSON.parse(localStorage.getItem("token"));

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
    filter: "",
    isLoading: false,
  };

  // Reducer basically takes the old 'state' and copy it into a newState.
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // It's running another sub method called fetchUsers()
  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    console.log(config);
    setState({
      isLoading: true,
    });
    try {
      const res = await axios.get(BASE_URL_PARKINGLOTS_LISTING, config);

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

  const deleteButtonHandle = (parkingLotId) => {
    console.log(parkingLotId);
    axios
      .delete(BASE_URL_PARKINGLOTS + parkingLotId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`deleted parking lot!`);
        console.log(response);
        fetchListing();
      })
      .catch((err) => {
        setState({
          snackbarMsgType: "error",
          snackbarMsg: "Failed to delete the parking lot",
          showMsg: true,
        });
      });
  };

  const GetListingCard = (index) => {
    const { id, address, city, photoUrl, title } = state.listing[index];

    return (
      <Grid item sm={12} lg={4} key={index}>
        <Card className="listing_parking_card">
          <CardActionArea>
            {photoUrl ? (
              <CardMedia
                className="listing_parking_card_media"
                image={photoUrl}
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
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="h3">
                {city}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {address}
              </Typography>
            </CardContent>
          </CardActionArea>
          <div className={classes.buttons}>
            <div className={classes.button}>
              <Button
                size="small"
                color="primary"
                onClick={() => history.push(`/listing/${id}`)}
              >
                Detail
              </Button>
            </div>
            <div className={classes.button}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => deleteButtonHandle(id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography>Your ParkingLots</Typography>

          <div className="add_container">
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => history.push("/listing/0")}
            >
              New ParkingLot
            </Button>
          </div>
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

export default ListingParkingLotCard;
