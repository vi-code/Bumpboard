import { Suspense } from "react";
import { NameForm } from "./components/NameForm";
import { Leaderboard } from "./components/Leaderboard";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-4 py-16">
      <header className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Baby Name
          </span>
        </h1>
        <p className="mt-3 text-lg text-purple-400">
          Suggest a name and see what&apos;s trending!
        </p>
      </header>

      <NameForm />

      <Suspense
        fallback={
          <div className="w-full max-w-md animate-pulse rounded-3xl bg-white/60 p-8 text-center">
            <p className="text-pink-300">Loading leaderboard...</p>
          </div>
        }
      >
        <Leaderboard />
      </Suspense>
    </main>
  );
}
