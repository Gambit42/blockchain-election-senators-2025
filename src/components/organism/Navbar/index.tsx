import React from "react";
import DesktopNavbar from "@/components/organism/Navbar/DesktopNavbar";
import MobileNavbar from "@/components/organism/Navbar/MobileNavbar";

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

export default Navbar;
