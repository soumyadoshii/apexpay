"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "./page-header";
import { API_URL } from "@/lib/config";
import { Activity, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle } from "lucide-react";

interface Stats {
  total_transactions: number;
  success_rate: number;
  active_incidents: number;
  routing_table: Record<string, string>;
}

interface Log {
  id: number;
  timestamp: string;
  action_type: string;
  log_text: string;
}

export function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stats
        const statsRes = await fetch(`${API_URL}/stats`);
        if (statsRes.ok) setStats(await statsRes.json());

        // Fetch Logs for "Recent Activity"
        const logsRes = await fetch(`${API_URL}/audit/logs`);
        if (logsRes.ok) {
          const data = await logsRes.json();
          setRecentLogs(data.slice(0, 5)); // Keep top 5
        }
        setLastUpdate(new Date());
      } catch (e) {
        console.error("Backend offline");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (bank: string) => {
    if (!stats) return "bg-gray-300";
    const route = stats.routing_table[bank];
    return route?.includes("REROUTED") ? "bg-red-500" : "bg-green-500";
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        description="Real-time metrics from apeXpay Engine"
        lastUpdated={lastUpdate}
      />

      {/* METRIC CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-border bg-card p-6 rounded-sm hover:border-primary transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats ? stats.total_transactions.toLocaleString() : "..."}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> +12% from yesterday
          </p>
        </div>

        <div className="border border-border bg-card p-6 rounded-sm hover:border-primary transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={`text-2xl font-bold ${stats && stats.success_rate < 98 ? "text-red-500" : "text-green-500"}`}>
            {stats ? stats.success_rate : "..."}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Target: 99.9%</p>
        </div>

        <div className={`border p-6 rounded-sm transition-all ${stats?.active_incidents ? "bg-red-50 border-red-200" : "bg-card border-border"}`}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Incidents</span>
            <AlertTriangle className={`h-4 w-4 ${stats?.active_incidents ? "text-red-500" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-2xl font-bold ${stats?.active_incidents ? "text-red-600" : "text-foreground"}`}>
            {stats ? stats.active_incidents : "0"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats?.active_incidents ? "⚠️ OUTAGE DETECTED" : "Systems Nominal"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* LIVE ROUTING TABLE */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">Live Routing Status</h3>
          <div className="space-y-4">
            {stats ? Object.entries(stats.routing_table).map(([bank, route]) => (
              <div key={bank} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(bank)} animate-pulse`} />
                  <span className="font-medium text-foreground">{bank} Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Routing to:</span>
                  <code className={`px-2 py-1 text-xs font-bold rounded ${route.includes("REROUTED") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {route}
                  </code>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Connecting to Neural Engine...</p>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY (Restored) */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">Recent AI Actions</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent AI actions recorded.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                  <div className={`mt-1 h-2 w-2 rounded-full ${log.action_type.includes("REROUTE") ? "bg-blue-500" : "bg-gray-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.action_type}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{log.log_text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}