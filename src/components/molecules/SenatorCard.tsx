import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { MAX_VOTES } from "@/constants";

const partyColors: { [key: string]: string } = {
  "Partido Federal ng Pilipinas": "text-red-600",
  "Makabayang Koalisyon ng Mamamayan": "text-blue-600",
  Independent: "text-green-500",
  "Katipunan ng Nagkakaisang Pilipino": "text-green-600",
  "Kamalayang Kayumanggi (Katipunan)": "text-yellow-600",
  "Nationalist People’s Coalition": "text-purple-600",
  "PDP-Laban": "text-indigo-600",
  "Lakas-CMD": "text-teal-600",
  "Democratic Party of the Philippines": "text-orange-600",
  "Partido Pilipino sa Pagbabago": "text-cyan-600",
  "Nacionalista Party": "text-lime-600",
  "Bunyog Pagkakaisa Party": "text-pink-600",
  "Partido Lakas ng Masa": "text-emerald-600",
  "Partido Maharlika": "text-amber-600",
  "Partido Demokratiko Sosyalista ng Pilipinas": "text-fuchsia-600",
  "Reform PH People’s Party": "text-sky-600",
  "Kilusang Bagong Lipunan": "text-violet-600",
  "Aksyon Demokratiko": "text-stone-600",
  "Workers and Peasants Party": "text-orange-900",
  "Partido Federal Maharlika": "text-neutral-600",
  "Liberal Party of the Philippines": "text-zinc-600",
  WPP: "text-slate-600",
};
const SenatorCard: React.FC<{
  id: number;
  name: string;
  party: string;
  votes: number[];
  setVotes: Dispatch<SetStateAction<number[]>>;
}> = ({ id, name, party, votes, setVotes }) => {
  const textColor = partyColors[party] || "bg-gray-300"; // Default color if not found

  const handleVoteChange = (id: number) => {
    setVotes((prevVotes: number[]) => {
      if (prevVotes.includes(id)) {
        return prevVotes.filter((voteId) => voteId !== id);
      }

      if (prevVotes.length >= MAX_VOTES) {
        return prevVotes;
      }

      return [...prevVotes, id];
    });
  };

  const isSelected = votes.includes(id);

  return (
    <div
      className={`border-2 relative flex flex-row items-center justify-beteween w-full ${
        isSelected && "border-green-600"
      } max-w-[768px] mx-auto p-2 rounded-lg`}
    >
      <label
        htmlFor={`senator-${id}`}
        className="w-full h-full absolute top-0 left-0 cursor-pointer z-10"
      />
      <div className="flex flex-row w-full font-poppins space-x-2">
        <p className="font-medium text-xs mt-1">{`#${id} `}</p>
        <div>
          <h1>{name}</h1>
          <p className={`text-sm ${textColor}`}>{party}</p>
        </div>
      </div>
      <input
        id={`senator-${id}`} // Unique ID
        type="checkbox"
        name="senator"
        className="hidden"
        checked={votes.includes(id)}
        onChange={() => handleVoteChange(id)}
      />{" "}
      {isSelected && (
        <Image width={24} height={24} alt="" src="/completed.svg" />
      )}
    </div>
  );
};

export default SenatorCard;

{
  /* <div
  className={`relative ${
    votes.includes(id) ? "border-4 border-green-500" : ""
  } rounded-lg`}
>
  <Image
    width={200}
    height={200}
    src="/placeholders/camille-villar.jpg"
    alt={name}
    className={`rounded-md transition-opacity duration-300 ${
      votes.includes(id) ? "opacity-100" : "opacity-75 hover:opacity-100"
    }`}
  />

  {/* Checkmark overlay if voted */
}
//   {votes.includes(id) && (
// <div className="absolute top-2 right-2  text-white p-2 rounded-full text-sm">
//   ✅
// </div>
//   )}
// </div>; */}
