import React, { useState } from "react";
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

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
