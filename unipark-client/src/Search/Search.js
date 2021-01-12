import React, { useReducer, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";
import Geocode from "react-geocode";
import { getDistance } from "geolib";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { BASE_URL_PARKINGLOTS } from "../constants";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyAIBhxRjnp2GKDwb6TEk94p-FvUR8j2T4Y");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

const Search = () => {
  const initialState = {
    address: "",
    parkinglots: [],
    addressLat: 0,
    addressLong: 0,
    availableLots: [], //applicable lots
  };
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const addressHandler = (e) => {
    setState({ address: e.target.value });
  };
  const compareLots = async () => {
    state.availableLots = [];
    if (state.address === "") {
      alert("Address field can not be empty!");
    } else {
      try {
        if (endDate.getTime() - startDate.getTime() < 3600000) {
          alert("You must book 1 hour more than the start time at least!");
        } else {
          Geocode.fromAddress(state.address).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              setState(((state.addressLat = lat), (state.addressLong = lng)));
              state.parkinglots.forEach((lot) => {
                // get the distance between target address and db addresses

                let distance = getDistance(
                  { latitude: state.addressLat, longitude: state.addressLong },
                  { latitude: lot.latitude, longitude: lot.longitude }
                );
                if (
                  // only looking for the distance within 5km
                  distance <= 5000 &&
                  new Date(startDate).getHours() >=
                    new Date(lot.dateTimeIn).getHours() &&
                  new Date(endDate).getHours() <
                    new Date(lot.dateTimeOut).getHours() &&
                  lot.isAvailable === true
                ) {
                  // push the available addresses to the array
                  setState(
                    (state.availableLots = state.availableLots.concat(lot))
                  );
                }
              });
              if (state.availableLots.length > 0) {
                history.push({
                  pathname: "/search",
                  //data: state.availableLots,
                  state: { data: state.availableLots },
                });
                state.availableLots.forEach((e) => {
                  console.log("Available addresses: " + e.address);
                  // ready to pass to the result page
                }); // available addresses here
              } else {
                alert("Can not find available parking areas near you!");
                setState({ address: "" });
              }
            },
            (error) => {
              alert("Can not find available parking areas near you!");
              console.error(error);
            }
          );
        }
      } catch (e) {
        alert("Can not find available parking areas near you!");
      }
    }
  };
  const fetchParkingLots = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer ");

    try {
      let response = await fetch(BASE_URL_PARKINGLOTS, {
        method: "GET",
        headers: myHeaders,
      });

      if (response.status === 401) {
        alert("Search failed, please try it again!");
        throw new Error(response.status);
      } else {
        let json = await response.json();
        setState({
          parkinglots: json,
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    } // endTry
  };

  return (
    <div className="Search">
      <div className="header_center">
        <input
          autoFocus
          type="text"
          placeholder="eg.1001 Fanshawe College Blvd"
          value={state.address}
          onChange={addressHandler}
        />
        <SearchIcon />
      </div>
      <div className="date_picker">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Start Time"
            margin="normal"
            minDate={new Date()}
            variant="outlined"
            required
            value={startDate}
            onChange={setStartDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="date_picker">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="End Time"
            margin="normal"
            minDate={new Date(startDate)}
            maxDate={new Date(startDate)}
            variant="outlined"
            required
            value={endDate}
            onChange={setEndDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
      <Button onClick={compareLots}>Set time for your space</Button>
    </div>
  );
};

export default Search;
