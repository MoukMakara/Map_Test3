import React, { useEffect, useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  Marker,
} from "@vis.gl/react-google-maps";

let radius = 10;

const locations = [
  {
    key: "T-Soccer",
    location: { lat: 11.58603815946927, lng: 104.90250606361631 },
  },
  { key: "Sony Sport Club", location: { lat: 11.5736576, lng: 104.9133056 } },
  { key: "Down Town Sport", location: { lat: 11.551841, lng: 104.900934 } },
  {
    key: "PhanRong Sport",
    location: { lat: 11.573727628331069, lng: 104.82179080969664 },
  },
  {
    key: "Happy Sports Cambodia",
    location: { lat: 11.53914874749284, lng: 104.85660960732177 },
  },
];

const formatDistance = (distance) => {
  return (distance / 1000).toFixed(2);
};

const App = () => (
  <APIProvider
    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    onLoad={() => console.log("Maps API has loaded.")}
  >
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: 11.578268759952971, lng: 104.90178553000196 }}
      mapId="a2b2fd561b553426"
      onCameraChanged={(ev) =>
        console.log(
          "camera changed:",
          ev.detail.center,
          "zoom:",
          ev.detail.zoom
        )
      }
    >
      {" "}
      <PoiMarkers pois={locations} />
    </Map>
  </APIProvider>
);

const PoiMarkers = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [filteredPois, setFilteredPois] = useState([]);

  // Get the current location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(userLocation);

          // Calculate distances to each poi
          const newDistances = {};
          const newFilteredPois = [];
          props.pois.forEach((poi) => {
            if (
              window.google &&
              window.google.maps &&
              window.google.maps.geometry
            ) {
              const poiLocation = new window.google.maps.LatLng(
                poi.location.lat,
                poi.location.lng
              );
              const userLatLng = new window.google.maps.LatLng(
                userLocation.lat,
                userLocation.lng
              );
              const distance =
                window.google.maps.geometry.spherical.computeDistanceBetween(
                  userLatLng,
                  poiLocation
                );
              newDistances[poi.key] = distance;

              // Filter POIs based on distance
              if (parseFloat(formatDistance(distance)) < radius) {
                newFilteredPois.push(poi);
              }
            } else {
              console.error("Google Maps API or geometry library not loaded.");
            }
          });
          setDistances(newDistances);
          setFilteredPois(newFilteredPois); // Set filtered POIs
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [props.pois]);

  return (
    <>
      {filteredPois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#FF0000"}
            glyphColor={"#C70039"}
            borderColor={"#ff5b5b"}
          />
        </AdvancedMarker>
      ))}
      {currentLocation && (
        <Marker
          key="current-location"
          position={currentLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          // label="You are here"
        />
      )}
      {currentLocation && (
        <div>
          {Object.entries(distances).map(
            ([key, distance]) =>
              formatDistance(distance) < radius && (
                <div key={key}>
                  <p>
                    Distance to {key}: {formatDistance(distance)} km
                  </p>
                </div>
              )
          )}
        </div>
      )}
    </>
  );
};

// root
const root = createRoot(document.getElementById("app"));
root.render(<App />);

export default App;