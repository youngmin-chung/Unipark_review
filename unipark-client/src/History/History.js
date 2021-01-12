import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../theme";
import HistoryCard from "./HistoryCard"
import "./History.css";


function History() {


  return (
    <div className="history">
        <MuiThemeProvider theme={theme}>
            <HistoryCard />  
        </MuiThemeProvider>
    </div>
  );
}

export default History;
