import React, { useReducer, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Snackbar,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
} from "@material-ui/core";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

import "./Admin.css";
import { BASE_URL_ADMIN } from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminUserDetailCard = ({ setSelectedImage, userId }) => {
  const history = useHistory();

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
    user: null,
    isDocumentVarified: false,
    documents: [],
  };

  // Reducer basically takes the old 'state' and copy it into a newState.
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // It's running another sub method called fetchUsers()
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      fetchUser();
    } else {
      history.push("/login");
    }
  }, []);

  const fetchUser = async () => {
    console.log(config);

    try {
      const res = await axios.get(`${BASE_URL_ADMIN}${userId}`, config);

      if (res !== null) {
        console.log(res);
        setState({
          loggedIn: true,
          user: res.data,
          isDocumentVarified: res.data.isVerified,
          documents: res.data.documents,
        });
        console.log(res.data.documents);
      }
    } catch (err) {
      setState({
        snackbarMsgType: "error",
        snackbarMsg: "Failed to load data from the server",
        showMsg: true,
      });
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  // Update the varify status
  const VarifyDocument = async (isVerified) => {
    //state.user.isVerified(true);

    const user = {
      isVerified: isVerified,
    };

    try {
      const res = await axios.put(`${BASE_URL_ADMIN}${userId}`, user, config);

      if (res !== null) {
        console.log(res);
        setState({
          loggedIn: true,
          isDocumentVarified: isVerified,
        });
      }
    } catch (err) {
      setState({
        snackbarMsgType: "error",
        snackbarMsg: "Failed to load data from the server",
        showMsg: true,
      });
    }
  };

  return (
    <>
      <div className="admin_section">
        <Paper>
          {state.user === null ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Document Iamge</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  (click the document image to see as the original size)
                </Typography>
                <Grid container spacing={2}>
                  {state.documents.length > 0 &&
                    state.documents.map(
                      (image, index) => (
                        <Grid item xs={6} key={image.id}>
                          <Card>
                            <Typography>No.{index + 1}</Typography>
                            <CardActionArea>
                              <CardMedia
                                style={{minHeight: 300}}
                                image={image.url}
                                onClick={() => setSelectedImage(image.url)}
                              />
                            </CardActionArea>
                          </Card>
                        </Grid>
                    ))}
                </Grid>

                <div className="admin_user_detail_card_content">
                  <Typography gutterBottom variant="h5" component="h2">
                    User Name: {state.user.firstName} {state.user.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="h3"
                  >
                    Email Address: {state.user.email}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="h3"
                  >
                    Document Verified: {state.isDocumentVarified ? "O" : "X"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Driver: {state.user.isDriver ? "O" : "X"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Owner: {state.user.isOwner ? "O" : "X"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Phone Number: {state.user.phoneNumber}
                  </Typography>
                </div>

                {state.user.parkingLots ? (
                  <>
                    <Typography variant="h5" component="h5">
                      ParkingLot List
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      (click the property image to see as the original size)
                    </Typography>
                    {state.user.parkingLots.map((item, key) => (
                      <Card
                        key={key}
                        className="admin_user_detail_card_parkinglot"
                      >
                        <CardActionArea>
                          {item.photoUrl ? (
                            <CardMedia
                              className="admin_card_media"
                              image={item.photoUrl}
                              title="Document"
                              onClick={() => setSelectedImage(item.photoUrl)}
                            />
                          ) : (
                            <CardMedia
                              className="admin_card_media"
                              image="http://placehold.it/100x100"
                              title="PlaceHolder"
                              onClick={() =>
                                setSelectedImage("http://placehold.it/100x100")
                              }
                            />
                          )}
                          <CardContent>
                            <Typography gutterBottom variant="body2">
                              City: {item.city}
                            </Typography>
                            <Typography gutterBottom variant="body2">
                              Address: {item.address}
                            </Typography>
                            <Typography gutterBottom variant="body2">
                              Postal Code: {item.postalCode}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
                  </>
                ) : (
                  <></>
                )}

                <div className="admin_user_detail_card_button">
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => history.push("/Admin")}
                  >
                    Back
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      VarifyDocument(true);
                    }}
                  >
                    Varify
                  </Button>
                  <Button
                    size="small"
                    color="default"
                    variant="contained"
                    onClick={() => {
                      VarifyDocument(false);
                    }}
                  >
                    No Varify
                  </Button>
                </div>
              </Grid>
            </Grid>
          )}
        </Paper>
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

export default AdminUserDetailCard;
