import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUserId } = useStateContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        // Successful login
        setUserId(data.user_id);
        navigate("/dashboard"); // Redirect to the dashboard
      } else if (data.error) {
        // Error response from the server
        setError(data.error);
      } else {
        setError("Unexpected error occurred.");
      }
    } catch (e) {
      setError("An error occurred while trying to log in."); // Handle unexpected errors
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <>
      <div className="background" />
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-box">
            <input
              type="text"
              placeholder="Username or Email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={handleRegisterClick}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
