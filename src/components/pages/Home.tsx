"use client";

import React, { useEffect, useState } from "react";
import {
  contractAddress,
  contractAbi,
  SEPOLIA_NETWORK,
  SEPOLIA_NETWORK_CHAIN_ID,
} from "@/constants";
import * as ethers from "ethers";
import VoteForm from "@/components/organism/VoteForm";
import ConfirmationDialog from "@/components/organism/ConfirmationDialog";
import SwitchNetworkDialog from "@/components/organism/SwitchNetworkDialog";
import { toast } from "sonner";

const Home = () => {
  const [votes, setVotes] = useState<number[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwitchNetworkOpen, setIsSwitchNetworkOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);

  const handleCastVote = async () => {
    // Array of candidate IDs to vote for
    setIsSubmitting(true);
    const voteIds = votes;

    //@ts-expect-error window ethereum
    await window.ethereum.request({ method: "eth_requestAccounts" });

    //@ts-expect-error window ethereum
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("PROVIDER", provider, signer);

    // Create a contract instance with the signer
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      // Send the transaction
      const tx = await contract.vote(voteIds);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      setIsSubmitting(false);
      console.log("Transaction successful:", receipt);
    } catch (error: any) {
      console.log(error);
      setIsSubmitting(false);
      setIsConfirmationDialogOpen(false);
      toast.error(`${error.reason}`);
    }
  };

  const handleSwitchChain = async () => {
    try {
      //@ts-expect-error window ethereum
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_NETWORK_CHAIN_ID }], // chainId must be in hexadecimal format
      });
      setIsSwitchNetworkOpen(false);
      toast.success("Switched to Sepolia Network");
    } catch (error) {
      console.log("ERROR", error);
      setIsSwitchNetworkOpen(false);
    }
  };

  const handleSetNetwork = async () => {
    //@ts-expect-error window ethereum
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    setCurrentNetwork(network.name);
  };

  useEffect(() => {
    handleSetNetwork();
    //@ts-expect-error window ethereum

    if (window.ethereum) {
      //@ts-expect-error window ethereum
      window.ethereum.on("chainChanged", (chainId: string) => {
        console.log("Network changed to chainId:", chainId);
        // Call your function to update the network state
        handleSetNetwork();
      });

      // Clean up listener when component unmounts
      return () => {
        //@ts-expect-error window ethereum
        window.ethereum.removeListener("chainChanged", handleSetNetwork);
      };
    }
  }, []);

  useEffect(() => {
    if (!currentNetwork) return;

    if (currentNetwork !== SEPOLIA_NETWORK) {
      setIsSwitchNetworkOpen(true);
    }

    return setIsSwitchNetworkOpen(false);
  }, [currentNetwork]);

  return (
    <div className="px-10 top-20 py-10 max-w-[1200px] mx-auto">
      <p onClick={handleSwitchChain}>Switch</p>
      <VoteForm
        setIsConfirmationDialogOpen={setIsConfirmationDialogOpen}
        votes={votes}
        setVotes={setVotes}
      />
      <ConfirmationDialog
        votes={votes}
        isOpen={isConfirmationDialogOpen}
        setIsOpen={setIsConfirmationDialogOpen}
        handleCastVote={handleCastVote}
        isSubmitting={isSubmitting}
      />
      <SwitchNetworkDialog
        isOpen={isSwitchNetworkOpen}
        setIsOpen={setIsSwitchNetworkOpen}
        handleSwitchnetwork={handleSwitchChain}
      />
    </div>
  );
};

export default Home;
