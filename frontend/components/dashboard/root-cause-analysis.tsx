"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "./page-header";

interface Incident {
  id: string;
  timestamp: string;
  type: string;
  rootCause: string;
  status: "resolved" | "analyzing" | "failed";
  details: string;
  confidence: number;
  affectedTransactions: number;
}

const initialIncidents: Incident[] = [
  {
    id: "1",
    timestamp: "14:30",
    type: "UPI Failure",
    rootCause: "HDFC rejecting transactions on iOS devices",
    status: "resolved",
    confidence: 98,
    affectedTransactions: 234,
    details:
      "Analysis detected pattern of iOS user-agent failures. Root cause traced to HDFC SDK incompatibility with iOS 17.4. Automatic rerouting to Stripe resolved 98% of affected transactions.",
  },
  {
    id: "2",
    timestamp: "14:15",
    type: "Timeout Spike",
    rootCause: "SBI gateway latency exceeded 5s threshold",
    status: "resolved",
    confidence: 95,
    affectedTransactions: 156,
    details:
      "Gateway response times increased due to SBI scheduled maintenance. AI detected pattern and preemptively shifted 40% traffic to backup routes.",
  },
  {
    id: "3",
    timestamp: "13:45",
    type: "Payment Decline",
    rootCause: "Analyzing unusual decline patterns from Razorpay",
    status: "analyzing",
    confidence: 67,
    affectedTransactions: 89,
    details:
      "Investigating elevated decline rates for international cards. Preliminary analysis suggests potential fraud detection trigger. Awaiting more data.",
  },
  {
    id: "4",
    timestamp: "12:30",
    type: "Authentication Error",
    rootCause: "3DS verification failures on HDFC",
    status: "failed",
    confidence: 82,
    affectedTransactions: 312,
    details:
      "3D Secure authentication flow experiencing intermittent failures. Manual intervention required - automatic rerouting unsuccessful due to card network restrictions.",
  },
];

export function RootCauseAnalysis() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [filter, setFilter] = useState<"all" | "resolved" | "analyzing" | "failed">("all");
  const [sortBy, setSortBy] = useState<"time" | "impact">("time");

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prev) =>
        prev.map((incident) => {
          if (incident.status === "analyzing" && Math.random() > 0.7) {
            return {
              ...incident,
              confidence: Math.min(99, incident.confidence + Math.floor(Math.random() * 5)),
            };
          }
          return incident;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents
    .filter((i) => filter === "all" || i.status === filter)
    .sort((a, b) => {
      if (sortBy === "impact") return b.affectedTransactions - a.affectedTransactions;
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center bg-success px-2 py-1 text-xs font-medium text-success-foreground">
            Resolved
          </span>
        );
      case "analyzing":
        return (
          <span className="inline-flex items-center bg-warning px-2 py-1 text-xs font-medium text-warning-foreground">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse bg-warning-foreground" />
            Analyzing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const handleReanalyze = (id: string) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id
          ? { ...incident, status: "analyzing" as const, confidence: 45 }
          : incident
      )
    );
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Root Cause Analysis" 
        description="AI-driven forensic analysis of transaction failures"
        lastUpdated={new Date()}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="analyzing">Analyzing</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="time">Sort by Time</option>
            <option value="impact">Sort by Impact</option>
          </select>
        </div>
      </div>

      <div className="border border-border bg-card rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-20 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Time
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Root Cause
              </th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Impact
              </th>
              <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confidence
              </th>
              <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident) => (
              <>
                <tr
                  key={incident.id}
                  className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {incident.timestamp}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {incident.type}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {incident.rootCause}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {incident.affectedTransactions} txns
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted">
                        <div
                          className={`h-full transition-all duration-500 ${
                            incident.confidence >= 90
                              ? "bg-success"
                              : incident.confidence >= 70
                                ? "bg-warning"
                                : "bg-destructive"
                          }`}
                          style={{ width: `${incident.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {incident.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(incident.status)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === incident.id ? null : incident.id)
                      }
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {expandedId === incident.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expandedId === incident.id && (
                  <tr key={`${incident.id}-details`}>
                    <td colSpan={7} className="border-b border-border bg-muted/50 px-4 py-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h4 className="mb-2 text-sm font-semibold text-foreground">
                            Detailed Analysis
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {incident.details}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {incident.status === "failed" && (
                            <button
                              onClick={() => handleReanalyze(incident.id)}
                              className="bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                              Re-analyze
                            </button>
                          )}
                          <button className="border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
                            View Logs
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
