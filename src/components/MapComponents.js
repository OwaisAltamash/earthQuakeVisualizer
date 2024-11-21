import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Function to determine color based on magnitude
const getMarkerColor = (magnitude) => {
  if (magnitude >= 6) return "red";    // Strong earthquakes
  if (magnitude >= 4) return "orange"; // Moderate earthquakes
  return "green";                      // Minor earthquakes
};

const MapComponents = ({ earthquakeData }) => {
  return (
    <MapContainer
      center={[20, 0]} // Centered on the world
      zoom={2}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {earthquakeData.map((quake) => {
        const [longitude, latitude] = quake.geometry.coordinates;
        const magnitude = quake.properties.mag;
        const color = getMarkerColor(magnitude);

        return (
          <Marker key={quake.id} position={[latitude, longitude]} icon={L.icon({ iconUrl: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png`, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41], className: `leaflet-div-icon ${color}` })}>
            <Popup>
              <b>Magnitude:</b> {magnitude} <br />
              <b>Location:</b> {quake.properties.place} <br />
              <b>Time:</b> {new Date(quake.properties.time).toLocaleString()} <br />
              <b>Depth:</b> {quake.geometry.coordinates[2]} km <br />
              <b>Country/Region:</b> {quake.properties.place} <br />
              {/* Add more details as needed */}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponents;
