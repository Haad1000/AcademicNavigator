import React, { useState } from "react";
import "./SignUpForm.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // This is where you would add your signup logic, e.g., API call to create a new user.
    // For demonstration purposes, we'll assume a successful signup when all fields are filled.
    if (username && email && password) {
      console.log("User signed up:", { username, email, password });
      alert("Signup successful!");
      navigate("/login"); // Redirect to login page after successful signup
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <div className="background" />
      <div className="wrapper">
        <form onSubmit={handleSignup}>
          <h1>Sign Up</h1>

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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
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

          <button type="submit">Sign Up</button>

          <div className="login-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => navigate("/login")}>
                Log In
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
