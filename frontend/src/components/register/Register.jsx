import "./register.css";
import { useState } from "react";
import axios from "axios";

import { Cancel, Room } from "@material-ui/icons";

export default function Register({ setShowRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = { username, email, password };
      const res = await axios.post("/api/auth/register", user);
      setSuccess(true);
      setTimeout(() => {
        setShowRegister(false);
      }, 1500);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="registerWrapper">
      <form className="registerForm" onSubmit={handelSubmit}>
        <div className="logo">
          <Room /> Pin
        </div>
        <label htmlFor="username" className="registerFormLabel">
          Username
        </label>
        <input
          type="text"
          className="registerFormInput"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email" className="registerFormLabel">
          Email
        </label>
        <input
          type="email"
          className="registerFormInput"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="registerFormLabel">
          Password
        </label>
        <input
          type="password"
          className="registerFormInput"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerSubmit" type="submit">
          register
        </button>
        {error && <span className="loginError">Some thing went wrong</span>}
        <Cancel className="closeForm" />
        {success && (
          <span className="loginSuccess">
            Register succsesffely, now you can login
          </span>
        )}
        <Cancel className="closeForm" onClick={() => setShowRegister(false)} />
      </form>
    </div>
  );
}
