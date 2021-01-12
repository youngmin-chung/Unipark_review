import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Snackbar,
} from "@material-ui/core";
import jwt from "jwt-decode";
import Pica from "pica";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

import InformationForm from "./ParkingLotAddForms/InformationForm";
import PhotoForm from "./ParkingLotAddForms/PhotoForm";
import {
  BASE_URL_PARKINGLOTS,
  BASE_URL_PARKINGLOTS_PHOTO_ADD,
  BASE_URL_PARKINGLOTS_PHOTO_UPDATE,
  BASE_URL_PARKINGLOTS_PHOTO_DELETE,
} from "../constants";

import * as axios from "axios";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
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

// https://www.myrtana.sk/articles/how-to-resize-images-with-pica
function resizeImage(file, body) {
  const pica = Pica();

  const outputCanvas = document.createElement("canvas");
  // this will determine resulting size
  // ignores proper aspect ratio, but could be set dynamically
  // to handle that
  outputCanvas.height = 170;
  outputCanvas.width = 280;

  return new Promise((resolve) => {
    const img = new Image();

    // resize needs to happen after image is "loaded"
    img.onload = () => {
      resolve(
        pica
          .resize(img, outputCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          })
          .then((result) => pica.toBlob(result, "image/jpeg", 0.7))
      );
    };

    img.src = `data:${file.type};base64,${body}`;
  });
}

function convertBlobToBinaryString(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onabort = () => {
      reject(new Error("Reading blob aborted"));
    };

    reader.onerror = () => {
      reject(new Error("Error reading blob"));
    };

    reader.readAsBinaryString(blob);
  });
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const steps = ["Information", "Photo"];

export default function ListingParkingDetail(props) {
  // we need to pass token as props into component
  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [informationData, setInformationData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [currentParkingLotId, setCurrentParkingLotId] = useState(0);
  const token = JSON.parse(localStorage.getItem("token"));
  const [resizedFiles, setResizedFiles] = useState({
    form: {
      images: [],
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarMsgType, setSnackbarMsgType] = useState("success");

  useEffect(() => {
    setCurrentParkingLotId(props.match.params.parkingId);
    console.log(props.match.params.parkingId);
    console.log("Files: " + JSON.stringify(resizedFiles.form));
    // If the parkingLot is already exist
    if (props.match.params.parkingId != 0) {
      getInformationData(props.match.params.parkingId);
      // getPriceData(props.match.params.parkingId);
    }
    // If the parkingLot is just created
    else if (props.match.params.parkingId == 0 && currentParkingLotId != 0) {
      getInformationData(currentParkingLotId);
      // getPriceData(currentParkingLotId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInformationData = (parkingLotId) => {
    axios
      .get(BASE_URL_PARKINGLOTS + parkingLotId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(response);
        setInformationData(response.data);
        setPriceData(response.data.price);
        console.log(response.data.photos);
        setPhotoData(response.data.photos);
        console.log("Hit Price" + JSON.stringify(response.data.price))
        setCurrentParkingLotId(response.data.id);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg(
          "Failed to load parking lot information from the server"
        );
        setShowMsg(true);
      });
  };

  const updateInformationData = (data) => {
    axios
      .put(BASE_URL_PARKINGLOTS + currentParkingLotId, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`update user!`);
        console.log(response);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg("Failed to update parking lot information");
        setShowMsg(true);
      });
  };

  const createInformationData = (data) => {
    console.log("Hit parkingLotId: " + currentParkingLotId);
    console.log("Hit parkingLot: " + JSON.stringify(data));
    const user = jwt(localStorage.getItem("token"));
    console.log("Header: " + user.nameid);
    axios
      .post(BASE_URL_PARKINGLOTS + user.nameid, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`create information!`);
        console.log(response);
        setInformationData(response.data);
        console.log(response.data.photos);
        setPhotoData(response.data.photos);
        setCurrentParkingLotId(response.data.id);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg("Failed to create parking lot information");
        setShowMsg(true);
      });
  };

  // This function execute on the InformationForm page
  const handlePost = (values) => {
    console.log(activeStep);
    setActiveStep(activeStep + 1);

    if (currentParkingLotId == 0 && props.match.params.parkingId == 0) {
      console.log("Hit Weird1: " + currentParkingLotId);
      createInformationData(values);
    } else {
      console.log("Hit Weird2: " + currentParkingLotId);
      updateInformationData(values);
    }
  };

  const handleBack = () => {
    console.log(activeStep);
    setActiveStep(activeStep - 1);
  };

  const handleSave = () => {
    setActiveStep(activeStep + 1);
  };

  const handleImage = (file, body) => {
    // send a photo to the server
    console.log(file);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("File", file);
    axios
      .post(BASE_URL_PARKINGLOTS_PHOTO_ADD + currentParkingLotId, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(`create photo!`);
        console.log(response);
        // TO-DO : isMain check
        setIsUploading(false);
        getInformationData(currentParkingLotId);
        // resize the image to display them to the user
        return resizeImage(file, body)
          .then((blob) => convertBlobToBinaryString(blob))
          .then((imageString) => {
            const imageBase64 = btoa(imageString);

            return setResizedFiles((prevState) => ({
              form: {
                ...prevState.form,
                images: [
                  {
                    ...file,
                    id: response.data.id, // save image id
                    type: "image/jpeg",
                    size: imageBase64.length,
                    body: imageBase64,
                  },
                  ...prevState.form.images,
                ],
              },
            }));
          });
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg("Failed to add parking lot image");
        setShowMsg(true);
      });
  };

  const updateImage = (image) => {
    console.log(image.id);
    console.log("Header: " + currentParkingLotId);
    axios
      .put(BASE_URL_PARKINGLOTS_PHOTO_UPDATE + currentParkingLotId + `/${image.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`deleted photo!`);
        console.log(response);
        setPhotoData(response.data.photos);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        if(err.response.data === "") {
          setSnackbarMsg("Unauthorized");
        } else {
          setSnackbarMsg(err.response.data)
        }   
        setShowMsg(true);
      });
  };
 

  const deleteImage = (image) => {
    console.log(image.id);
    console.log("Header: " + currentParkingLotId);
    axios
      .delete(
        BASE_URL_PARKINGLOTS_PHOTO_DELETE +
          currentParkingLotId +
          `/${image.id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(`deleted photo!`);
        console.log(response);
        setPhotoData(response.data.photos);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg(err.response.data);
        setShowMsg(true);
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <InformationForm 
            data={informationData}
            handlePost={handlePost}
            priceData={priceData}
            setPriceData={setPriceData}
            currentParkingId={currentParkingLotId}  />
        );
      case 1:
        return (
          <PhotoForm
            data={photoData}
            handleImage={handleImage}
            setResizedFiles={setResizedFiles}
            deleteImage={deleteImage}
            updateImage={updateImage}
            resizedFiles={resizedFiles}
            currentParkingId={currentParkingLotId}
            isUploading={isUploading}
            setAddMode={setAddMode}
            addMode={addMode}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  const handleBackToListing = () => {
    // Redirect
    history.push(`/listing/`);
  };

  const snackbarClose = () => {
    setShowMsg(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Post Your ParkingLot
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Your parking spot listing has been updated!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleBackToListing}
                  className={classes.button}
                >
                  Back to Listing
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      className={classes.button}
                      disabled={addMode}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
      <Snackbar open={showMsg} autoHideDuration={3000} onClose={snackbarClose}>
        <Alert severity={snackbarMsgType}>{snackbarMsg}</Alert>
      </Snackbar>
    </React.Fragment>
  );
}
