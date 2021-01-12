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

import { PhotoUploadWidget } from "./PhotoUploadWidget";

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
    margin: theme.spacing(1),
  },
}));

const PhotoForm = (props) => {
  const classes = useStyles();
  const { data } = props;

  const [photoList, setPhotoList] = useState([]);

  useEffect(() => {
    console.log("PhotoForm photos: " + JSON.stringify(data));
    if (data) {
      setPhotoList(data);
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

  return (
    <React.Fragment>
      <div className="parking_lot_photo">
        <Typography variant="h6" gutterBottom>
          Parking Lot Photos
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
                Add Photo
              </Button>
            )}
          </span>
        </Typography>
      </div>

      <Grid container spacing={3}>
        {props.addMode ? (
          <PhotoUploadWidget
            parkingId={props.currentParkingId}
            handleImage={props.handleImage}
            // deleteImageInAddMode={props.deleteImageInAddMode}
            resizedFiles={props.resizedFiles}
            isUploading={props.isUploading}
          />
        ) : (
          photoList.length > 0 &&
          photoList.map((image) => (
            <Grid item xs={12} sm={6} key={image.id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardMedia className={classes.photo} image={image.url} />
                </CardActionArea>
                {image.isMain == true ? (
                  <div className={classes.buttons}>
                    <Typography className={classes.button}>
                      Main Photo
                    </Typography>
                    <Button
                      size="small"
                      color="secondary"
                      className={classes.button}
                      onClick={() => props.deleteImage(image)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className={classes.buttons}>
                    <Button
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={() => props.updateImage(image)}
                    >
                      Set Main
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      className={classes.button}
                      onClick={() => props.deleteImage(image)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PhotoForm;
