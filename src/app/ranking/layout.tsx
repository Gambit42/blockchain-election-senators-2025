import React from "react";
import Navbar from "@/components/organism/Navbar";
import Footer from "@/components/organism/Footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#FFFDFD]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
