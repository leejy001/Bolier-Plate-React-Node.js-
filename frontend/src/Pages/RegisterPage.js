import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    console.log("register");
    axios
      .post(
        "http://localhost:4000/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      )
      .then(
        (res) => {
          if (res.data === "success") {
            window.location.href = "/login";
          }
        },
        () => {
          console.log("register failure");
        }
      );
  };
  return (
    <div>
      <h1>Register</h1>
      <h6>username</h6>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <h6>email</h6>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <h6>password</h6>
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default RegisterPage;
