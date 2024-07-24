import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const poi = location.state;

  if (!poi) {
    return <div>Page not found</div>;
  }

  const hasContactInfo =
    poi.contact_info && Object.values(poi.contact_info).some((value) => value);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-4xl mx-auto p-8 border border-gray-300 rounded-lg shadow-lg bg-white mt-64 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {poi.sport_name}
        </h2>
        <img
          src={poi.image}
          alt={poi.sport_name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-base text-gray-800 mb-4">{poi.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p className="text-base text-gray-800">
            <strong>Price:</strong> {poi.price}
          </p>
          <p className="text-base text-gray-800">
            <strong>Reviews:</strong> {poi.reviews}
          </p>
          <p className="text-base text-gray-800">
            <strong>Seat Number:</strong> {poi.seat_number}
          </p>
          <p className="text-base text-gray-800">
            <strong>Skill Level:</strong> {poi.skill_level}
          </p>
        </div>
        {hasContactInfo && (
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Contact Information
            </h3>
            <ul className="list-none p-0 space-y-2">
              {Object.entries(poi.contact_info).map(([key, value]) =>
                value ? (
                  <li key={key} className="text-base text-gray-800">
                    <strong className="text-gray-900">{key}:</strong> {value}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
