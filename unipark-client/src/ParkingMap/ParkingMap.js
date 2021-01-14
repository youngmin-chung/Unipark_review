import React, { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./ParkingMap.css";
import Icon from "../images/marker.svg";

import { useLocation } from "react-router-dom";
//import { render } from "@testing-library/react";

// create a marker here
const Marker = ({ children }) => children;

const ParkingMap = (props) => {
    const location = useLocation();

    // map setup
    const mapRef = useRef();
    const [zoom, setZoom] = useState(10);
    const [bounds, setBounds] = useState(null);

    const availableLots = location.state.data;

    const points = availableLots.map((lots) => ({
        type: "Feature",
        properties: {
            clusters: false,
            lotId: lots.id,
            address: lots.address,
        },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(lots.longitude),
                parseFloat(lots.latitude),
            ],
        },
    }));

    // get clusters
    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 75, maxZoom: 20 },
    });

    // render map

    return (
        <div style={{ height: "90vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "GOOGLE_MAP_API_KEY_HERE",
                }}
                // SEARCH ADDRESS'S LAT & LON HERE
                defaultCenter={{
                    lat: location.state.data[0].latitude,
                    lng: location.state.data[0].longitude,
                }}
                defaultZoom={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map }) => {
                    mapRef.current = map;
                }}
                // in case of users move the map
                onChange={({ zoom, bounds }) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat,
                    ]);
                }}
            >
                {clusters.map((cluster) => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount,
                    } = cluster.properties;

                    if (isCluster) {
                        return (
                            <Marker
                                key={cluster.id}
                                lat={latitude}
                                lng={longitude}
                            >
                                <div
                                    className="cluster-marker"
                                    style={{
                                        width: `${
                                            10 +
                                            (pointCount / points.length) * 30
                                        }px`,
                                        height: `${
                                            10 +
                                            (pointCount / points.length) * 30
                                        }px`,
                                    }}
                                    onClick={() => {
                                        const expensionZoom = Math.min(
                                            supercluster.getClusterExpansionZoom(
                                                cluster.id
                                            ),
                                            20
                                        );
                                        mapRef.current.setZoom(expensionZoom);
                                        mapRef.current.panTo({
                                            lat: latitude,
                                            lng: longitude,
                                        });
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    }
                    return (
                        <Marker
                            key={cluster.properties.lotId}
                            lat={latitude}
                            lng={longitude}
                            onClick={() => {}}
                            // icon={{
                            //   url: `/location.svg`,
                            //   //scaledSize: new window.google.maps.Size(25, 25),
                            // }}
                            title={cluster.properties.address}
                        >
                            <button
                                className="lot-marker"
                                // Change here to link to detail page
                                // onClick={() => {
                                //   history.push({
                                //   pathname: "/detailsPage",
                                // });
                                // }}
                            >
                                <img
                                    title={cluster.properties.address}
                                    alt="cluster"
                                    src={Icon}
                                />
                            </button>
                        </Marker>
                    );
                })}
            </GoogleMapReact>
        </div>
    );
};
export default ParkingMap;
