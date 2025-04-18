import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="layout-container">
      {/* Solo mostramos el fondo si hay sidebar */}
      {!hideNavbar && <div className="background-decorator" />}

      {!hideNavbar && <Sidebar />}
      <main className={hideNavbar ? "main-no-sidebar" : "main-with-sidebar"}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
