"use client";

import { useEffect, useState } from "react";
import { getNameDetails, type NameDetails } from "@/app/actions";

const RANK_STYLES: Record<string, { bg: string; ring: string; label: string }> = {
  S: { bg: "bg-gradient-to-br from-amber-300 to-yellow-500", ring: "ring-amber-200", label: "Stellar" },
  A: { bg: "bg-gradient-to-br from-pink-400 to-rose-500", ring: "ring-pink-200", label: "Awesome" },
  B: { bg: "bg-gradient-to-br from-purple-400 to-indigo-500", ring: "ring-purple-200", label: "Bright" },
  C: { bg: "bg-gradient-to-br from-sky-400 to-cyan-500", ring: "ring-sky-200", label: "Cute" },
  D: { bg: "bg-gradient-to-br from-slate-400 to-slate-600", ring: "ring-slate-200", label: "Distinctive" },
};

type Props = {
  name: string;
  onClose: () => void;
};

export function NameModal({ name, onClose }: Props) {
  const [data, setData] = useState<NameDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getNameDetails(name).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error);
      else if (result.data) setData(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/30 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors hover:bg-pink-200"
        >
          ✕
        </button>

        <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 px-8 pb-6 pt-10 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {name}
            </span>
          </h2>
        </div>

        <div className="px-8 py-6">
          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {!data && !error && <LoadingSkeleton />}

          {data && (
            <div className="space-y-6">
              <div className="flex items-center justify-around gap-4">
                <RankBadge rank={data.rank} />
                <TrendinessGauge value={data.trendiness} />
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Meaning
                </h3>
                <p className="text-base leading-relaxed text-gray-700">{data.meaning}</p>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Fun Facts
                </h3>
                <ul className="space-y-2">
                  {data.funFacts.map((fact, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 text-sm leading-relaxed text-gray-700"
                    >
                      <span aria-hidden className="text-base">✨</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: string }) {
  const style = RANK_STYLES[rank] ?? RANK_STYLES.C;
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-white shadow-md ring-4 ${style.bg} ${style.ring}`}
      >
        {rank}
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
        {style.label}
      </span>
    </div>
  );
}

function TrendinessGauge({ value }: { value: number }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
          Trendiness
        </span>
        <span className="text-lg font-bold text-purple-600">{value}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-purple-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-around gap-4">
        <div className="h-20 w-16 animate-pulse rounded-2xl bg-purple-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-purple-100" />
          <div className="h-3 w-full animate-pulse rounded bg-purple-100" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-purple-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-purple-100" />
      </div>
      <p className="text-center text-sm text-pink-400">Discovering this name...</p>
    </div>
  );
}
