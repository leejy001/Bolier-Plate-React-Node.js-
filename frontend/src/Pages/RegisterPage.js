import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [checkname, setCheckName] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usingEmail, setUsingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [inputNumber, setInputNumber] = useState("");

  const checkName = () => {
    axios
      .post(
        "http://localhost:4000/checkname",
        { nickname: username },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data === "success") {
          alert("사용 가능한 Name입니다.");
          setCheckName(true);
        }
        if (res.data === "fail") {
          alert("다른 Name을 입력해주세요");
        }
      });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:4000/sendemail",
        { email },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        setNumber(res.data);
      });
  };

  const checkNumber = (e) => {
    e.preventDefault();
    console.log("number :", number, "input :", inputNumber);
    console.log(typeof number, typeof inputNumber);
    if (number === Number(inputNumber)) {
      setUsingEmail(true);
      alert("인증 성공");
    } else {
      alert("인증 실패");
    }
  };

  const register = () => {
    if (checkname === true) {
      if (usingEmail === true) {
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
      } else {
        alert("이메일 인증을 진행해주세요.");
      }
    } else {
      alert("nickName을 확인해주세요.");
    }
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
      <button onClick={checkName}>중복 확인</button>
      <h6>email</h6>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendEmail}>이메일 인증</button>
      <input
        type="text"
        placeholder="인증번호"
        onChange={(e) => setInputNumber(e.target.value)}
      />
      <button onClick={checkNumber}>확인</button>
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
