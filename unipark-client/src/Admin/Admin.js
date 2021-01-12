import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../theme";
import AdminUserCard from "../Admin/AdminUserCard"
import "./Admin.css";
import ImageModal from "../Modal/ImageModal";


function Admin() {

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="admin">

        <MuiThemeProvider theme={theme}>
            <AdminUserCard setSelectedImage={setSelectedImage} />
            {selectedImage && <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>}       
        </MuiThemeProvider>

    </div>
  );
}

export default Admin;
