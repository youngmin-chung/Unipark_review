import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "../Header/Header";
import Home from "../Home/Home";
import "./App.css";
import Footer from "../Footer/Footer";
import SearchParkingPage from "../ParkingPage/ParkingPage";
import ProtectedRouter from "../Auth/Protected"
import Register from  "../Auth/Register";
import Login from "../Auth/Login";
import Admin from "../Admin/Admin";
import AdminUserDetail from "../Admin/AdminUserDetail";
import MyAccount from "../MyAccount/MyAccount";
import Report from "../Report/Report";
import Reservartion from "../Reservation/Reservation";
import ListingParking from "../Listing/ListingParking";
import ListingParkingDetail from "../Listing/ListingParkingDetail";
import History from "../History/History";
import HistoryDetail from "../History/HistoryDetail";
import Payment from "../Payment/Payment";
import Reset from "../Auth/Reset";

function App() {

    // https://reactjs.org/docs/lifting-state-up.html
    const [usertoken, setUsertoken] = useState(null);
    return (
        <div className="App">
            <Router>
                    {/* <h1>Let's Build UniPark Front-End</h1> */}
                {/* Header */}
                <Header usertoken={usertoken}/>
                {/* Home */}
                <Switch>
                    <Route path="/search">
                        {/* Search Page */}
                        <SearchParkingPage />
                    </Route>
                    <Route exact path="/" render={(props) => <Login {...{setUsertoken, ...props}}/>} />
                    <Route exact path="/login" render={(props) => <Login {...{setUsertoken, ...props}}/>} />
                    <Route exact path="/register" render={(props) => <Register {...{setUsertoken, ...props}}/>} />
                    <Route exact path="/reset" render={(props) => <Reset {...{ setUsertoken, ...props }} />}/>
                    <ProtectedRouter exact path="/home" component ={Home}/>
                    <ProtectedRouter exact path="/admin" component ={Admin}/>
                    <ProtectedRouter exact path="/admin/:userId" component={AdminUserDetail}/>
                    <ProtectedRouter exact path="/report" component={Report} />
                    <ProtectedRouter exact path="/myaccount" component={MyAccount}/>
                    <ProtectedRouter exact path="/reservation/:parkingId" component={Reservartion}/>
                    <ProtectedRouter exact path="/listing" component={ListingParking}/>
                    <ProtectedRouter exact path="/listing/:parkingId" component={ListingParkingDetail}/>
                    <ProtectedRouter exact path="/history" component={History}/>
                    <ProtectedRouter exact path="/history/:reservationId" component={HistoryDetail}/>
                    <Route exact path="/payment" render={(props) => <Payment {...{ setUsertoken, ...props }} />}/>
                    {/* Banner */}
                    {/* Search */}
                    {/* Cards */}
                    {/* Footer */}
                </Switch>
                {/* ... */}
                <Footer />                
            </Router>
        </div>
    );
}

export default App;