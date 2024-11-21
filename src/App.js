import React, { useEffect, useState } from "react";
// import MapComponent from "./components/MapComponent";
import axios from "axios";
import './index.css';
import MapComponents from "./components/MapComponents";

const App = () => {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [magnitudeFilter, setMagnitudeFilter] = useState("");
  const [depthFilter, setDepthFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState(24); // Default to last 24 hours

  // Fetch earthquake data from USGS
  const fetchEarthquakeData = async () => {
    try {
      const response = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      setEarthquakeData(response.data.features);
      setFilteredData(response.data.features);
    } catch (error) {
      setError("Failed to fetch earthquake data. Please try again later.");
      console.error("Error fetching earthquake data:", error);
    }
  };

  // Polling every 30 seconds for new data
  useEffect(() => {
    fetchEarthquakeData();
    const intervalId = setInterval(fetchEarthquakeData, 30000); // 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Filter earthquake data based on selected criteria
  useEffect(() => {
    const filtered = earthquakeData.filter((quake) => {
      const magnitudeCondition =
        magnitudeFilter === "" || quake.properties.mag >= magnitudeFilter;
      const depthCondition =
        depthFilter === "" || quake.geometry.coordinates[2] >= depthFilter;
      const timeCondition =
        (Date.now() - quake.properties.time) / (1000 * 3600) <= timeFilter;

      return magnitudeCondition && depthCondition && timeCondition;
    });
    setFilteredData(filtered);
  }, [magnitudeFilter, depthFilter, timeFilter, earthquakeData]);

  return (
    <div>
      <h1 className="header">Earthquake Visualizer</h1>
      {error && <div className="error">{error}</div>}

      {/* Filters Section */}
      <div className="filters">
        <label>
          Minimum Magnitude:
          <input
            type="number"
            min="0"
            max="10"
            value={magnitudeFilter}
            onChange={(e) => setMagnitudeFilter(e.target.value)}
            placeholder="Enter magnitude"
          />
        </label>
        <label>
          Minimum Depth (km):
          <input
            type="number"
            min="0"
            value={depthFilter}
            onChange={(e) => setDepthFilter(e.target.value)}
            placeholder="Enter depth"
          />
        </label>
        <label>
          Time Range (hours):
          <input
            type="number"
            min="1"
            value={timeFilter}
            onChange={(e) => setTimeFilter(Number(e.target.value))}
            placeholder="Enter time range"
          />
        </label>
      </div>

      {/* Map Component */}
      <MapComponents earthquakeData={filteredData} />
    </div>
  );
};

export default App;
