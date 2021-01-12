import React, { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Button,
    TextField,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";

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
    photo: {
        minHeight: 340,
    },
    owner: {
        display: "flex",
        justifyContent: "space-between",
    },
    date: {
        margin: theme.spacing(1),
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: "Very Dissatisfied",
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: "Dissatisfied",
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: "Neutral",
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: "Satisfied",
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: "Very Satisfied",
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

export default function ParkingLotDetail(props) {
    const history = useHistory();
    const classes = useStyles();
    const { parkingLotdata } = props;
    const [parkingLot, setParkingLot] = useState({
        title: "",
        description: "",
        dateTimeIn: "",
        dateTimeOut: "",
        city: "",
        address: "",
        postalCode: "",
        isAvailable: true,
    });
    const [user, setUser] = useState({
        currentUserMode: 0,
        email: "",
        firstName: "",
        lastName: "",
        ranking: 0.0,
    });
    const [reservation, setReservation] = useState({
        startTime: null,
        endTime: null,
        hoursMinutesOfReservation: 0.0,
        costPaid_Driver: 0.0,
        costEarned_Owner: 0.0,
        commissionRate: 0.1,
        isPaid: false,
    });
    const [infoState, setInfo] = useState({
        fromDateError: false,
        toDateError: false,
    });
    const [difference, setDifference] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
    });
    const [photoList, setPhotoList] = useState([]);
    const [price, setPrice] = useState({
        pricePerHour: 0.0,
    });

    const emptyorundefined =
        reservation.startTime === "" ||
        reservation.startTime === undefined ||
        reservation.hoursMinutesOfReservation == 0.0 ||
        reservation.hoursMinutesOfReservation === undefined ||
        infoState.fromDateError === true ||
        infoState.toDateError === true;

    useEffect(() => {
        if (parkingLotdata && parkingLotdata.user) {
            setParkingLot(parkingLotdata);
            console.log("ParkingLot Detail:" + parkingLotdata);
            setUser(parkingLotdata.user);
            console.log(parkingLotdata.user);
            setPhotoList(props.photoData);
            console.log(JSON.stringify(props.photoData));
            setPrice(props.priceData);
            console.log(props.priceData);
            setReservation(props.reservationData);
            console.log(props.reservationData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        parkingLotdata,
        props.photoData,
        props.priceData,
        props.reservationData,
    ]);

    const handleChange = (prop) => (event) => {
        setReservation({ ...reservation, [prop]: event.target.value });
        console.log(reservation);
    };

    const handleNext = (e) => {
        e.preventDefault();
        // // calculate the time
        // let totalTime = 0;
        // if (difference.day === 0) {
        //   if (difference.minutes === 0) {
        //     totalTime = difference.hours;
        //   } else {
        //     totalTime = difference.hours + (difference.minutes / 60);
        //   }
        // } else {

        //     if (difference.minutes === 0) {
        //       totalTime = (difference.days * 24) + difference.hours;
        //     } else {
        //       totalTime = (difference.days * 24) + difference.hours + (difference.minutes / 60);
        //     }
        // }
        // console.log("Total Time: " + totalTime)
        // calculate the cost
        let cost = price.pricePerHour * reservation.hoursMinutesOfReservation;
        let costPaidDriver = cost.toFixed(2);
        let costPaidOwner = (cost * 0.9).toFixed(2);

        let newReservation = {
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            hoursMinutesOfReservation: parseFloat(
                reservation.hoursMinutesOfReservation
            ),
            costPaid_Driver: parseFloat(costPaidDriver),
            costEarned_Owner: parseFloat(costPaidOwner),
            commissionRate: 10.0,
            isPaid: true,
        };
        console.log(newReservation);
        props.passUpdatedReservation(newReservation);
    };

    const handleBack = () => {
        // Redirect
        history.push(`/home/`);
    };

    const onFromDateChange = (event) => {
        let availableStartDate = moment(parkingLot.dateTimeIn);
        let availableEndDate = moment(parkingLot.dateTimeOut);
        let set = moment(event.target.value);
        if (availableStartDate.diff(set) > 0) {
            console.log("Can't set a date before the availabe start date!");
            setInfo({ fromDateError: true });
        } else if (set.diff(availableEndDate) > 0) {
            console.log("Can't set a date after the availabe end date!");
            setInfo({ fromDateError: true });
        } else {
            console.log(moment(event.target.value));
            setInfo({ fromDateError: false });
            setReservation({ ...reservation, startTime: event.target.value });
        }
    };

    const onToDateChange = (event) => {
        //let availableStartDate = moment(parkingLot.dateTimeIn);
        let availableEndDate = moment(parkingLot.dateTimeOut);
        let set = moment(event.target.value);
        if (reservation.startTime === null) {
            console.log("Set the start time first!");
        } else {
            let setStartDate = moment(reservation.startTime);

            if (setStartDate.diff(set) > 0) {
                console.log(
                    "Can't set a date before the start date that you set!"
                );
                setInfo({ toDateError: true });
            } else if (set.diff(availableEndDate) > 0) {
                console.log("Can't set a date after the availabe end date!");
                setInfo({ toDateError: true });
            } else {
                console.log(moment(event.target.value));

                // Get difference hourse between the start date and the end date
                let diff = moment(event.target.value).diff(setStartDate);
                let diffDuration = moment.duration(diff);
                // console.log("Hit diffDays: " + diffDuration.days())
                // console.log("Hit diffHours: " + diffDuration.hours())
                // console.log("Hit diffMinutes: " + diffDuration.minutes())
                setDifference({
                    days: diffDuration.days(),
                    hours: diffDuration.hours(),
                    minutes: diffDuration.minutes(),
                });
                let calculateTotalHours = (
                    diffDuration.days() * 24 +
                    diffDuration.hours() +
                    diffDuration.minutes() / 60
                ).toFixed(2);
                console.log("Hit totalHours: " + calculateTotalHours);

                setInfo({ toDateError: false });
                setReservation({
                    ...reservation,
                    endTime: event.target.value,
                    hoursMinutesOfReservation: calculateTotalHours,
                });
            }
        }
    };

    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>
                {parkingLot.title}
            </Typography>
            <Typography gutterBottom variant="body2" component="h3">
                {parkingLot.address}, {parkingLot.city}, {parkingLot.postalCode}
            </Typography>
            <Grid container spacing={2}>
                {photoList.length > 0 &&
                    photoList.map(
                        (image) =>
                            image.isMain == true && (
                                <Grid item xs={12} key={image.id}>
                                    <Card>
                                        <CardActionArea>
                                            <CardMedia
                                                className={classes.photo}
                                                image={image.url}
                                                onClick={() =>
                                                    props.setSelectedImage(
                                                        image.url
                                                    )
                                                }
                                            />
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                    )}
                {photoList.length > 0 &&
                    photoList.map(
                        (image) =>
                            image.isMain == false && (
                                <Grid item xs={6} key={image.id}>
                                    <Card>
                                        <CardActionArea>
                                            <CardMedia
                                                className={classes.photo}
                                                image={image.url}
                                                onClick={() =>
                                                    props.setSelectedImage(
                                                        image.url
                                                    )
                                                }
                                            />
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                    )}

                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography gutterBottom>Description</Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                {parkingLot.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <div className={classes.owner}>
                        <div>
                            <Typography>
                                Price Per Hour: ${price.pricePerHour}
                            </Typography>
                        </div>
                        <div>
                            <span>
                                Serviced by{" "}
                                <span style={{ fontSize: "20px" }}>
                                    {user.firstName}
                                </span>
                            </span>
                            <Rating
                                name="read-only"
                                value={user.ranking}
                                IconContainerComponent={IconContainer}
                                readOnly
                                style={{
                                    verticalAlign: "middle",
                                    margin: "5px",
                                }}
                            />
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        {/* <Typography color="secondary" style={{margin: '10px'}}>Add dates for Prices</Typography> */}
                        <CardContent>
                            <Typography style={{ margin: "10px" }}>
                                Available date/time from{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {moment(parkingLot.dateTimeIn).format(
                                        "yyyy-MM-DD hh:mm"
                                    )}
                                </span>
                            </Typography>
                            <TextField
                                required
                                variant="outlined"
                                id="startTime"
                                name="startTime"
                                label="Start Time"
                                type="datetime-local"
                                error={infoState.fromDateError}
                                fullWidth
                                autoComplete="date-time-in"
                                value={reservation.startTime || ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={
                                    (handleChange("startTime"),
                                    onFromDateChange)
                                }
                                style={{ marginBottom: "10px" }}
                            />
                            <Typography style={{ margin: "10px" }}>
                                Avaialbe date/time until{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {moment(parkingLot.dateTimeOut).format(
                                        "yyyy-MM-DD hh:mm"
                                    )}
                                </span>
                            </Typography>
                            <TextField
                                required
                                variant="outlined"
                                id="dateTimeOut"
                                name="dateTimeOut"
                                label="End Time"
                                type="datetime-local"
                                error={infoState.toDateError}
                                fullWidth
                                autoComplete="dateTimeOut"
                                value={reservation.endTime || ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={
                                    (handleChange("endTime"), onToDateChange)
                                }
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}></Grid>
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
                    onClick={handleNext} // pass the information values
                    className={classes.button}
                >
                    Next
                </Button>
            </div>
        </React.Fragment>
    );
}
