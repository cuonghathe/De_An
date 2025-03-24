import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../pages/Admin/Admin_header/Admin_header";

const AdminTemplate = () => {
  return (
    <div>
      <AdminHeader />
      <Outlet />
    </div>
  );
};

export default AdminTemplate;
