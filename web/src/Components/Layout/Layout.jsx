import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar"; // o "./navbar" según cómo esté escrito realmente

const Layout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="layout">
      {!hideNavbar && <NavBar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
