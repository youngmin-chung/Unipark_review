import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {Visibility, VisibilityOff} from "@material-ui/icons";

import theme from "../theme";
import "./Auth.css";
import { BASE_URL_ACCOUNT } from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = (props) => {
  
  const history = useHistory();

  const initialState = {
    showMsg: false,
    loggedIn: false,
    showPassword: false,
    showConfirmPassword: false,
    snackbarMsg: "",
    snackbarMsgType: "success",
    email: "",
    password: "",
    confirmpassword: "",
    firstname: "",
    lastname: "",
    currentMode: 0,
    token: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onSignUpClicked = async () => {
    if (state.password !== state.confirmpassword) {
      setState({
        snackbarMsgType: "error",
        snackbarMsg: "Password must be matched",
        showMsg: true,
      });
    } else {
      // create a user object that is going to pass to the server
      let user = {
        Email: state.email,
        Password: state.password,
        FirstName: state.firstname,
        LastName: state.lastname,
      };

      try {
        const res = await axios.post(
          BASE_URL_ACCOUNT + "register",
          user
        );
  
        if (res !== null) {
          console.log(res);
          setState({
            loggedIn: true,
            email: res.data.email,
            firstname: res.data.firstName,
            currentMode: res.data.currentUserMode,
            token: res.data.token,
          });

          console.log("username in Register: " + res.data.firstName); 
          props.setUsertoken(res.data.token);
          // Save the token in the local storage
          //https://www.robinwieruch.de/local-storage-react
          localStorage.setItem("token", JSON.stringify(res.data.token));
          // Set the current user mode to display proper view mode
          localStorage.setItem("currentMode", JSON.stringify(res.data.currentUserMode));
  
          // After login succeeded, redirect to the home page
          history.push("/home");
        }
      } catch (err) {
       // When the user does not have the token, the data will be undefined
       if (err.response !== undefined) {
         setState({
           snackbarMsgType: "error",
           snackbarMsg: err.response.data,
           showMsg: true,
         });
       }
      }
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const handleFirstNameInput = (e) => {
    setState({ firstname: e.target.value });
  };

  const handleLastNameInput = (e) => {
    setState({ lastname: e.target.value });
  };

  const handleEmailInput = (e) => {
    setState({ email: e.target.value });
  };

  const handlePasswordInput = (e) => {
    setState({ password: e.target.value });
  };

  const handlePasswordConfirmInput = (e) => {
    setState({ confirmpassword: e.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setState({ showPassword: !state.showPassword });
  };  

  const handleClickShowConfirmPassword = () => {
    setState({ showConfirmPassword: !state.showConfirmPassword });
  };  

  const emptyorundefined =
    state.email === undefined ||
    state.email === "" ||
    state.password === undefined ||
    state.password === "" ||
    state.confirmpassword === undefined ||
    state.confirmpassword === "" ||
    state.firstname === undefined ||
    state.firstname === "" ||
    state.lastname === undefined ||
    state.lastname === "";

  return (
    <div className="auth_container">
      <MuiThemeProvider theme={theme}>
        <Card className="auth_card" style={{ marginTop: "10%" }}>
          <CardHeader
            title="Welcome to UniPark"
            color="inherit"
            style={{ textAlign: "center" }}
          />

          <CardContent className="auth_card_content">
            <TextField
              label="First Name"
              style={{ width: "82%" }}
              onChange={handleFirstNameInput}
              value={state.firstname}
            />
            <br />
            <TextField
              label="Last Name"
              style={{ width: "82%" }}
              onChange={handleLastNameInput}
              value={state.lastname}
            />
            <br />
            <TextField
              label="Email"
              style={{ width: "82%" }}
              onChange={handleEmailInput}
              value={state.email}
            />
            <br />
            <FormControl required>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={state.showPassword ? "text" : "password"}
                onChange={handlePasswordInput}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Typography>Password must be at least 8 characters long with one uppercase, one lowercase, and one numeric character.</Typography>        
            <br />
            <FormControl required>
              <InputLabel htmlFor="standard-adornment-password">
                Confirm Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={state.showConfirmPassword ? "text" : "password"}
                onChange={handlePasswordConfirmInput}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {state.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={onSignUpClicked}
              disabled={emptyorundefined}
              style={{ width: "82%", marginTop: "20px" }}
            >
              Sign up
            </Button>

            <Snackbar
              open={state.showMsg}
              autoHideDuration={3000}
              onClose={snackbarClose}
            >
              <Alert severity={state.snackbarMsgType}>
                {state.snackbarMsg}
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
};

export default Register;
