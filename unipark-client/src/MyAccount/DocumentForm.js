import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  Button,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";

import { PhotoUploadWidget } from "../Listing/ParkingLotAddForms/PhotoUploadWidget";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  photo: {
    height: 140,
  },
  button: {
    margin: theme.spacing(2)
  },
}));

const DocumentForm = (props) => {
  const classes = useStyles();
  const { data } = props;

  const [documentList, setDocumentList] = useState([]);

  useEffect(() => {
    console.log("DocumentForm documents: " + JSON.stringify(data));
    if (data) {
        setDocumentList(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleDoneButton = () => {
    props.setAddMode(false);
    // reset
    props.setResizedFiles({
      form: {
        images: [],
      },
    });
  };

  const handleBackToProfile = (e) => {
    e.preventDefault();
    props.handleBackToProfile();
  }

  const handleNextToVehicle = (e) => {
    e.preventDefault();
    props.handleNextToVehicle();
  }


  return (
    <React.Fragment>
      <div className="parking_lot_photo">
        <Typography variant="h6" gutterBottom>
          User Documents
          <span className="photo_add_button">
            {props.addMode ? (
              <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={handleDoneButton}
              >
                Done
              </Button>
            ) : (
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                onClick={() => props.setAddMode(true)}
              >
                Add Document
              </Button>
            )}
          </span>
        </Typography>
      </div>

      <Grid container spacing={3}>
        {props.addMode ? (
          <PhotoUploadWidget
            userId={props.userId}
            handleImage={props.handleImage}
            // deleteImageInAddMode={props.deleteImageInAddMode}
            resizedFiles={props.resizedFiles}
            isUploading={props.isUploading}
          />
        ) : (
          documentList.length > 0 &&
          documentList.map((image) => (
            <Grid item xs={12} sm={6} key={image.id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia className={classes.photo} image={image.url} />
                </CardActionArea>
                <div className={classes.buttons}>
                  <Button
                    size="small"
                    color="secondary"
                    className={classes.button}
                    onClick={() => props.deleteImage(image)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <div className={classes.buttons}>
            <Button
                onClick={handleBackToProfile}
                className={classes.button}
            >
                Back
            </Button>
            {props.currentUserMode == 0 ? (
                <Button
                variant="contained"
                color="primary"
                onClick={handleNextToVehicle}
                disabled={props.addMode}
                className={classes.button}
                >
                    Next
                </Button>
            ):(
            <Button
                variant="contained"
                color="primary"
                onClick={props.handleSaveAsOwner}
                className={classes.button}
                disabled={props.addMode}
                >
                    Save
                </Button>
            ) }
            
        </div>
    </React.Fragment>
  );
};

export default DocumentForm;
