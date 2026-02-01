"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "./page-header";
import { Filter, Download } from "lucide-react";
import { API_URL } from "@/lib/config";

interface AuditLog {
  id: number;
  timestamp: string;
  action_type: string;
  log_text: string;
  metadata_json: string;
}

export function AuditTrails() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fetch Real Data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_URL}/audit/logs`);
        if (res.ok) setLogs(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  // Client-Side Filtering (Restored)
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.log_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || log.action_type === filterType;
    return matchesSearch && matchesType;
  });

  // CSV Export (Restored)
  const exportToCSV = () => {
    const headers = ["Timestamp", "Action Type", "Details"];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.action_type,
      log.log_text.replace(/,/g, " ") // escape commas
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apeXpay_audit_logs.csv";
    a.click();
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Audit Trails" 
        description="Immutable logs of all autonomous decisions"
        lastUpdated={new Date()}
      />

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-border bg-background px-3 py-2 text-sm rounded-sm"
          >
            <option value="all">All Actions</option>
            <option value="REROUTE_EXECUTION">Reroutes</option>
            <option value="NL_SQL_QUERY">AI Queries</option>
            <option value="SHADOW_MODE">Shadow Mode</option>
          </select>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted rounded-sm transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-border bg-card rounded-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/40 text-xs font-medium uppercase text-muted-foreground">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-3">Action Type</div>
          <div className="col-span-6">Details</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No logs match your search.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-4 border-b border-border px-4 py-4 text-sm last:border-0 hover:bg-muted/10 transition-colors">
                <div className="col-span-3 font-mono text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="col-span-3">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${log.action_type.includes("REROUTE") ? "bg-green-100 text-green-700" : 
                      log.action_type.includes("SHADOW") ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"}`}>
                    {log.action_type}
                  </span>
                </div>
                <div className="col-span-6 text-foreground/90">
                  {log.log_text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}