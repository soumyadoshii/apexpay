"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "./page-header";
import { Activity, ArrowUpRight, CheckCircle, AlertTriangle } from "lucide-react";

export function Overview() {
  const [isMounted, setIsMounted] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // --- HARDCODED DATA FOR DEMO ---
  const stats = {
    total_transactions: 14205,
    success_rate: 99.9,
    active_incidents: 0,
    routing_table: {
      "HDFC": "DIRECT_PIPE",
      "SBI": "DIRECT_PIPE",
      "Razorpay": "DIRECT_PIPE",
      "Stripe": "DIRECT_PIPE"
    }
  };

  useEffect(() => {
    setIsMounted(true);
    setLastUpdate(new Date());

    // Generate logs ONLY on the client to avoid Hydration Mismatch
    setRecentLogs([
      { id: 1, action_type: "SYSTEM_CHECK", log_text: "All gateways operational. Latency < 40ms.", timestamp: new Date().toISOString() },
      { id: 2, action_type: "AUTO_SCALE", log_text: "Increased connection pool for SBI.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 3, action_type: "OPTIMIZATION", log_text: "Routing logic updated for high-value txns.", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
    ]);
  }, []);

  const getStatusColor = (bank: string) => "bg-green-500";

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        description="Real-time metrics from apeXpay Engine"
        lastUpdated={lastUpdate || new Date()} 
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Transactions */}
        <div className="border border-border bg-card p-6 rounded-sm hover:border-primary transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.total_transactions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> +12% from yesterday
          </p>
        </div>

        {/* Success Rate */}
        <div className="border border-border bg-card p-6 rounded-sm hover:border-primary transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-green-500">
            {stats.success_rate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Target: 99.9%</p>
        </div>

        {/* Incidents */}
        <div className="border border-border bg-card p-6 rounded-sm transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Incidents</span>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.active_incidents}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Systems Nominal</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Routing Table */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">Live Routing Status</h3>
          <div className="space-y-4">
            {Object.entries(stats.routing_table).map(([bank, route]) => (
              <div key={bank} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(bank)} animate-pulse`} />
                  <span className="font-medium text-foreground">{bank} Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Routing to:</span>
                  <code className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">
                    {route}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">Recent AI Actions</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {!isMounted ? (
                <p className="text-sm text-muted-foreground">Loading activity feed...</p>
            ) : (
                recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                    <p className="text-sm font-medium text-foreground">{log.action_type}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{log.log_text}</p>
                    {/* The fix: suppressHydrationWarning ensures small time format differences don't break the app */}
                    <p className="text-[10px] text-muted-foreground mt-1" suppressHydrationWarning>
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