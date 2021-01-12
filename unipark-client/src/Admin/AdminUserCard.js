import React, { useReducer, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";

import "./Admin.css";
import { BASE_URL_ADMIN } from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminUserCard = ({ setSelectedImage }) => {
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
    users: [],
    filter: "",
  };

  // Reducer basically takes the old 'state' and copy it into a newState.
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // It's running another sub method called fetchUsers()
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(BASE_URL_ADMIN, config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setState({
          loggedIn: true,
          users: response.data,
        });
      })
      .catch((err) => {
        setState({
          snackbarMsgType: "error",
          snackbarMsg: "Failed to load data from the server",
          showMsg: true,
        });
      });

    // try {
    //   const res = await axios.get(BASE_URL_ADMIN, config);

    //   if (res !== null) {
    //     console.log("Hit " + res.data.documents);
    //     setState({
    //       loggedIn: true,
    //       users: res.data,
    //       documents: res.data.documents
    //     });
    //   }
    // } catch (err) {
    //   setState({
    //     snackbarMsgType: "error",
    //     snackbarMsg: "Failed to load data from the server",
    //     showMsg: true,
    //   });
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const GetUserCard = (index) => {
    const {
      id,
      firstName,
      lastName,
      isVerified,
      isDriver,
      isOwner,
      documents,
    } = state.users[index];
    return (
      <Grid item xs={12} sm={4} key={index}>
        <Card className="admin_user_card">
          <CardActionArea>
            {documents.length > 0 && (
              <CardMedia
                key={documents[0].id}
                className="admin_card_media"
                image={documents[0].url}
                title="Document"
                onClick={() => setSelectedImage(documents[0].url)}
              />
            )}

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="h3">
                Document Verified: {isVerified ? "O" : "X"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Driver: {isDriver ? "O" : "X"} / Owner: {isOwner ? "O" : "X"}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => history.push(`/admin/${id}`)}
            >
              Detail
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  // SearchBar
  const handleSearchChange = (e) => {
    setState({ filter: e.target.value.toLowerCase() });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div className="search_container">
            <SearchIcon className="search_icon" />
            <TextField
              className="search_text_field"
              label="Varified"
              variant="standard"
              onChange={handleSearchChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div className="admin_section">
        {state.users.length === 0 ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {Object.keys(state.users).map(
              (index) =>
                // Check the isVerified
                state.users[index].isVerified.toString() === state.filter &&
                GetUserCard(index)
            )}
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

export default AdminUserCard;
