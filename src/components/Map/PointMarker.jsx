import React, { useEffect, useState } from "react";
import { Marker } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router-dom";

const PointMarker = ({ pois, radius, formatDistance }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [filteredPois, setFilteredPois] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [hoveredPoi, setHoveredPoi] = useState(null);
  const navigate = useNavigate();

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
                poi.latitude,
                poi.longitude
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

  const handleMarkerClick = (poi) => {
    setSelectedPoi(poi);
  };

  const handleClosePopUp = () => {
    setSelectedPoi(null);
  };

  return (
    <>
      {filteredPois.map((poi) => (
        <Marker
          key={poi.id}
          position={{ lat: poi.latitude, lng: poi.longitude }}
          onClick={() => handleMarkerClick(poi)}
          icon={{
            url: `http://maps.google.com/mapfiles/ms/icons/${
              hoveredPoi === poi.key ? "orange" : "red"
            }-dot.png`,
            scaledSize: new window.google.maps.Size(
              hoveredPoi === poi.key ? 40 : 32, 
              hoveredPoi === poi.key ? 40 : 32 
            ),
          }}
          label={{
            text: poi.sport_name,
            color: "black",
            fontSize: "9px",
          }}
        />
      ))}
      {currentLocation && (
        <Marker
          key="current-location"
          position={currentLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      )}

      {/* Pop-Up Card */}
      {selectedPoi && (
        <div
          className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "10px",
            width: "300px",
          }}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleClosePopUp}
          >
            &times;
          </button>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {selectedPoi.sport_name}
          </h3>
          <img
            src={selectedPoi.image}
            alt={selectedPoi.sport_name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <p className="text-sm text-gray-600 mb-3">
            Distance: {formatDistance(distances[selectedPoi.key])} km
          </p>
        </div>
      )}

      {/* Card Display */}
      {currentLocation && (
        <div className="p-4">
          {filteredPois.map((poi) => (
            <div
              key={poi.key}
              className="p-4 bg-white border h-[200px] border-gray-200 rounded-lg shadow-lg flex flex-row space-x-4 cursor-pointer mb-5"
              onMouseEnter={() => setHoveredPoi(poi.key)}
              onMouseLeave={() => setHoveredPoi(null)}
              onClick={() => {
                console.log("Navigating to detail with POI:", poi.key); // Debugging line
                navigate("/detailPage", { state: poi });
              }}
            >
              <img
                src={poi.image}
                alt={poi.sport_name}
                className="w-48 h-full object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {poi.sport_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {poi.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                    <p>Price: {poi.price}</p>
                    <p>Reviews: {poi.reviews}</p>
                    <p>Seat Number: {poi.seat_number}</p>
                    <p>Skill Level: {poi.skill_level}</p>
                    <p>Distance: {formatDistance(distances[poi.key])} km</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PointMarker;
