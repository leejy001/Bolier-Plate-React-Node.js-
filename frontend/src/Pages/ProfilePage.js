import React, { useContext } from "react";
import { myContext } from "../Components/Context";

function ProfilePage() {
  const ctx = useContext(myContext);
  return (
    <div>
      <h1>Current Login User : {ctx.nickname}</h1>
    </div>
  );
}

export default ProfilePage;
