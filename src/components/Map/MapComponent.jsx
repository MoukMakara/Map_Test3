import React, { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import PointMarker from "./PointMarker";

const MapComponent = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const endPoint = import.meta.env.VITE_ALLMAP_URL;
  const apiUrl = `${baseUrl}${endPoint}`;
  const [radius, setRadius] = useState(10);
  const [clubs, setClubs] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchClubsAndLocations = async () => {
      try {
        let allClubs = [];
        let nextUrl = apiUrl;

        while (nextUrl) {
          const response = await fetch(nextUrl);
          const data = await response.json();
          allClubs = [...allClubs, ...data.results];
          nextUrl = data.next;
        }
        setClubs(allClubs);

        const fetchedLocations = allClubs.map((item) => ({
          key: item.sport_name,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          image: item.image,
          sport_name: item.sport_name,
          description: item.description,
          price: item.price,
          reviews: item.reviews,
          seat_number: item.seat_number,
          skill_level: item.skill_level,
          contact_info: item.contact_info,
        }));

        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClubsAndLocations();
  }, [apiUrl]);

  const formatDistance = (distance) => (distance / 1000).toFixed(2);

  return (
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
        <div className="flex items-center space-x-3 p-4">
          <input
            type="number"
            value={radius}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              setRadius(value >= 0 ? value : 0);
            }}
            step="0.1"
            min="0"
            className="border-2 border-gray-300 rounded-md text-center w-full py-3"
          />
          <label className="text-gray-700 text-center">Radius (km)</label>
        </div>
        <PointMarker
          pois={locations}
          radius={radius}
          formatDistance={formatDistance}
          clubs={clubs}
        />
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
