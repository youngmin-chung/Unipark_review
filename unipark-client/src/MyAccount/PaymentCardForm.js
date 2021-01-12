import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'

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

export default function PaymentCardForm(props) {
  const classes = useStyles();
  const { data } = props;
  const [values, setValues] = useState({
    cardNumber: "",
    name: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: ""
  });
  const [focus, setFocus] = useState('');

  const emptyorundefined =
    values.cardNumber === "" ||
    values.cardNumber === undefined ||
    values.name === "" ||
    values.name === undefined ||
    values.expiryMonth === "" ||
    values.expiryMonth === undefined ||
    values.expiryYear === "" ||
    values.expiryYear === undefined ||
    values.cvc === "" ||
    values.cvc === undefined;


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

  const handleUpdate = (e) => {
    e.preventDefault();
    props.handleUpdateAll(values);
  }

  

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment
      </Typography>
      <Grid container spacing={3}>
        <Cards
          number={values.cardNumber}
          name={values.name}
          xpiry={values.expiryMonth + "/" + values.expiryYear}
          cvc={values.cVC}
          focused={focus}
        />
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cardNumber"
            name="number"
            label="Card Number"
            fullWidth
            autoComplete="Card Number"
            value={values.cardNumber || ""}
            onChange={handleChange("cardNumber")}
            onFocus={e => setFocus(e.target.name)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="name"
            value={values.name || ""}
            onChange={handleChange("name")}
            onFocus={e => setFocus(e.target.name)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="expiryMonth"
            name="expiry"
            label="Expiry Month"
            fullWidth
            autoComplete="expiryMonth"
            value={values.expiryMonth || ""}
            onChange={handleChange("expiryMonth")}
            onFocus={e => setFocus(e.target.name)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="expiryYear"
            name="expiry"
            label="Expiry Year"
            fullWidth
            autoComplete="expiryYear"
            value={values.expiryYear || ""}
            onChange={handleChange("expiryYear")}
            onFocus={e => setFocus(e.target.name)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="tel"
            id="cvc"
            name="cvc"
            label="CVC"
            fullWidth
            autoComplete="cvc"
            value={values.cvc || ""}
            onChange={handleChange("cvc")}
            onFocus={e => setFocus(e.target.name)}
          />
        </Grid>
      
      </Grid>
      <div className={classes.buttons}>
        <Button 
            className={classes.button} 
            variant="contained" 
            color="primary"
            onClick={handleUpdate}
            disabled={emptyorundefined}
        >
          Update
        </Button>
      </div>
    </React.Fragment>
  );
}
