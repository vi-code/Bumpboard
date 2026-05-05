import { getLeaderboard } from "@/app/actions";
import { LeaderboardItem } from "./LeaderboardItem";

export async function Leaderboard() {
  const names = await getLeaderboard();

  if (names.length === 0) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white/80 p-8 text-center shadow-lg backdrop-blur">
        <p className="text-lg text-pink-400">No suggestions yet — be the first!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-1 text-center text-xl font-bold text-purple-600">Top Names</h2>
      <p className="mb-4 text-center text-xs text-purple-400">
        Tap a name to see its meaning ✨
      </p>
      <ul className="space-y-2">
        {names.map((entry, index) => (
          <LeaderboardItem
            key={entry.id}
            name={entry.name}
            count={entry.count}
            rank={index + 1}
          />
        ))}
      </ul>
    </div>
  );
}
