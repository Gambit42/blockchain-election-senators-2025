"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { shortenEthAddress } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENUS } from "@/constants";

const DesktopNavbar = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const pathname = usePathname();

  async function connectWallet() {
    //@ts-expect-error window ethereum
    if (typeof window.ethereum !== "undefined") {
      try {
        //@ts-expect-error window ethereum
        const result = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("EY", result);

        setWallet(result[0]);
        localStorage.setItem("walletAddress", result[0]); // Save to localStorage
        console.log("MetaMask is connected");
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  }

  async function disconnectWallet() {
    try {
      setWallet(null); // Clear wallet state
      localStorage.removeItem("walletAddress"); // Remove from localStorage
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWallet(savedWallet);
    }
  }, []);

  return (
    <div className="hidden lg:flex flex-row items-center justify-between h-[64px] px-4 bg-[#FFFDFD] border-b border-gray-300">
      <Link
        href="/"
        className="flex flex-row items-center justify-center space-x-2"
      >
        <Image width={30} height={30} src="/ph-flag.svg" alt="flag" />
        <h1 className="font-poppins">PH Senatorial Elections 2025</h1>
      </Link>
      <div className="flex flex-row gap-4 items-center justify-center">
        {MENUS.map((menu) => {
          const isActive = menu.path === pathname;
          return (
            <Link
              key={menu.path}
              href={menu.path}
              className={`font-poppins ${
                isActive ? "font-medium" : "font-light"
              }`}
            >
              {menu.label}
            </Link>
          );
        })}
        {!wallet ? (
          <Button onClick={connectWallet}>Conenct Wallet</Button>
        ) : (
          <Button onClick={disconnectWallet}>
            {shortenEthAddress(wallet)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
