import React from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";

import { PhotoWidgetDropzone } from "./PhotoWidgetDropzone";

export const PhotoUploadWidget = (props) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography>Drop Photo below</Typography>
          <PhotoWidgetDropzone onUpload={props.handleImage} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Preview Photo</Typography>
          {props.isUploading && <CircularProgress />}
          {props.resizedFiles.form !== undefined &&
            props.resizedFiles.form.images.map((image, index) => (
              <div key={index}>
                <img alt="" src={`data:${image.type};base64,${image.body}`} />
                {/* <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => props.deleteImageInAddMode(image, index)}
                      >
                        Cancel
                      </Button> */}
              </div>
            ))}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
