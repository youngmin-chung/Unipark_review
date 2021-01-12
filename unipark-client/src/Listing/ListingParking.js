import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../theme";
import ListingParkingCard from "./ListingParkingCard";
import "./Listing.css";

function ListingParking() {
  return (
    <div className="listing_parking">
      <MuiThemeProvider theme={theme}>
        <ListingParkingCard />
      </MuiThemeProvider>
    </div>
  );
}

export default ListingParking;
