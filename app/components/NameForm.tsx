"use client";

import { suggestName } from "@/app/actions";
import { useRef, useState, useTransition } from "react";

export function NameForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await suggestName(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Name suggested! Thank you!" });
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="name"
          placeholder="Enter a baby name..."
          maxLength={50}
          required
          disabled={isPending}
          className="flex-1 rounded-full border-2 border-pink-200 bg-white px-5 py-3 text-lg text-gray-700 placeholder-pink-300 shadow-sm transition-all focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all hover:from-pink-500 hover:to-purple-500 hover:shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isPending ? "..." : "Suggest!"}
        </button>
      </div>
      {message && (
        <p
          className={`text-center text-sm font-medium ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
