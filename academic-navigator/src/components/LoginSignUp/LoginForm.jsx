import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider"; // Assuming you have a context provider for state management

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserAuthenticated } = useStateContext(); // Context for handling authentication state

  const handleLogin = (e) => {
    e.preventDefault();
    // This is where you would add your login logic, e.g., API call to authenticate
    if (username === "test" && password === "password") {
      setUserAuthenticated(true); // Set user as authenticated
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } else {
      alert("Invalid username or password");
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/signup"); // Redirect to signup
  };

  return (
    <>
      <div className="background" />
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
