import React, { useEffect, useState } from "react";
import "./ParkingPage.css";
import { Button } from "@material-ui/core";
import SearchResult from "../SearchResult/SearchResult";
import ParkingMap from "../ParkingMap/ParkingMap";
import { useHistory, useLocation } from "react-router-dom";
import { BASE_URL_PARKINGLOTS } from "../constants";
import * as axios from "axios";

const ParkingPage = (props) => {
    const location = useLocation();
    const history = useHistory();
    const [showResults, setShowResults] = useState(false);
    const onClick = () => setShowResults(true);

    return (
        <div className="searchParkingPage row">
            <div className="column left">
                <div className="searchParkingPage_info">
                    {/* <p> {location.state.data.length} space(s)</p> */}
                    <div className="search_row">
                        <h1>
                            Search result | {location.state.data.length}{" "}
                            space(s) found
                        </h1>
                        <Button
                            onClick={() => history.push("/home")}
                            variant="outlined"
                        >
                            Cancellation
                        </Button>
                    </div>
                    <div className="showmap_btn">
                        <Button variant="outlined" onClick={onClick}>
                            Show Map
                        </Button>
                    </div>
                </div>

                {location.state.data.map((item, key) => (
                    <SearchResult
                        key={key}
                        id={item.id}
                        img={item.photoUrl}
                        location={item.address + ", " + item.city}
                        title={item.title}
                        description={item.description}
                        star={item.user.ranking}
                        price={item.price.pricePerHour}
                    />
                ))}
            </div>
            <div className="column right searchOnMap">
                {showResults ? <ParkingMap data={location.state.data} /> : null}
            </div>
        </div>
    );
};

export default ParkingPage;
