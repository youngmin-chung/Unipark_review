import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import * as axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import Pica from "pica";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import ProfileForm from "./ProfileForm";
import DocumentForm from "./DocumentForm";
import VehicleForm from "./VehicleForm";
import PaymentCardForm from "./PaymentCardForm";
import {
  BASE_URL_GET_PROFILE,
  BASE_URL_PUT_PROFILE_DRIVER,
  BASE_URL_PUT_PROFILE_OWNER,
  BASE_URL_VEHICLE,
  BASE_URL_USER_DOCUMENT,
  BASE_URL_ACCOUNT_CHANGE_PASSWORD,
  BASE_URL_USER_PAYMENTCARD
} from "../constants";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    minHeight: '100vh',
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
  buttonBack: {
    display: "flex",
    justifyContent: "flex-start",
  },
  buttonSave: {
    display: "flex",
    justifyContent: "flex-end",
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

export default function MyAccount() {
  const history = useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [profileData, setProfileData] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [currentViewMode, setCurrentViewMode] = useState(0);
  const [steps, setSteps] = useState([
    "Profile",
    "Document",
    "Vehicle",
    "PaymentCard",
  ]);
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

  const token = JSON.parse(localStorage.getItem("token"));
  let currentUserMode = localStorage.getItem("currentMode");

  //fetching Data
  useEffect(() => {
    getProfileData();

    // if currentMode is driver
    if (currentUserMode == 0) {
      setSteps(["Profile", "Document", "Vehicle", "PaymentCard"]);
      getVehicleData();
      getPaymentData();
    } else {
      setSteps(["Profile", "Document"]);
    }
    setCurrentViewMode(currentUserMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snackbarClose = () => {
    setShowMsg(false);
  };

  const getVehicleData = () => {
    axios
      .get(BASE_URL_VEHICLE, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setVehicleData(response.data);
        console.log(response.data);
      });
  };

  const getPaymentData = () => {
    axios
      .get(BASE_URL_USER_PAYMENTCARD, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setPaymentData(response.data);
        console.log(response.data);
      });
  };

  const getProfileData = () => {
    axios
      .get(BASE_URL_GET_PROFILE, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setProfileData(response.data);
        setDocumentData(response.data.documents);
        console.log(response.data.documents);
        setCurrentViewMode(response.data.currentUserMode);
      });
  };

  const updateProfile = (values) => {
    let checkedURL =
      currentViewMode === 0
        ? BASE_URL_PUT_PROFILE_DRIVER
        : BASE_URL_PUT_PROFILE_OWNER;
    axios
      .put(checkedURL, values, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`updated user!`);
        console.log(response);
        getProfileData();
      });
  };

  const handlePasswordChange = (values) => {
    if (values.password !== values.confirmPassword) {
      setSnackbarMsgType("error");
      setSnackbarMsg("Password must be matched");
      setShowMsg(true);
    } else {
      axios
        .put(BASE_URL_ACCOUNT_CHANGE_PASSWORD + values.password, null, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setSnackbarMsgType("success");
          setSnackbarMsg(response.data);
          setShowMsg(true);
          getProfileData();
        })
        .catch((err) => {
          setSnackbarMsgType("error");
          setSnackbarMsg(err.response.data);
          setShowMsg(true);
        });
    }
  };

  const updateVehicle = (data) => {
    axios
      .put(BASE_URL_VEHICLE, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`update vehicle!`);
        console.log(response);
      });
  };

  const createVehicle = (data) => {
    axios
      .post(BASE_URL_VEHICLE, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`create vehicle!`);
        console.log(response);
      });
  };

  const updatePaymentCard = (data) => {
    axios
      .put(BASE_URL_USER_PAYMENTCARD, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`update payment card!`);
        console.log(response);
      });
  };

  const createPaymentCard = (data) => {
    axios
      .post(BASE_URL_USER_PAYMENTCARD, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`create payment card!`);
        console.log(response);
      });
  };

  const handleImage = (file, body) => {
    // send a document to the server
    console.log(file);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("File", file);
    axios
      .post(BASE_URL_USER_DOCUMENT, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(`create document!`);
        console.log(response);
        setIsUploading(false);
        updateProfile(profileData);

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

  const deleteImage = (image) => {
    console.log(image.id);
    axios
      .delete(BASE_URL_USER_DOCUMENT + `${image.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(`deleted document!`);
        console.log(response);
        updateProfile(profileData);
      })
      .catch((err) => {
        setSnackbarMsgType("error");
        setSnackbarMsg(err.response.data);
        setShowMsg(true);
      });
  };

  const handleNextToDocument = (values) => {
    setActiveStep(activeStep + 1);
    setProfileData(values);
  };

  const handleBackToProfile = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBackToHome = () => {
    history.push("/home");
  };

  const handleSaveAsOwner = () => {
    updateProfile(profileData);
    //reflect new user's view mode if any
    localStorage.setItem("currentMode", profileData.currentUserMode);
    setActiveStep(activeStep + 1);
  };

  const handleNextToVehicle = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNextToPayment = (values) => {
    setActiveStep(activeStep + 1);
    setVehicleData(values);
  };

  const handleUpdateAll = (values) => {
    setActiveStep(activeStep + 1);
    setPaymentData(values);
    //handle Save Data
    updateProfile(profileData);
    if(vehicleData.id)
    {
        updateVehicle(vehicleData);
    }
    else
    {
        createVehicle(vehicleData);
    }

    if(paymentData.id)
    {
        updatePaymentCard(values);
    }
    else
    {
        createPaymentCard(values);
    }

    //reflect new user's view mode if any
    localStorage.setItem("currentMode", profileData.currentUserMode);
  
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProfileForm
            data={profileData}
            handleNextToDocument={handleNextToDocument}
            handlePasswordChange={handlePasswordChange}
          />
        );
      case 1:
        return (
          <DocumentForm
            data={documentData}
            handleImage={handleImage}
            setResizedFiles={setResizedFiles}
            deleteImage={deleteImage}
            resizedFiles={resizedFiles}
            isUploading={isUploading}
            setAddMode={setAddMode}
            addMode={addMode}
            currentUserMode={currentUserMode}
            handleBackToProfile={handleBackToProfile}
            handleSaveAsOwner={handleSaveAsOwner}
            handleNextToVehicle={handleNextToVehicle}
          />
        );
      case 2:
        return (
          <VehicleForm
            data={vehicleData}
            setVehicleData={setVehicleData}
            handleNextToPayment={handleNextToPayment}
          />
        );
      case 3:
        return <PaymentCardForm
                data={paymentData}
                handleUpdateAll={handleUpdateAll}
               />;
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            My Account
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
                  Your profile has been updated!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleBackToHome}
                  className={classes.button}
                >
                  Back to Home
                </Button>
              </React.Fragment>
              
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                {activeStep == 0 && (
                  <div className={classes.buttonBack}>
                    <Button
                      onClick={handleBackToHome}
                      className={classes.button}
                    >
                      Back
                    </Button>
                  </div>
                )}
                {activeStep == 2 && currentUserMode == 0 && (
                  <div className={classes.buttonBack}>
                    <Button
                      className={classes.button}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>
                )}
                {activeStep == 3 && currentUserMode == 0 && (
                  <div className={classes.buttonBack}>
                    <Button
                      className={classes.button}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>
                )}
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
