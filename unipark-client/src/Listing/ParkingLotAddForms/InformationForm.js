import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Input,
  InputAdornment,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
let moment = require("moment-timezone");

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },

  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function InformationForm(props) {
  const classes = useStyles();
  const history = useHistory();
  const { data } = props;
  const { priceData } = props;

  const currDateTime = moment.tz("America/Toronto").format("yyyy-MM-DDThh:mm");

  const [values, setValues] = useState({
    city: "",
    postalCode: "",
    address: "",
    title: "",
    dateTimeIn: null,
    dateTimeOut: null,
    description: "",
    price: null,
  });
  const [priceValues, setPriceValues] = useState({
    id: 0,
    pricePerHour: 0.0,
  });
  const [infoState, setInfo] = useState({
    fromDateError: false,
    toDateError: false,
  });

  const emptyorundefined =
    values.city === "" ||
    values.city === undefined ||
    values.postalCode === "" ||
    values.postalCode === undefined ||
    values.address === "" ||
    values.address === undefined ||
    values.dateTimeOut === null ||
    values.dateTimeOut === undefined ||
    values.dateTimeIn == null ||
    values.dateTimeIn === undefined ||
    values.description === "" ||
    values.description === undefined ||
    priceValues.pricePerHour === 0 ||
    priceValues.pricePerHour === undefined ||
    priceValues.pricePerHour === "" ||
    infoState.fromDateError === true ||
    infoState.toDateError === true;

  useEffect(() => {
    console.log("InformationForm: " + JSON.stringify(data));
    if (data) {
      setValues(data);
      setPriceValues(priceData);
      console.log("Hit?? " + JSON.stringify(priceData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, priceData]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(values);
  };

  const handlePriceChange = (prop) => (event) => {
    var nonNumericRegex = /[^0-9.]+/g;

    setPriceValues({
      ...priceValues,
      [prop]: event.target.value.replace(nonNumericRegex, ""),
    });

    let newPrice = {
      id: priceValues.id,
      pricePerHour: parseFloat(event.target.value.replace(nonNumericRegex, "")),
    };
    setValues({ ...values, price: newPrice });
  };

  const onFromDateChange = (event) => {
    let now = moment(currDateTime);
    let set = moment(event.target.value);
    if (now.diff(set) > 0) {
      console.log("Can't set a date in the past!");
      setInfo({ fromDateError: true });
    } else {
      setInfo({ fromDateError: false });
      setValues({ ...values, dateTimeIn: event.target.value });
    }
  };

  const onToDateChange = (event) => {
    let now = moment(currDateTime);
    let fromDate = moment(infoState.fromDateError);
    let set = moment(event.target.value);
    if (now.diff(set) > 0) {
      console.log("Can't set a date in the past!");
      setInfo({ toDateError: true });
    } else if (set.diff(fromDate) < 0) {
      console.log("?? :  " + fromDate);
    } else {
      setInfo({ toDateError: false });
      setValues({ ...values, dateTimeOut: event.target.value });
    }
  };

  const handleBack = () => {
    // Redirect
    history.push(`/listing/`);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Parking Lot Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            variant="outlined"
            name="city"
            label="City"
            fullWidth
            autoComplete="given-name"
            value={values.city || ""}
            onChange={handleChange("city")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="postalCode"
            variant="outlined"
            name="postalCode"
            label="Postal Code"
            fullWidth
            autoComplete="family-name"
            value={values.postalCode || ""}
            onChange={handleChange("postalCode")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="address"
            value={values.address || ""}
            onChange={handleChange("address")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            id="title"
            name="title"
            label="Title"
            fullWidth
            autoComplete="title"
            value={values.title || ""}
            onChange={handleChange("title")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id="dateTimeIn"
            name="dateTimeIn"
            label="Available From"
            type="datetime-local"
            error={infoState.fromDateError}
            fullWidth
            autoComplete="date-time-in"
            value={values.dateTimeIn || ""}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(handleChange("dateTimeIn"), onFromDateChange)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id="dateTimeOut"
            name="dateTimeOut"
            label="Availabe To"
            type="datetime-local"
            error={infoState.toDateError}
            fullWidth
            autoComplete="dateTimeOut"
            value={values.dateTimeOut || ""}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(handleChange("dateTimeOut"), onToDateChange)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            multiline
            rows={4}
            id="description"
            name="description"
            label="Description"
            fullWidth
            autoComplete="description"
            value={values.description || ""}
            onChange={handleChange("description")}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Price Per Hour</Typography>
          <Input
            id="standard-adornment-amount"
            value={priceValues.pricePerHour}
            onChange={handlePriceChange("pricePerHour")}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </Grid>
      </Grid>

      <div className={classes.buttons}>
        <Button
          variant="outlined"
          onClick={handleBack}
          className={classes.button}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={emptyorundefined}
          onClick={() => props.handlePost(values)} // pass the information values
          className={classes.button}
        >
          {props.currentParkingId == 0 ? ("Post") : ("Update")}
        </Button>
      </div>
    </React.Fragment>
  );
}
