import React, { useState } from "react";
import googleImg from "../assets/googleImage.png";
import githubImg from "../assets/githubImage.png";
import "../assets/css/loginPage.css";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = () => {
    axios
      .post(
        "http://localhost:4000/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then(
        (res) => {
          if (res.data === "success") {
            window.location.href = "/";
          }
        },
        () => {
          console.log("Failure");
        }
      );
  };

  const googleLogin = () => {
    window.open("http://localhost:4000/auth/google", "_self");
  };

  const githubLogin = () => {
    window.open("http://localhost:4000/auth/github", "_self");
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <div className="login-form">
        <div className="google-login" onClick={googleLogin}>
          <img src={googleImg} alt="Google Icon" />
          <p>Login With Google</p>
        </div>
        <div className="github-login" onClick={githubLogin}>
          <img src={githubImg} alt="Github Icon" />
          <p>Login With Github</p>
        </div>
      </div>
      <input
        type="email"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
