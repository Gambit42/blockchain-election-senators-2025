import React from "react";
import SearchIcon from "@/components/icons/SearchIcon";

const Searchbar: React.FC<{
  setSearchFilter: (value: string) => void;
  searchFilter: string;
}> = ({ setSearchFilter, searchFilter }) => {
  return (
    <div className="font-poppins flex flex-row items-center justify-between px-4 gap-4 py-2 border rounded-md w-full max-w-[500px]">
      <div className="cursor-pointer">
        <SearchIcon />
      </div>
      <input
        value={searchFilter}
        className="bg-transparent outline-none  w-full"
        placeholder="Search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchFilter(e.target.value);
        }}
      />
    </div>
  );
};

export default Searchbar;
