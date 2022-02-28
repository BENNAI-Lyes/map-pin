import "./login.css";
import { useRef, useState } from "react";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";

export default function Login({ myStorage, setShowLogin }) {
  const username = useRef();
  const password = useRef();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username.current.value,
      password: password.current.value,
    };
    try {
      const res = await axios.post("/api/auth/login", user);
      myStorage.setItem("user", res.data.username);
      setSuccess(true);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="loginWrapper">
      <form className="loginForm" onSubmit={handelSubmit}>
        <div className="logo">
          <Room /> Pin
        </div>
        <label htmlFor="username" className="loginFormLabel">
          Username
        </label>
        <input type="text" className="loginFormInput" ref={username} />
        <label htmlFor="password" className="loginFormLabel">
          Password
        </label>
        <input type="password" className="loginFormInput" ref={password} />
        <button className="loginSubmit" type="submit">
          Login
        </button>
        {error && <span className="loginError">Some thing went wrong</span>}
        <Cancel className="closeForm" />
        {success && (
          <span className="loginSuccess">
            Register succsesffely, now you can login
          </span>
        )}
        <Cancel className="closeForm" onClick={() => setShowLogin(false)} />
      </form>
    </div>
  );
}
