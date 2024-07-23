import React, { useEffect, useState } from "react";
import { AdvancedMarker, Pin, Marker } from "@vis.gl/react-google-maps";

const PointMarker = ({ pois, radius, formatDistance }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [filteredPois, setFilteredPois] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(userLocation);

          const newDistances = {};
          const newFilteredPois = [];
          pois.forEach((poi) => {
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

              if (parseFloat(formatDistance(distance)) < radius) {
                newFilteredPois.push(poi);
              }
            } else {
              console.error("Google Maps API or geometry library not loaded.");
            }
          });
          setDistances(newDistances);
          setFilteredPois(newFilteredPois);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [pois, radius, formatDistance]);

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
              parseFloat(formatDistance(distance)) < radius && (
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

export default PointMarker;
