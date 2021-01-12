import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
}));

export default function VehicleForm(props) {
  const classes = useStyles();
  const { data } = props;
  const [values, setValues] = useState({
    plateNumber: "",
    year: "",
    make: "",
    model: "",
    color: "",
  });

  const emptyorundefined =
    values.plateNumber === "" ||
    values.plateNumber === undefined ||
    values.year === "" ||
    values.year === undefined ||
    values.make === "" ||
    values.make === undefined ||
    values.model === "" ||
    values.model === undefined ||
    values.color == "" ||
    values.color === undefined;

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

  const handleNextToPayment = (e) => {
    e.preventDefault();
    props.handleNextToPayment(values);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Vehicle
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="plateNumber"
            name="plateNumber"
            label="Plate Number"
            fullWidth
            autoComplete="plate-number"
            value={values.plateNumber || ""}
            onChange={handleChange("plateNumber")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="year"
            name="year"
            label="Year"
            fullWidth
            autoComplete="year"
            value={values.year || ""}
            onChange={handleChange("year")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="make"
            name="make"
            label="Make"
            fullWidth
            autoComplete="make"
            value={values.make || ""}
            onChange={handleChange("make")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="model"
            name="model"
            label="Model"
            fullWidth
            autoComplete="model"
            value={values.model || ""}
            onChange={handleChange("model")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="color"
            name="color"
            label="Color"
            fullWidth
            autoComplete="color"
            value={values.color || ""}
            onChange={handleChange("color")}
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button 
            className={classes.button} 
            variant="contained" 
            color="primary"
            disabled={emptyorundefined}
            onClick={handleNextToPayment}
        >
          Next
        </Button>
      </div>
    </React.Fragment>
  );
}
