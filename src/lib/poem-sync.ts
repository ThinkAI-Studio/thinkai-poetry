import type { PoemStatus } from "@/types/database";

export const POEM_SYNC_CHANNEL = "poetic-sync-event";

export type PoemSyncMessage =
  | { type: "POEM_VISIBILITY_CHANGED"; poemId: string; status: PoemStatus }
  | { type: "POEMS_MUTATED" };

export function broadcastPoemSync(message: PoemSyncMessage) {
  if (typeof window === "undefined") return;

  // 1. BroadcastChannel API for modern browsers (instant 0ms delivery across tabs)
  try {
    const channel = new BroadcastChannel(POEM_SYNC_CHANNEL);
    channel.postMessage(message);
    channel.close();
  } catch {}

  // 2. LocalStorage event for cross-tab fallback
  try {
    localStorage.setItem(
      "poetic_sync_timestamp",
      JSON.stringify({ ...message, timestamp: Date.now() })
    );
  } catch {}
}
