"use client";

import { useState, useRef, useEffect } from "react";
import { API_URL } from "@/lib/config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: any;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Systems nominal. Ready to query payment data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // 2. Simulate "Thinking" Delay
    setTimeout(() => {
        let aiResponse: Message;

        // --- HARDCODED DEMO LOGIC ---
        if (input.toLowerCase().includes("failed") || input.toLowerCase().includes("transactions")) {
            aiResponse = {
                id: Date.now().toString(),
                role: "assistant",
                content: "I found 12 failures on HDFC in the last 2 minutes. The primary error code is 'TIMEOUT'.",
                sql: "SELECT count(*) as failures, error_code FROM transactions WHERE status='FAILED' AND gateway='HDFC' GROUP BY error_code;",
                data: {
                    label: "Revenue at Risk",
                    value: "₹45,200",
                    details: "Potential loss if not rerouted immediately."
                }
            };
        } else {
             aiResponse = {
                id: Date.now().toString(),
                role: "assistant",
                content: "I'm analyzing the live stream. Systems look healthy overall.",
                sql: "SELECT status, count(*) FROM logs WHERE timestamp > NOW() - INTERVAL '5 minutes';",
                data: {
                     label: "System Health",
                     value: "99.99%",
                     details: "All gateways operational."
                }
            };
        }
        // ---------------------------

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
    }, 1500); // 1.5s delay for realism
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg font-bold hover:scale-105 transition-all"
        >
          🤖 Query AI
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col border border-border bg-background shadow-2xl rounded-lg overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <span className="font-semibold">apeXpay Neural Link</span>
            <button onClick={() => setIsOpen(false)} className="text-xl font-bold">×</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/20 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  <p>{m.content}</p>
                  {/* SHOW SQL */}
                  {m.sql && (
                    <div className="mt-2 p-2 bg-black/10 rounded text-xs font-mono break-all border border-black/10">
                      <span className="text-xs font-bold opacity-50 block mb-1">GENERATED SQL:</span>
                      {m.sql}
                    </div>
                  )}
                   {/* SHOW DATA CARD */}
                  {m.data && (
                    <div className="mt-2 p-2 bg-background/50 rounded border border-border">
                        <div className="text-xs text-muted-foreground uppercase">{m.data.label}</div>
                        <div className="text-lg font-bold">{m.data.value}</div>
                        <div className="text-[10px] opacity-75">{m.data.details}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-muted-foreground animate-pulse ml-2">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-border bg-background flex gap-2">
            <input
              className="flex-1 bg-muted px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ask about failures..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm font-medium">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}