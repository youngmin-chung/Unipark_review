import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../theme";
import AdminUserDetailCard from "./AdminUserDetailCard"
import "./Admin.css";
import ImageModal from "../Modal/ImageModal";

const AdminUserDetail = (props) => {

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="admin">
        <MuiThemeProvider theme={theme}>
            <AdminUserDetailCard setSelectedImage={setSelectedImage} userId={props.match.params.userId} />
            {selectedImage && <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>}     
        </MuiThemeProvider>
    </div>
  );
}

export default AdminUserDetail;
