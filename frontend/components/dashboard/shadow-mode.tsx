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
  const [selectedProvider, setSelectedProvider] = useState("");
  const [simulationResult, setSimulationResult] = useState<{
    fees: string;
    processing: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [history, setHistory] = useState(historicalSimulations);

  const providers = ["Stripe", "HDFC", "SBI", "Razorpay", "PayU"];

  const runSimulation = () => {
    if (!selectedProvider) return;
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      const feeChange = (Math.random() * 3 - 1).toFixed(1);
      const processingChange = (Math.random() * 5 - 1).toFixed(1);
      setSimulationResult({
        fees: `${Number(feeChange) >= 0 ? "+" : ""}${feeChange}% fees`,
        processing: `${Number(processingChange) >= 0 ? "+" : ""}${processingChange}% processing speed`,
      });
      setIsSimulating(false);
    }, 2000);
  };

  const handleDecision = (proceed: boolean) => {
    if (simulationResult) {
      const newSimulation: SimulationResult = {
        id: Date.now().toString(),
        change: `Switch to ${selectedProvider}`,
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
    setSelectedProvider("");
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
            <select className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
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
          <div className="mt-6 border border-border bg-muted p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Simulation Results
            </h4>
            <p className="mb-4 text-sm text-foreground">
              Predicted outcome: {simulationResult.fees},{" "}
              {simulationResult.processing}. Proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDecision(true)}
                className="bg-success px-4 py-2 text-sm font-medium text-success-foreground"
              >
                Yes, Apply
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
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
          className="flex w-full items-center justify-between px-6 py-4 text-left"
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
                className="flex items-center justify-between border-b border-border px-6 py-4 last:border-b-0"
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
                  <span className="text-xs text-muted-foreground">
                    {sim.timestamp}
                  </span>
                  {sim.accepted === true && (
                    <span className="bg-success px-2 py-1 text-xs font-medium text-success-foreground">
                      Accepted
                    </span>
                  )}
                  {sim.accepted === false && (
                    <span className="bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
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
