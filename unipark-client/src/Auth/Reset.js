import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Snackbar,
  TextField,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import axios from "axios";

import theme from "../theme";
import "./Auth.css";
import { BASE_URL_ACCOUNT } from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Reset = (props) => {
  const history = useHistory();

  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    snackbarMsgType: "success",
    email: "",
    token: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onResetClicked = async () => {
    try {
      const res = await axios.put(BASE_URL_ACCOUNT + "reset/" + state.email);
      console.log(res.data);
      if (res.data === true) {
        // the reason why snackbarMsg was not used here
        // because after successfully reset, it will link to login page
        // so users can not see the snackbarMsg

        // setState({
        //   snackbarMsgType: "success",
        //   snackbarMsg:
        //     "Reset password successfully, A temporary has been sent to " +
        //     state.email,
        //   showMsg: true,
        // });
        alert(
          "Reset password successfully, A temporary password has been sent to " +
            state.email
        );
        // After reset succeeded, redirect to the login page
        history.push("/login");
      }
    } catch (err) {
      if (err.response !== undefined) {
        setState({
          snackbarMsgType: "error",
          snackbarMsg:
            "Reset password unsuccessfully, " +
            state.email +
            " is unregistered.",
          showMsg: true,
        });
      }
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const handleEmailInput = (e) => {
    setState({ email: e.target.value });
  };

  const emptyorundefined = state.email === undefined || state.email === "";

  return (
    <div className="auth_container">
      <MuiThemeProvider theme={theme}>
        <Card className="auth_card" style={{ marginTop: "10%" }}>
          <CardHeader
            title="Reset your password"
            color="inherit"
            style={{ textAlign: "center" }}
          />
          <CardContent className="auth_card_content">
            <h6>Email</h6>
            <TextField
              style={{ width: "82%" }}
              onChange={handleEmailInput}
              value={state.email}
            />
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={onResetClicked}
              disabled={emptyorundefined}
              style={{ width: "82%", marginTop: "20px" }}
            >
              Reset Password
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
export default Reset;
