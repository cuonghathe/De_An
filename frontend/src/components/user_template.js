import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";

const UserTemplate = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default UserTemplate;
