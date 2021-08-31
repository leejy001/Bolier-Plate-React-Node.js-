import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { myContext } from "./Components/Context";
import Navbar from "./Components/Navbar";
import AdminPage from "./Pages/AdminPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import RegisterPage from "./Pages/RegisterPage";
import "./assets/css/main.css";

function App() {
  const ctx = useContext(myContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        {ctx ? (
          <>
            {ctx.isAdmin && <Route path="/admin" component={AdminPage} />}
            <Route path="/profile" component={ProfilePage} />
          </>
        ) : (
          <>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
