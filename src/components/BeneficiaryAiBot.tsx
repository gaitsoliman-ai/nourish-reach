import { useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useNima } from "@/context/NimaContext";
import type { Donation } from "@/context/NimaContext";
import { labelForCategory } from "@/lib/foodTaxonomy";

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function scoreDonation(d: Donation, tokens: string[]): number {
  if (d.status !== "AVAILABLE" || d.expiresAt <= Date.now()) return -1;
  const hay = [
    d.foodDescription,
    d.pickupArea,
    d.businessName,
    d.foodCategory ? labelForCategory(d.foodCategory) : "",
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (hay.includes(t)) score += 2;
  }
  if (tokens.some((t) => ["hot", "warm", "meal"].includes(t)) && /hot|rice|chicken|curry|cooked|meal/i.test(hay))
    score += 1;
  return score;
}

export function BeneficiaryAiBot() {
  const { donations } = useNima();
  const [fabOpen, setFabOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ role: "user" | "assistant"; text: string; hits?: Donation[] }[]>([]);

  const available = useMemo(
    () => donations.filter((d) => d.status === "AVAILABLE" && d.expiresAt > Date.now()),
    [donations]
  );

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const tokens = tokenize(trimmed);
    const scored = available
      .map((d) => ({ d, s: scoreDonation(d, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map((x) => x.d);

    setThread((t) => [
      ...t,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text:
          scored.length === 0
            ? "I didn't find a strong match in what's available right now. Try different words or scroll the list — new meals appear during the day."
            : `Here ${scored.length === 1 ? "is" : "are"} ${scored.length} option${scored.length === 1 ? "" : "s"} that might fit:`,
        hits: scored.length ? scored : undefined,
      },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setFabOpen(true)}
        className="fixed bottom-6 right-6 z-40 md:right-[max(1.5rem,calc(50%-11rem+1.5rem))] flex items-center gap-2 rounded-full bg-ai text-ai-foreground px-5 py-3.5 font-bold text-sm shadow-elevated ring-2 ring-white/80 hover:opacity-95 transition"
        aria-label="Ask Ni'ma AI"
      >
        <MessageCircle className="w-5 h-5" />
        Ask Ni'ma AI
      </button>

      {fabOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6 pointer-events-none">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            aria-label="Close chat"
            onClick={() => setFabOpen(false)}
          />
          <div className="pointer-events-auto relative w-full max-w-md max-h-[85vh] md:rounded-3xl rounded-t-3xl bg-card shadow-elevated flex flex-col overflow-hidden ring-1 ring-ai/20 mb-0 md:mb-0">
            <div className="flex items-center gap-2 px-4 py-3 bg-ai text-ai-foreground">
              <Bot className="w-5 h-5" />
              <span className="font-bold text-sm">Ask Ni'ma AI</span>
              <button
                type="button"
                onClick={() => setFabOpen(false)}
                className="ml-auto p-2 rounded-full hover:bg-white/15"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
              {thread.length === 0 && (
                <p className="text-sm text-muted-foreground px-1">
                  Try: “Any hot meals near Al Sadd?” or “bread Souq Waqif” — I'll search what's listed.
                </p>
              )}
              {thread.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-muted ml-6"
                        : "bg-ai/10 mr-6 border border-ai/15"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.hits && msg.hits.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {msg.hits.map((d) => (
                        <li
                          key={d.id}
                          className="text-xs rounded-xl bg-background/80 border border-border/80 p-3 shadow-soft"
                        >
                          <p className="font-semibold text-foreground">{d.foodDescription}</p>
                          <p className="text-muted-foreground mt-0.5">
                            {d.pickupArea} · {d.quantity}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about food near you…"
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai/40"
              />
              <button
                type="button"
                onClick={send}
                className="shrink-0 w-11 h-11 rounded-xl bg-ai text-ai-foreground flex items-center justify-center"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
