"use client";

import React, { useEffect, useState } from "react";
import { contractAddress } from "@/constants";
import { SENATORIAL_CANDIDATES } from "@/constants";
import { multicall } from "@wagmi/core";
import { config } from "@/config/wagmi";
import { parseAbi } from "viem";
import { sepolia } from "@wagmi/core/chains";
import { handleGetVotePercentage } from "@/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";
import { Senator } from "@/types";

const partyColors: { [key: string]: string } = {
  "Partido Federal ng Pilipinas": "bg-red-600",
  "Makabayang Koalisyon ng Mamamayan": "bg-blue-600",
  Independent: "bg-green-500",
  "Katipunan ng Nagkakaisang Pilipino": "bg-green-600",
  "Kamalayang Kayumanggi (Katipunan)": "bg-yellow-600",
  "Nationalist People’s Coalition": "bg-purple-600",
  "PDP-Laban": "bg-indigo-600",
  "Lakas-CMD": "bg-teal-600",
  "Democratic Party of the Philippines": "bg-orange-600",
  "Partido Pilipino sa Pagbabago": "bg-cyan-600",
  "Nacionalista Party": "bg-lime-600",
  "Bunyog Pagkakaisa Party": "bg-pink-600",
  "Partido Lakas ng Masa": "bg-emerald-600",
  "Partido Maharlika": "bg-amber-600",
  "Partido Demokratiko Sosyalista ng Pilipinas": "bg-fuchsia-600",
  "Reform PH People’s Party": "bg-sky-600",
  "Kilusang Bagong Lipunan": "bg-violet-600",
  "Aksyon Demokratiko": "bg-stone-600",
  "Workers and Peasants Party": "bg-orange-900",
  "Partido Federal Maharlika": "bg-neutral-600",
  "Liberal Party of the Philippines": "bg-zinc-600",
  WPP: "bg-slate-600",
};

