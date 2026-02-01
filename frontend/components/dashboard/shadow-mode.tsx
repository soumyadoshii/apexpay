"use client";

import { useState } from "react";
import { PageHeader } from "./page-header";

interface SimulationResult {
  id: string;
  change: string;
  predictedOutcome: string;
  timestamp: string;
  accepted: boolean | null;
}

const historicalSimulations: SimulationResult[] = [
  {
    id: "1",
    change: "Switch 30% traffic from HDFC to Razorpay",
    predictedOutcome: "0.5% higher fees, 3% faster processing",
    timestamp: "Feb 1, 2026 12:00",
    accepted: true,
  },
  {
    id: "2",
    change: "Enable international card routing via Stripe",
    predictedOutcome: "2% higher fees, 15% better conversion",
    timestamp: "Jan 31, 2026 16:30",
    accepted: true,
  },
  {
    id: "3",
    change: "Reduce SBI allocation by 50%",
    predictedOutcome: "0.2% fee reduction, potential 5% latency increase",
    timestamp: "Jan 30, 2026 10:15",
    accepted: false,
  },
];

export function ShadowMode() {
  const [changeType, setChangeType] = useState("Switch Payment Provider");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [simulationResult, setSimulationResult] = useState<{
    fees: string;
    processing: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(true); // Default open for demo
  const [history, setHistory] = useState(historicalSimulations);

  const providers = ["Stripe", "HDFC", "SBI", "Razorpay", "PayU"];

  const runSimulation = () => {
    if (!selectedProvider) return;
    setIsSimulating(true);
    setSimulationResult(null);

    // --- HARDCODED LOGIC FOR DEMO ---
    setTimeout(() => {
        let feeText = "";
        let processText = "";

        // Specific Logic for HDFC Traffic Allocation Demo
        if (selectedProvider === "HDFC" && changeType === "Adjust Traffic Allocation") {
             feeText = "+0.5% fees (Tier 2 Routing)";
             processText = "-120ms latency (Optimized)";
        } 
        // Logic for Switch Provider
        else if (changeType === "Switch Payment Provider") {
            feeText = "+1.2% fees (Interchange)";
            processText = "99.99% Reliability Score";
        }
        // Random fallback for others
        else {
             const feeChange = (Math.random() * 3 - 1).toFixed(1);
             const processingChange = (Math.random() * 5 - 1).toFixed(1);
             feeText = `${Number(feeChange) >= 0 ? "+" : ""}${feeChange}% fees`;
             processText = `${Number(processingChange) >= 0 ? "+" : ""}${processingChange}% speed`;
        }

      setSimulationResult({
        fees: feeText,
        processing: processText,
      });
      setIsSimulating(false);
    }, 1500); // 1.5s delay for effect
  };

  const handleDecision = (proceed: boolean) => {
    if (simulationResult) {
      const newSimulation: SimulationResult = {
        id: Date.now().toString(),
        change: `${changeType}: ${selectedProvider}`,
        predictedOutcome: `${simulationResult.fees}, ${simulationResult.processing}`,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        accepted: proceed,
      };
      setHistory([newSimulation, ...history]);
    }
    setSimulationResult(null);
    // We do NOT clear selection so you can run it again if needed
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Shadow Mode Simulation" 
        description="Test proposed changes before applying them to production"
        lastUpdated={new Date()}
      />

      <div className="border border-border bg-card p-6 rounded-sm">
        <h3 className="mb-4 text-base font-medium text-foreground">
          Run New Simulation
        </h3>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Change Type
            </label>
            <select 
                value={changeType}
                onChange={(e) => setChangeType(e.target.value)}
                className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option>Switch Payment Provider</option>
              <option>Adjust Traffic Allocation</option>
              <option>Enable/Disable Route</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Target Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={!selectedProvider || isSimulating}
          className="bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSimulating ? "Running Simulation..." : "Run Simulation"}
        </button>

        {simulationResult && (
          <div className="mt-6 border border-border bg-muted p-4 animate-in fade-in slide-in-from-top-2">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Simulation Results (Predicted)
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="p-3 bg-background border border-border rounded">
                    <div className="text-xs text-muted-foreground uppercase">Financial Impact</div>
                    <div className="text-lg font-bold text-foreground">{simulationResult.fees}</div>
                 </div>
                 <div className="p-3 bg-background border border-border rounded">
                    <div className="text-xs text-muted-foreground uppercase">Performance Impact</div>
                    <div className="text-lg font-bold text-foreground">{simulationResult.processing}</div>
                 </div>
            </div>
            
            <p className="mb-4 text-sm text-foreground">
              Do you want to apply this configuration to Live Production?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDecision(true)}
                className="bg-success hover:bg-success/90 px-4 py-2 text-sm font-medium text-success-foreground transition-colors rounded-sm"
              >
                Yes, Apply
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors rounded-sm"
              >
                No, Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-border bg-card">
        <button
          onClick={() => setExpandedHistory(!expandedHistory)}
          className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
        >
          <span className="text-base font-medium text-foreground">
            Historical Simulations
          </span>
          <span className="text-sm text-muted-foreground">
            {expandedHistory ? "Collapse" : "Expand"}
          </span>
        </button>

        {expandedHistory && (
          <div className="border-t border-border">
            {history.map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between border-b border-border px-6 py-4 last:border-b-0 hover:bg-muted/20"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {sim.change}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sim.predictedOutcome}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {sim.timestamp.split(',')[1]} 
                  </span>
                  {sim.accepted === true && (
                    <span className="bg-success/20 text-success border border-success/30 px-2 py-1 text-xs font-bold uppercase rounded">
                      Accepted
                    </span>
                  )}
                  {sim.accepted === false && (
                    <span className="bg-destructive/20 text-destructive border border-destructive/30 px-2 py-1 text-xs font-bold uppercase rounded">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}