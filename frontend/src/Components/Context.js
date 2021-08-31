import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const myContext = createContext();

function Context(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:4000/user", { withCredentials: true })
      .then((res) => {
        console.log(res);
        setUser(res.data);
      });
  }, []);
  console.log(user);
  return <myContext.Provider value={user}>{props.children}</myContext.Provider>;
}

export default Context;
