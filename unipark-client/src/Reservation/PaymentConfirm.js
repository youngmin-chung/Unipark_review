import React, { useEffect, useState } from "react";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"

let moment = require("moment-timezone");

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
  },
  card: {
    margin: theme.spacing(1),
  },
}));

// const CheckoutForm = () => {
//   return stripe = useStripe();
// }


// const stripePromise = loadStripe("pk_test_51HyZnDCO0T3SwvnoNpvcsU5rlHGwk85YQxPPoH5O1RxAFMImGihFsyrpJUtvERRZacXbhTszYYUTTD7dOWkIo9bh00TgnDhf67")

export default function ReservationConfirm (props) {
  const classes = useStyles();
  const [paymentCardValues, setPaymentCardValues] = useState({
    cardNumber: "",
    name: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: ""
  });


  useEffect(() => {
    if (props.paymentData) {
      setPaymentCardValues(props.paymentData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Reservation Confirm
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <Typography style={{ margin: "5px", color: "secondary" }}>
              Reservation Summary
            </Typography>
            <CardContent>
              <Typography gutterBottom>            
                Start Date: {moment(props.reservationData.startTime).format("yyyy-MM-DD hh:mm")}
              </Typography>
              <Typography>
                End Date: {moment(props.reservationData.endTime).format("yyyy-MM-DD hh:mm")}
              </Typography>
              <Typography>
                Total Hours: {props.reservationData.hoursMinutesOfReservation}
              </Typography>
              <Typography variant="h6" component="h6">
                Cost: ${props.reservationData.costPaid_Driver}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
            <Cards
          number={paymentCardValues.cardNumber.substr(paymentCardValues.cardNumber.length - 4) + "xxxxxxxxxxxx"}
          name={paymentCardValues.name}
          xpiry={paymentCardValues.expiryMonth + "/" + paymentCardValues.expiryYear}
          cvc={paymentCardValues.cVC}
         
        />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
