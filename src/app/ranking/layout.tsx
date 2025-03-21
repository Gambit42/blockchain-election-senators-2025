import React from "react";
import Navbar from "@/components/organism/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#FFFDFD]">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
