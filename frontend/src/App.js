import "./app.css";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";

import Login from "./components/login/Login";
import Register from "./components/register/Register";

function App() {
  const [pins, setPins] = useState([]);

  const [currentPopupId, setCurrentPopupId] = useState(null);
  const [newPinPosition, setNewPinPosition] = useState(null);

  const [newPinTitle, setNewPinTitle] = useState("");
  const [newPinDesc, setNewPinDesc] = useState("");
  const [newPinReview, setNewPinReview] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const myStorage = window.localStorage;
  const username = localStorage.getItem("user");

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 48.8566,
    longitude: 20.3522,
    zoom: 4,
  });

  //fetch  all pins
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get("/api/pin");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPins();
  }, []);

  const handelDblClick = (e) => {
    const [lng, lat] = e.lngLat;
    setNewPinPosition({ lat, lng });
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: username,
      title: newPinTitle,
      desc: newPinDesc,
      lat: newPinPosition.lat,
      lng: newPinPosition.lng,
      review: newPinReview,
    };
    try {
      const res = await axios.post("/api/pin", newPin);
      setPins([...pins, res.data]);
      setNewPinPosition(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handelMarkerClick = (id, lng, lat) => {
    setCurrentPopupId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  };

  const handelLogOut = () => {
    myStorage.removeItem("user");
  };

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onClick={(e) => handelDblClick(e)}
        transitionDuration={1000}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker longitude={pin.lng} latitude={pin.lat} anchor="bottom">
              <Room
                style={{
                  cursor: "pointer",
                  color: username === pin.username ? "blue" : "red",
                  fontSize: `${viewport.zoom * 10}px`,
                }}
                onClick={() => handelMarkerClick(pin._id, pin.lng, pin.lat)}
              />
            </Marker>
            {currentPopupId === pin._id && (
              <Popup
                longitude={pin.lng}
                latitude={pin.lat}
                anchor="left"
                onClose={() => setCurrentPopupId(null)}
              >
                <div className="popup-card">
                  <label className="popup-card-label">Place</label>
                  <div className="popup-card-text">{pin.title}</div>
                  <label className="popup-card-label">Review</label>
                  <div className="popup-card-text">{pin.desc}</div>
                  <label className="popup-card-label">Rating</label>
                  <div>{Array(pin.review).fill(<Star className="star" />)}</div>
                  <label className="popup-card-label">Information</label>
                  <div className="popup-card-text">
                    Created by <b> {pin.username} </b>,&nbsp;
                    <span className="date"> {format(pin.createdAt)}</span>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPinPosition && username && (
          <Popup
            longitude={newPinPosition.lng}
            latitude={newPinPosition.lat}
            anchor="left"
            onClose={() => setNewPinPosition(null)}
          >
            <form className="popup-card" onSubmit={handelSubmit}>
              <label className="popup-card-label">Place</label>
              <input
                className="popup-card-text-input"
                type="text"
                placeholder="Enter place name"
                onChange={(e) => setNewPinTitle(e.target.value)}
              />
              <label className="popup-card-label">Review</label>
              <textarea
                className="popup-card-textarea"
                placeholder="Enter description"
                onChange={(e) => setNewPinDesc(e.target.value)}
              ></textarea>
              <label className="popup-card-label">Rating</label>
              <select
                className="select"
                onChange={(e) => setNewPinReview(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="savePinButton">
                save
              </button>
            </form>
          </Popup>
        )}
        {username ? (
          <button className="button buttonLogout" onClick={handelLogOut}>
            logout
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button buttonLogin"
              onClick={() => setShowLogin(true)}
            >
              login
            </button>
            <button
              className="button buttonRegister"
              onClick={() => setShowRegister(true)}
            >
              register
            </button>
          </div>
        )}
        {showLogin && !username && (
          <Login myStorage={myStorage} setShowLogin={setShowLogin} />
        )}
        {showRegister && !username && (
          <Register setShowRegister={setShowRegister} />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
