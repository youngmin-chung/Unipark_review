import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    top: 60,
  },
  buttonSave: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  message: {
    top: 10,
    marginBottom: theme.spacing(1)
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ProfileForm(props) {
  const classes = useStyles();
  const { data } = props;
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    emergencyContact: "",
    currentUserMode: 0,
  });
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarMsgType, setSnackbarMsgType] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const emptyorundefined =
    values.firstName === "" ||
    values.firstName === undefined ||
    values.lastName === "" ||
    values.lastName === undefined ||
    values.email === "" ||
    values.email === undefined ||
    values.phoneNumber === "" ||
    values.phoneNumber === undefined ||
    values.phoneNumber === null ||
    values.emergencyContact == "" ||
    values.emergencyContact === undefined ||
    values.emergencyContact === null;

  const emptyPassword =
    values.password === "" ||
    values.password === undefined ||
    values.confirmPassword === "" ||
    values.confirmPassword === undefined;

  useEffect(() => {
    if (data) {
      setValues(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(values);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
    console.log(data);
  };

  const handleClickShowPasswordConfirm = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
    console.log(data);
  };

  const snackbarClose = () => {
    setShowMsg(false);
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log(values.password);
    props.handleNextToDocument(values);
    console.log(values);
  };

  const handlePasswordChange = () => {
      props.handlePasswordChange(values);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            value={values.firstName || ""}
            onChange={handleChange("firstName")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            value={values.lastName || ""}
            onChange={handleChange("lastName")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            fullWidth
            autoComplete="email"
            value={values.email || ""}
            onChange={handleChange("email")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="phone-number"
            name="phone-number"
            label="Phone Number (xxx)xxx-xxxx"
            fullWidth
            autoComplete="phone-number"
            value={values.phoneNumber || ""}
            onChange={handleChange("phoneNumber")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="emergency-contact"
            name="emergency-contact"
            label="Emergency Contact (xxx)xxx-xxxx"
            fullWidth
            autoComplete="emergency-contact"
            value={values.emergencyContact || ""}
            onChange={handleChange("emergencyContact")}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="view-mode-input-label">Default View</InputLabel>
            <Select
              labelId="view-mode-select-label"
              id="select-label"
              value={values.currentUserMode || 0}
              onChange={handleChange("currentUserMode")}
            >
              <MenuItem value={0}>Driver</MenuItem>
              <MenuItem value={1}>Parking Owner</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl required>
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl required>
            <InputLabel htmlFor="standard-adornment-password">
              Confirm Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={values.showConfirmPassword ? "text" : "password"}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showConfirmPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <div className={classes.buttons}>
            <Grid item xs={6} className={classes.message}><Typography>Password must be at least 8 characters long with one uppercase, one lowercase, and one numeric character.</Typography></Grid>
        </div>
        
      </Grid>
      
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.buttonSave}
          disabled={emptyPassword}
          onClick={handlePasswordChange}
        >
          Password Change
        </Button>
      </div>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
          disabled={emptyorundefined}
        >
          Next
        </Button>
      </div>
      <Snackbar open={showMsg} autoHideDuration={3000} onClose={snackbarClose}>
        <Alert severity={snackbarMsgType}>{snackbarMsg}</Alert>
      </Snackbar>
    </React.Fragment>
  );
}
