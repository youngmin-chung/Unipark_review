import React from "react";
import "./SearchResult.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Ratings from "react-ratings-declarative";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

function SearchResult({ id, img, location, title, description, star, price }) {
    const history = useHistory();
    return (
        <div className="searchResult">
            <img src={img} alt="" />
            <FavoriteBorderIcon className="searchResult_heart" />

            <div className="searchResult_info">
                <div className="searchResult_infoTop">
                    <p>{location}</p>
                    <h3>{title}</h3>
                    <p>_________________</p>
                    <p>{description}</p>
                </div>

                <div className="searchResult_infoBottom">
                    <div className="searchResult_stars">
                        <Ratings
                            rating={star}
                            widgetDimensions="40px"
                            widgetSpacings="15px"
                        >
                            <Ratings.Widget widgetRatedColor="green" />
                            <Ratings.Widget widgetRatedColor="green" />
                            <Ratings.Widget widgetRatedColor="green" />
                            <Ratings.Widget widgetRatedColor="green" />
                            <Ratings.Widget widgetRatedColor="green" />
                        </Ratings>
                        <p>
                            <strong>{star}</strong>
                        </p>
                    </div>
                    <div className="reservation_btn">
                        <Button
                            variant="outlined"
                            onClick={() => history.push("/reservation/" + id)}
                        >
                            Reservation
                        </Button>
                    </div>
                    <h3>${price}/hour</h3>
                </div>
            </div>
        </div>
    );
}

export default SearchResult;
