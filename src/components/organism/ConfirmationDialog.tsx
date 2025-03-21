import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SENATORIAL_CANDIDATES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  votes: number[];
  setIsOpen: (value: boolean) => void;
  handleCastVote: () => void;
  isSubmitting: boolean;
}> = ({ votes, isOpen, setIsOpen, handleCastVote, isSubmitting }) => {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedSenators = SENATORIAL_CANDIDATES.filter(({ id }) =>
    votes.includes(id)
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your vote?</DialogTitle>
          <div>
            {selectedSenators.map((senator) => (
              <div key={senator.id}>
                <span>{`#${senator.id} ${senator.name}`}</span>
              </div>
            ))}
          </div>
        </DialogHeader>
        <Button onClick={handleCastVote}>
          {isSubmitting ? (
            <div className="flex flex-row gap-2 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <p>Submitting</p>
            </div>
          ) : (
            <p>Confirm Vote</p>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
