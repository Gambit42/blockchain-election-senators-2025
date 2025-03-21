import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import SenatorCard from "@/components/molecules/SenatorCard";
import { SENATORIAL_CANDIDATES, PARTY_OPTIONS } from "@/constants";
import { Button } from "@/components/ui/button";
import Searchbar from "../molecules/SearchBar";
import PartyListerFilter from "@/components/molecules/PartyListFilter";

const VoteForm: React.FC<{
  votes: number[];
  setVotes: Dispatch<SetStateAction<number[]>>;
  setIsConfirmationDialogOpen: (value: boolean) => void;
}> = ({ setIsConfirmationDialogOpen, votes, setVotes }) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [partyList, setPartyList] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const filteredSenators = SENATORIAL_CANDIDATES.filter(({ name }) =>
    name.toLowerCase().includes(searchFilter.toLowerCase())
  ).filter(
    ({ party }) =>
      partyList === "All" ||
      party.toLowerCase().includes(partyList.toLowerCase())
  );

  const senatorialCandidates = filteredSenators.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const NUMBER_OF_PAGES = Math.ceil(filteredSenators.length / PAGE_SIZE);

  const handleNextPage = () => {
    if (currentPage >= NUMBER_OF_PAGES) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          setIsConfirmationDialogOpen(true);
        }}
      >
        <div className="flex flex-row items-center justify-between w-full pb-4">
          <div>
            <h1 className="font-poppin font-bold text-4xl">
              Senatorial Candidates <br />
            </h1>
            <p className="font-light text-lg">{`You have voted ${votes.length} / 12 Senators`}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between w-full pb-4 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center justify-center h-full space-x-2 space-y-4 md:space-y-0">
            <Searchbar
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />
            <PartyListerFilter
              value={`${partyList}`}
              setValue={setPartyList}
              label="Show"
              options={PARTY_OPTIONS}
            />
          </div>
          <Button type="submit" disabled={votes.length === 0}>
            Cast Vote
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!senatorialCandidates?.length ? (
            <p className="font-poppins italic">No results found.</p>
          ) : (
            senatorialCandidates.map((senator) => (
              <SenatorCard
                key={senator.id}
                id={senator.id}
                name={senator.name}
                party={senator.party}
                votes={votes}
                setVotes={setVotes}
              />
            ))
          )}
        </div>
      </form>
      <div className="flex flex-row items-center justify-center gap-4 font-poppins my-10">
        <button
          className="text-xl cursor-pointer"
          onClick={handlePrevPage}
        >{`<`}</button>
        {Array.from({ length: NUMBER_OF_PAGES }).map((_, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === currentPage;
          return (
            <div
              key={index}
              className={`${
                isActive ? "bg-red-500 text-white" : ""
              } w-[30px] h-[40px]  flex items-center justify-center rounded-sm cursor-pointer`}
              onClick={() => {
                setCurrentPage(pageNumber);
              }}
            >
              <h1>{`${index + 1}`}</h1>
            </div>
          );
        })}
        <button
          className="text-xl cursor-pointer"
          onClick={handleNextPage}
        >{`>`}</button>
      </div>
    </div>
  );
};

export default VoteForm;
