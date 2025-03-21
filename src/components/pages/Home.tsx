"use client";

import React, { useState } from "react";
import { contractAddress, contractAbi } from "@/constants";
import * as ethers from "ethers";
import VoteForm from "@/components/organism/VoteForm";
import ConfirmationDialog from "../organism/ConfirmationDialog";
import { toast } from "sonner";

const Home = () => {
  const [votes, setVotes] = useState<number[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="px-10 top-20 py-10 max-w-[1200px] mx-auto">
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
    </div>
  );
};

export default Home;
