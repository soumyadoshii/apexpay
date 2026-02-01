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

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sql: data.sql,
        data: data.data, // This passes the raw data to be shown if needed
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: "err", role: "assistant", content: "Connection to Brain lost." }]);
    } finally {
      setIsLoading(false);
    }
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
                  {/* SHOW SQL IF AVAILABLE */}
                  {m.sql && (
                    <div className="mt-2 p-2 bg-black/10 rounded text-xs font-mono break-all border border-black/10">
                      <span className="text-xs font-bold opacity-50 block mb-1">GENERATED SQL:</span>
                      {m.sql}
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
              placeholder="Ask about HDFC failures..."
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