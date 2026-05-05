"use client";

import { useState } from "react";
import { NameModal } from "./NameModal";

type Props = {
  name: string;
  count: number;
  rank: number;
};

export function LeaderboardItem({ name, count, rank }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <li>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 px-5 py-3 text-left transition-all hover:scale-[1.02] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-sm font-bold text-white">
              {rank}
            </span>
            <span className="text-lg font-medium text-gray-700">{name}</span>
          </div>
          <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-600">
            {count} {count === 1 ? "vote" : "votes"}
          </span>
        </button>
      </li>
      {open && <NameModal name={name} onClose={() => setOpen(false)} />}
    </>
  );
}
