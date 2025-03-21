import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SwitchNetworkDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleSwitchnetwork: () => void;
}> = ({ isOpen, setIsOpen, handleSwitchnetwork }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are currently in the wrong network.</DialogTitle>
        </DialogHeader>
        <Button onClick={handleSwitchnetwork}>Switch Network</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchNetworkDialog;
