import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send } from "lucide-react";
import { parseDonationIntent } from "@/lib/donationIntent";
import type { FoodCategory } from "@/lib/foodTaxonomy";
import { labelForCategory } from "@/lib/foodTaxonomy";

export interface DonorCreatePrefillState {
  desc: string;
  qty: string;
  category: FoodCategory;
  pickupArea?: string;
}

export function DonorAiBot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    {
      role: "assistant",
      text: "Tell me what you're sharing — for example: “I have 10 portions of pasta near Al Sadd.” I'll open the form with details filled in.",
    },
  ]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");

    const parsed = parseDonationIntent(trimmed);
    if (!parsed) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "I couldn't parse that yet. Try mentioning a quantity and food type, e.g. “20 portions of rice and chicken.”",
        },
      ]);
      return;
    }

    const prefill: DonorCreatePrefillState = {
      desc: parsed.desc,
      qty: parsed.qty,
      category: parsed.category,
      pickupArea: parsed.pickupArea,
    };

    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: `Got it — ${parsed.qty}, ${labelForCategory(parsed.category)}. Opening the donation form with this filled in. You can adjust anything before posting.`,
      },
    ]);

    navigate("/donor/create", { state: { aiPrefill: prefill } });
  };

  return (
    <div className="mx-5 mb-4 rounded-2xl overflow-hidden shadow-soft ring-1 ring-ai/25 bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-ai text-ai-foreground text-left"
      >
        <Bot className="w-5 h-5 shrink-0" />
        <span className="font-bold text-sm">Ni'ma assistant</span>
        <span className="ml-auto text-xs opacity-90">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="p-3 flex flex-col gap-2 max-h-64">
          <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-muted ml-4 text-foreground"
                    : "bg-ai/10 text-foreground mr-4 border border-ai/20"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="e.g. I have 10 portions of pasta to donate"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai/40"
            />
            <button
              type="button"
              onClick={send}
              className="shrink-0 w-11 h-11 rounded-xl bg-ai text-ai-foreground flex items-center justify-center shadow-soft"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