const RankingTable = () => {
  const PAGE_SIZE = 12;

  const [ranking, setRanking] = useState<Senator[]>([]);
  const [sortedRank, setSortedRank] = useState<Senator[]>([]);
  const totalVotes = ranking.reduce((acc, val) => acc + val.vote, 0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE); // Rows per page
  const [pageIndex, setPageIndex] = useState(0); // Current page
  const [isLoading, setIsLoading] = useState(true);

  const NUMBER_OF_PAGES = Math.ceil(sortedRank.length / PAGE_SIZE);
  const handleGetRanking = async () => {
    try {
      setIsLoading(true);
      const abi = parseAbi([
        "function senatorIdToVotes(uint256) view returns (uint256)",
      ]);

      const results = await multicall(config, {
        chainId: sepolia.id, // Explicitly tell it to use Sepolia
        contracts: SENATORIAL_CANDIDATES.map((senator) => ({
          address: contractAddress,
          abi: abi,
          functionName: "senatorIdToVotes",
          args: [senator.id],
        })),
      });

      const voteArray = SENATORIAL_CANDIDATES.map((senator, index) => {
        return { ...senator, vote: Number(results[index].result) };
      });

      const sortedVoteArray = voteArray.sort((a, b) => b.vote - a.vote);

      setRanking(sortedVoteArray);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRanking();
  }, []);

  const handleSortRank = (leaderboards: Senator[]) => {
    let currentRank = 1;
    const rankedLeaderboards = leaderboards.map((user, index) => {
      const previousUserPoints = leaderboards[index - 1]?.vote;
      const isLowerRank = user?.vote < previousUserPoints;

      if (isLowerRank) {
        currentRank = index + 1;
      }

      const percentage = handleGetVotePercentage(totalVotes, user?.vote);
      return {
        ...user,
        rank: currentRank,
        percentage,
      };
    });

    setSortedRank(rankedLeaderboards.filter(({ vote }) => vote !== 0));
  };

  useEffect(() => {
    handleSortRank(ranking);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [ranking]);

  const columns: ColumnDef<Senator>[] = [
    {
      accessorKey: "id",
      header: "#",
      meta: { size: "20px" },
      cell: ({ row }) => (
        <div className="!shrink-0 flex flex-row gap-2 font-poppins">
          <h1 className="">{row.original.rank}</h1>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { size: "30px" },
      cell: ({ row }) => (
        <div className="!shrink-0 flex flex-col gap-2 font-poppins">
          <h1 className="lg:leading-[10px] font-medium">{row.original.name}</h1>
          <p className="font-lightlg:leading-[20px] ">{row.original.party}</p>
        </div>
      ),
    },
    {
      accessorKey: "percentage",
      header: "Percentage",
      meta: { size: "200px" },
      cell: ({ row }) => {
        const textColor = partyColors[row.original.party] || "bg-gray-300"; // Default color if not found

        return (
          <div className="flex flex-row items-center justify-end gap-4">
            <div
              className={`h-[10px] rounded-full ${textColor} flex`}
              style={{
                width: `${row.original.percentage}%`,
              }}
            />
            {row.original.percentage && (
              <h1 className="font-poppins">{`${row.original.percentage.toFixed(
                2
              )}%`}</h1>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "vote",
      header: "Votes",
      meta: { size: "30px" },
      cell: ({ row }) => (
        <div className="!shrink-0 flex flex-row gap-2 font-poppins items-end justify-end">
          <h1 className="">{row.original.vote}</h1>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data: sortedRank,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div className="max-w-[1024px] mx-auto py-10 w-full">
      <h1 className="text-left w-full font-bold text-2xl">
        Senatorial Rankings
      </h1>
      <p className="font-poppins text-xs italic">
        First page shows the top 12 candidates
      </p>
      <table className="w-full my-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isFirstTwoHeaders = [0, 1].includes(index);
                return (
                  <th
                    key={header.id}
                    className={`${
                      isFirstTwoHeaders ? "text-left" : "text-right"
                    } table-${
                      header.id
                    } h-[50px] bg-[#F1F3F4] dark:bg-[#262C36] px-2`}
                    style={{
                      //@ts-expect-error meta is dynamic
                      width: header.column.columnDef.meta?.size || "auto",
                    }}
                  >
                    <div className="font-light">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading
            ? table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className={` border-b`}>
                    {row.getVisibleCells().map((cell, index) => {
                      const isFirstTwo = [0, 1].includes(index);
                      return (
                        <td
                          key={cell.id}
                          className={`min-h-[100px] lg:h-[70px] ${
                            isFirstTwo ? "text-left" : "text-right"
                          } px-2`}
                        >
                          <Skeleton className="w-full h-[40px] bg-gray-100" />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            : table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={` border-b min-h-[100px] lg:h-[70px]`}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFirstTwo = [0, 1].includes(index);
                      return (
                        <td
                          key={cell.id}
                          className={`h-full ${
                            isFirstTwo ? "text-left" : "text-right"
                          } px-2`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
        </tbody>
      </table>

      <div className="flex flex-row items-center justify-center gap-4 font-poppins my-10">
        <button
          className="text-xl cursor-pointer"
          onClick={() => {
            table.previousPage();
          }}
        >{`<`}</button>
        {Array.from({ length: NUMBER_OF_PAGES }).map((_, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === pageIndex + 1;
          return (
            <div
              key={index}
              className={`${
                isActive ? "bg-red-500 text-white" : ""
              } w-[30px] h-[40px]  flex items-center justify-center rounded-sm cursor-pointer`}
              onClick={() => {
                setPageIndex(index);
              }}
            >
              <h1>{`${index + 1}`}</h1>
            </div>
          );
        })}
        <button
          className="text-xl cursor-pointer"
          onClick={() => {
            table.nextPage();
          }}
        >{`>`}</button>
      </div>
    </div>
  );
};

export default RankingTable;
