export const shortenEthAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const handleGetVotePercentage = (
  totalVotes: number,
  senatorVote: number
) => {
  if (totalVotes === 0) return 0; // Prevent division by zero
  return (senatorVote / totalVotes) * 100;
};
