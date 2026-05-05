import { getLeaderboard } from "@/app/actions";

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
      <h2 className="mb-4 text-center text-xl font-bold text-purple-600">
        Top Names
      </h2>
      <ul className="space-y-2">
        {names.map((entry, index) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 px-5 py-3 transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="text-lg font-medium text-gray-700">{entry.name}</span>
            </div>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-600">
              {entry.count} {entry.count === 1 ? "vote" : "votes"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
