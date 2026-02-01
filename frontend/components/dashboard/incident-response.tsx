"use client";

import { useState } from "react";
import { PageHeader } from "./page-header";
import { Zap, Activity } from "lucide-react";
import { API_URL } from "@/lib/config";

export function IncidentResponse() {
  const [loading, setLoading] = useState(false);

  // This function triggers the outage in Python
  const triggerOutage = async (bank: string) => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/simulation/trigger?bank_name=${bank}`, { method: "POST" });
      alert(`🚨 triggered ${bank} outage! Check the Overview.`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Incident Response" 
        description="Trigger simulations to test the Agent's autonomous response."
        lastUpdated={new Date()}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* HDFC CONTROLS */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> HDFC Gateway
            </h3>
            <span className="bg-success/20 text-success text-xs px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Simulate a high-latency failure on HDFC. The Agent should detect this in 3 seconds and reroute to Razorpay.
          </p>
          <button
            onClick={() => triggerOutage("HDFC")}
            disabled={loading}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-3 rounded-sm font-medium transition-all"
          >
            {loading ? "Injecting Fault..." : "🔥 TRIGGER HDFC OUTAGE"}
          </button>
        </div>

        {/* SBI CONTROLS */}
        <div className="border border-border bg-card p-6 rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> SBI Gateway
            </h3>
            <span className="bg-success/20 text-success text-xs px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
             Simulate a timeout error on SBI. The Agent should reroute traffic to Stripe.
          </p>
          <button
            onClick={() => triggerOutage("SBI")}
            disabled={loading}
            className="w-full border border-destructive text-destructive hover:bg-destructive/10 px-4 py-3 rounded-sm font-medium transition-all"
          >
            Trigger SBI Outage
          </button>
        </div>
      </div>
    </section>
  );
}