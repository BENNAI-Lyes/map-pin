import "./app.css";
import { useRef, useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room } from "@material-ui/icons";

function App() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div>
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={-100} latitude={40} anchor="bottom">
          <Room scale={7} />
        </Marker>
        {showPopup && (
          <Popup
            longitude={-100}
            latitude={40}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
          >
            You are here
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default App;
