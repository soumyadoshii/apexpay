"use client";

import { useState } from "react";
import { PageHeader } from "./page-header";
import { Filter, Download } from "lucide-react";

export function AuditTrails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // --- HARDCODED LOGS ---
  const logs = [
    { id: 1, timestamp: new Date().toISOString(), action_type: "REROUTE_EXECUTION", log_text: "Traffic shifted from HDFC to Razorpay. Latency > 2000ms detected." },
    { id: 2, timestamp: new Date(Date.now() - 50000).toISOString(), action_type: "DECISION_ENGINE", log_text: "HDFC failure rate exceeded 5%. Initiating failover protocol." },
    { id: 3, timestamp: new Date(Date.now() - 120000).toISOString(), action_type: "ANOMALY_DETECTED", log_text: "Unusual spike in timeout errors on SBI Gateway." },
    { id: 4, timestamp: new Date(Date.now() - 300000).toISOString(), action_type: "SYSTEM_CHECK", log_text: "All backup routes (Stripe, Razorpay) are healthy." },
    { id: 5, timestamp: new Date(Date.now() - 600000).toISOString(), action_type: "SHADOW_MODE", log_text: "Simulated switch to PayU. Projected cost increase: 0.1%." },
  ];
  // ---------------------

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.log_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Audit Trails" 
        description="Immutable logs of all autonomous decisions"
        lastUpdated={new Date()}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
            />
        </div>
        <button className="flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted rounded-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="border border-border bg-card rounded-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/40 text-xs font-medium uppercase text-muted-foreground">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-3">Action Type</div>
          <div className="col-span-6">Details</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-4 border-b border-border px-4 py-4 text-sm last:border-0 hover:bg-muted/10 transition-colors">
                <div className="col-span-3 font-mono text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="col-span-3">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${log.action_type.includes("REROUTE") ? "bg-green-100 text-green-700" : 
                      log.action_type.includes("ANOMALY") ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"}`}>
                    {log.action_type}
                  </span>
                </div>
                <div className="col-span-6 text-foreground/90">
                  {log.log_text}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}