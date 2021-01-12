import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Search from "../Search/Search";
import "./Banner.css";

function Banner() {
    const history = useHistory();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="banner">
            <div className="banner_search">
                {/* Click search dates button, date picker show/hide */}

                {showSearch && <Search />}
                <Button
                    onClick={() => setShowSearch(!showSearch)}
                    className="banner_searchButton"
                    variant="outlined"
                >
                    {showSearch ? "Hide" : "Search UniParking"}
                </Button>
            </div>
            {/* Banner information on the background image */}
            <div className="banner_info">
                <h1>Experience all new parking service</h1>
                <h3>Here comes Unipark</h3>
                <Button variant="outlined">
                    Find your space wherever you go...
                </Button>
            </div>
        </div>
    );
}

export default Banner;
