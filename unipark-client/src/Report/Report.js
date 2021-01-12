import React, { useState } from "react";
import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Report() {
    const classes = useStyles();
    const initialInputState = {
        name: "",
        email: "",
        message: "",
        issueType: "",
    };
    const [newMessage, setNewMessage] = useState(initialInputState);

    const { name, email, message, issueType } = newMessage;

    const handleInputChange = (e) => {
        setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    };

    const sendMessage = (e) => {
        fetch("https://localhost:44385/api/report/AddReport", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Accept: "application/json",
                mode: "no-cors",
            },
            body: JSON.stringify({
                UserName: name,
                UserEmail: email,
                Description: message,
                IssueType: issueType,
                ReportingTime: new Date(),
            }),
        })
            .then((customer) => customer.json())
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const emptyorundefined =
        email === undefined ||
        email === "" ||
        name === undefined ||
        name === "" ||
        issueType === undefined ||
        issueType === "" ||
        message === undefined ||
        message === "";

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        CONTACT US
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full name"
                            name="name"
                            autoFocus
                            onChange={handleInputChange}
                            value={name}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoFocus
                            onChange={handleInputChange}
                            value={email}
                        />
                        <FormControl
                            variant="outlined"
                            fullWidth
                            className={classes.formControl}
                            required
                        >
                            <InputLabel htmlFor="outlined-age-native-simple">
                                IssueType
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                label="issueType"
                                name="issueType"
                                id="issueType"
                                value={issueType}
                                onChange={handleInputChange}
                            >
                                <MenuItem
                                    value={"I received a citation/ticket"}
                                >
                                    I received a citation/ticket
                                </MenuItem>
                                <MenuItem
                                    value={
                                        "I'm having trouble paying for parking"
                                    }
                                >
                                    I'm having trouble paying for parking
                                </MenuItem>
                                <MenuItem
                                    value={
                                        "I was overcharged/undercharged for my parking session"
                                    }
                                >
                                    I was overcharged/undercharged for my
                                    parking session
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="message"
                            label="Message"
                            id="outlined-multiline-static"
                            multiline
                            rows={6}
                            value={message}
                            onChange={handleInputChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={sendMessage}
                            disabled={emptyorundefined}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Report;
