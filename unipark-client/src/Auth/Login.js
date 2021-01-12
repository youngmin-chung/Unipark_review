import React, { useReducer, useEffect } from "react";
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
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import axios from "axios";
import jwt from "jwt-decode";
import {Visibility, VisibilityOff} from "@material-ui/icons";

import theme from "../theme";
import "./Auth.css";
import { BASE_URL_ACCOUNT } from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = (props) => {
  const history = useHistory();

  const initialState = {
    showMsg: false,
    loggedIn: false,
    showPassword: false,
    snackbarMsg: "",
    snackbarMsgType: "success",
    email: "",
    password: "",
    firstname: "",
    currentMode: 0,
    token: ""
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      const user = jwt(localStorage.getItem("token"));
      if (user.role === "Admin") {
        history.push("/admin");
      } else {
        history.push("/home");
      }
    }
  }, []);

  const onLogInClicked = async () => {
    // create a user object that is going to pass to the server
    let user = {
      Email: state.email,
      Password: state.password,
    };

    try {
      const res = await axios.post(BASE_URL_ACCOUNT + "login", user);

      if (res !== null) {
        setState({
          loggedIn: true,
          email: res.data.email,
          firstname: res.data.firstName,
          currentMode: res.data.currentUserMode,
          token: res.data.token,
        });

        const user = jwt(res.data.token);
        console.log(user);
        console.log(res.data.token);
        console.log(` Response from server: ${res.data.currentUserMode}`);
        props.setUsertoken(res.data.token);
        // Save the token in the local storage
        //https://www.robinwieruch.de/local-storage-react
        localStorage.setItem("token", JSON.stringify(res.data.token));
        // Set the current user mode to display proper view mode
        localStorage.setItem(
          "currentMode",
          JSON.stringify(res.data.currentUserMode)
        );
        console.log("From Login: " + res.data.currentUserMode);

        if (user.role === "Admin") {
          history.push("/admin");
        } else {
          // After login succeeded, redirect to the home page
          history.push("/home");
        }
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
      localStorage.clear();
      history.push("/login");
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const handleEmailInput = (e) => {
    setState({ email: e.target.value });
  };

  const handlePasswordInput = (e) => {
    setState({ password: e.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setState({ showPassword: !state.showPassword });
  };  

  const emptyorundefined =
    state.email === undefined ||
    state.email === "" ||
    state.password === undefined ||
    state.password === "";

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
            <TextField label="Email" onChange={handleEmailInput} value={state.email} />
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
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={onLogInClicked}
              disabled={emptyorundefined}
              style={{ width: "82%", marginTop: "20px" }}
            >
              Sign In
            </Button>

            <div>
              <ul className="ul">
                <li onClick={() => history.push("/register")}>Sign Up</li>
                <span className="p-1">|</span>
                <li onClick={() => history.push("/reset")}>Reset Password</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Snackbar
          open={state.showMsg}
          autoHideDuration={30000}
          onClose={snackbarClose}
        >
          <Alert severity={state.snackbarMsgType}>{state.snackbarMsg}</Alert>
        </Snackbar>
      </MuiThemeProvider>
    </div>
  );
};

export default Login;
