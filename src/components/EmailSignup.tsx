"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <div className="pt-4"> {/* Reduced padding to sit nicely under the text */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-zinc-400 transition-all outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </form>
      
      {status === "success" && (
        <p className="mt-3 text-xs font-medium text-green-600">You're on the list. I'll be in touch.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs font-medium text-red-500">Something went wrong. Try again?</p>
      )}
    </div>
  );
}