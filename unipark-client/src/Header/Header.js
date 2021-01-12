import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import jwt from "jwt-decode";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EmojiTransportationOutlinedIcon from "@material-ui/icons/EmojiTransportationOutlined";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import home_logo from "../images/Unipark_logo_lower.PNG";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AssignmentIcon from "@material-ui/icons/Assignment";
import "./Header.css";

const Header = (props) => {
    const history = useHistory();
    //let userCurrentMode = JSON.parse(localStorage.getItem("currentMode"));

    function useComponentVisible(initialIsVisible) {
        const [isComponentVisible, setIsComponentVisible] = useState(
            initialIsVisible
        );
        const ref = useRef(null);

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsComponentVisible(false);
            } else {
                setIsComponentVisible(true);
            }
        };

        useEffect(() => {
            document.addEventListener("click", handleClickOutside, true);
            return () => {
                document.removeEventListener("click", handleClickOutside, true);
            };
        });

        return { ref, isComponentVisible, setIsComponentVisible };
    }
    const [open, setOpen] = useState(false);
    const [logout, setLogout] = useState(false);
    const { ref, isComponentVisible } = useComponentVisible(true);
    const [isSignIn, setIsSignIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [userCurrentMode, setUserCurrentMode] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            setIsSignIn(true);
            const user = jwt(localStorage.getItem("token"));
            console.log("Header: " + user.given_name);
            setUserName(user.given_name);
            if (user.role === "Admin") setIsAdminMode(true);
            else setIsAdminMode(false);

            setUserCurrentMode(JSON.parse(localStorage.getItem("currentMode")));
            console.log("From Header: " + userCurrentMode);
        }
    });

    // If logout is true, it will redirect to the login page
    function renderRedirect() {
        console.log("Value in Header: " + userName);
        if (logout) {
            setIsSignIn(false);
            localStorage.clear();
            return <Redirect to="/login" />;
        }
    }

    // If the user is not logged in or not signed up
    // if the user recently signed out, it will redirect to the login page
    return isSignIn === false && props.usertoken === null ? (
        <div className="site-navigation">
            {renderRedirect()}
            <Link to={"/"}>
                <img className="header_icon" src={home_logo} alt="" />
            </Link>
            <div className="menu-content-container">
                <ul className="ul">
                    <li onClick={() => history.push("/login")}>Login</li>
                    <li onClick={() => history.push("/register")}>Register</li>
                </ul>
            </div>
        </div>
    ) : (
        <div className="header">
            {renderRedirect()}

            {isAdminMode ? (
                <Link to="/admin">
                    <img className="header_icon" src={home_logo} alt="" />
                </Link>
            ) : (
                <Link to="/home">
                    <img className="header_icon" src={home_logo} alt="" />
                </Link>
            )}

            <div className="header_right">
                {/* <div className="round_border">
                <p onClick={() => history.push("/")}>
                    Become a parking owner
                </p>
            </div> */}
                <div className="round_border">
                    <p>Hello, {userName}</p>
                    <div className="container" ref={ref}>
                        <ExpandMoreIcon
                            onClick={() => setOpen(!open)}
                            type="button"
                            className="button"
                        />

                        {isComponentVisible && open && (
                            <div className="dropdown">
                                <ul className="ul">
                                    {/* setup route here  */}
                                    <li
                                        onClick={() =>
                                            history.push("/myaccount")
                                        }
                                    >
                                        My Account{" "}
                                        <span
                                            style={{
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <AccountBoxIcon />
                                        </span>
                                    </li>
                                    <li onClick={() => history.push("/report")}>
                                        Report{" "}
                                        <span
                                            style={{
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <AssignmentIcon />
                                        </span>
                                    </li>
                                    {isAdminMode == false && (
                                        <li
                                            onClick={() =>
                                                history.push("/history")
                                            }
                                        >
                                            History{" "}
                                            <span
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <CardTravelIcon />
                                            </span>
                                        </li>
                                    )}

                                    {/*if user's mode is parking owner, we will show Parking List ...
                  We can add more routes here for owner mode
                  */}
                                    {userCurrentMode === 1 && (
                                        <li
                                            className="li_bottom"
                                            onClick={() =>
                                                history.push("/listing")
                                            }
                                        >
                                            Listing{" "}
                                            <span
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <EmojiTransportationOutlinedIcon />
                                            </span>
                                        </li>
                                    )}
                                    <li
                                        onClick={() => {
                                            setLogout(true);
                                            // Refresh a page completely from the server
                                            window.location.reload(false);
                                        }}
                                    >
                                        Logout{" "}
                                        <span
                                            style={{
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <ExitToAppIcon />
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
