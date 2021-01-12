import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Snackbar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";

import theme from "../theme";
import Banner from "../Banner/Banner";
import Card from "../Card/Card";
import "./Home.css";
import { BASE_URL_PARKINGLOTS } from "../constants";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Home() {
    const history = useHistory();
    const config = {
        headers: {
            Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
            )}`,
        },
    };

    const initialState = {
        showMsg: false,
        loggedIn: false,
        snackbarMsg: "",
        msg: "",
        contactServer: false,
        parkinglots: [],
    };

    // Reducer basically takes the old 'state' and copy it into a newState.
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    // It's running another sub method called fetchUsers()
    useEffect(() => {
        fetchParkingLots();
    }, []);

    const fetchParkingLots = async () => {
        console.log(config);

        try {
            const res = await axios.get(
                BASE_URL_PARKINGLOTS,
                config
            );

            if (res !== null) {
                console.log(res);
                setState({
                    loggedIn: true,
                    parkinglots: res.data,
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

    const snackbarClose = () => {
        setState({ showMsg: false });
    };

    return (
        <div className="Home">
            <MuiThemeProvider theme={theme}>
                {/* <h1>Home component</h1> */}
                <Banner />
                <div className="home_section">
                    {state.parkinglots.map((item, key) => (
                        <Card
                            key={key}
                            src={item.photoUrl}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
                <div className="home_section"></div>
                <Snackbar
                    open={state.showMsg}
                    autoHideDuration={3000}
                    onClose={snackbarClose}
                >
                    <Alert severity={state.snackbarMsgType}>
                        {state.snackbarMsg}
                    </Alert>
                </Snackbar>
            </MuiThemeProvider>
        </div>
    );
}

export default Home;
