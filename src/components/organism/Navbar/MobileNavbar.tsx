"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { shortenEthAddress } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MENUS } from "@/constants";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const MobileNavbar = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);

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

  const handleCloseDrawer = () => {
    setIsMobileNavbarOpen(false);
  };

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
    <div className="flex flex-row items-center justify-between h-[64px] px-4 bg-[#FFFDFD] border-b border-gray-300 lg:hidden">
      <div className="flex flex-row items-center justify-center space-x-2">
        <Image width={30} height={30} src="/ph-flag.svg" alt="flag" />
        <h1 className="font-poppins">PH Senatorial Elections 2025</h1>
      </div>
      <div className="flex flex-row gap-4 items-center justify-center">
        <Drawer
          direction="left"
          open={isMobileNavbarOpen}
          onOpenChange={setIsMobileNavbarOpen}
        >
          <DrawerTrigger asChild>
            <Image width={26} height={32} src="/burger-icon.svg" alt="burger" />
          </DrawerTrigger>
          <DrawerContent className="top-0 outline-none w-full flex !mt-0 !rounded-[0px] !p-0 h-fit !z-[9999]">
            <div className="mx-auto w-screen bg-white">
              <DrawerHeader>
                <DrawerTitle className="flex flex-row justify-between w-full">
                  <div className="flex flex-row items-center justify-center space-x-2">
                    <Image
                      width={30}
                      height={30}
                      src="/ph-flag.svg"
                      alt="flag"
                    />
                    <h1 className="font-poppins">
                      PH Senatorial Elections 2025
                    </h1>
                  </div>
                  <Image
                    onClick={handleCloseDrawer}
                    width={20}
                    height={20}
                    src="/close-icon.svg"
                    alt="close-icon"
                    className="cursor-pointer"
                  />
                </DrawerTitle>
              </DrawerHeader>
              <div className="border-t">
                <div className="flex flex-col py-10 space-y-2 items-start p-4">
                  {MENUS.map((menu) => {
                    return (
                      <Link
                        key={menu.path}
                        href={menu.path}
                        onClick={handleCloseDrawer}
                        className={`font-poppins text-center `}
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
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default MobileNavbar;
