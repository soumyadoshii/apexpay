"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "./page-header";
import { Activity, PauseCircle, PlayCircle, CheckCircle, AlertOctagon, Terminal, ArrowRight } from "lucide-react";

type IncidentStage = "IDLE" | "ANALYZING" | "PROPOSAL" | "RESOLVING" | "RESOLVED" | "PAUSED";

export function IncidentResponse() {
  // --- HDFC STATE ---
  const [stageHDFC, setStageHDFC] = useState<IncidentStage>("IDLE");
  const [logsHDFC, setLogsHDFC] = useState<string[]>([]);
  const timerHDFC = useRef<NodeJS.Timeout | null>(null);

  // --- SBI STATE (Simple for now) ---
  const [loadingSBI, setLoadingSBI] = useState(false);
  const [pausedSBI, setPausedSBI] = useState(false);
  const timerSBI = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerHDFC.current) clearTimeout(timerHDFC.current);
      if (timerSBI.current) clearTimeout(timerSBI.current);
    };
  }, []);

  // --- HDFC LOGIC: The Full AI Story ---
  
  const addLog = (msg: string) => {
    setLogsHDFC(prev => [...prev, `> ${msg}`]);
  };

  const triggerHDFC = () => {
    if (stageHDFC === "PAUSED") {
        alert("⚠️ HDFC Agent is PAUSED. Resume to run simulations.");
        return;
    }
    
    // 1. Start Analysis
    setStageHDFC("ANALYZING");
    setLogsHDFC(["> Initializing Watchtower...", "> Monitoring transaction stream..."]);

    // Sequence of "AI Thinking" events
    timerHDFC.current = setTimeout(() => {
        addLog("⚠️ ANOMALY DETECTED: High Latency (5002ms)");
        
        timerHDFC.current = setTimeout(() => {
            addLog("🔍 Root Cause: HDFC Gateway Timeout (Error 504)");
            
            timerHDFC.current = setTimeout(() => {
                addLog("🧠 Calculating Recovery Strategy...");
                setStageHDFC("PROPOSAL"); // Stop and wait for human
            }, 1000);
            
        }, 1500);
    }, 1500);
  };

  const authorizeFix = () => {
      setStageHDFC("RESOLVING");
      addLog("✅ Human Authorization Received.");
      addLog("⚙️ Executing: Reroute_Traffic(target='Razorpay')...");
      
      timerHDFC.current = setTimeout(() => {
          addLog("🚀 Traffic successfully rerouted.");
          addLog("✅ System Health: RESTORED.");
          setStageHDFC("RESOLVED");
      }, 2000);
  };

  const toggleKillSwitchHDFC = () => {
    // IMMEDIATE STOP
    if (timerHDFC.current) clearTimeout(timerHDFC.current);
    
    if (stageHDFC !== "PAUSED") {
        // Stop everything
        setStageHDFC("PAUSED");
        setLogsHDFC(prev => [...prev, "🛑 PROCESS ABORTED BY USER."]);
    } else {
        // Resume to Idle
        setStageHDFC("IDLE");
        setLogsHDFC([]);
    }
  };

  // --- SBI LOGIC (Simple) ---
  const triggerSBI = () => {
    if (pausedSBI) return;
    setLoadingSBI(true);
    timerSBI.current = setTimeout(() => {
      setLoadingSBI(false);
      alert("🚨 SBI Timeout Triggered! Agent auto-resolved in background.");
    }, 2000);
  };

  const toggleKillSwitchSBI = () => {
    if (timerSBI.current) clearTimeout(timerSBI.current);
    setLoadingSBI(false);
    setPausedSBI(!pausedSBI);
  };

  return (
    <section className="space-y-6">
      <PageHeader 
        title="Incident Response" 
        description="Trigger simulations to test the Agent's autonomous response."
        lastUpdated={new Date()}
      />

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* === HDFC CARD (The Star of the Show) === */}
        <div className={`border border-border bg-card p-6 rounded-sm transition-all flex flex-col justify-between
            ${stageHDFC === "PAUSED" ? "opacity-75 border-yellow-500/30" : ""}
            ${stageHDFC === "PROPOSAL" ? "border-blue-500 ring-1 ring-blue-500/20" : ""}
        `}>
          <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" /> HDFC Gateway
                </h3>
                {stageHDFC === "PAUSED" ? (
                    <span className="bg-yellow-500/20 text-yellow-600 text-xs px-2 py-1 rounded font-bold">PAUSED</span>
                ) : stageHDFC === "RESOLVED" ? (
                    <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded font-bold">RESOLVED</span>
                ) : (
                    <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded font-bold">ACTIVE</span>
                )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
                Simulate a high-latency failure on HDFC. The Agent will detect, analyze, and ask for permission to reroute.
            </p>

            {/* AI CONSOLE UI */}
            {(stageHDFC !== "IDLE") && (
                <div className="bg-black/90 p-4 rounded-md font-mono text-xs text-green-400 mb-4 h-40 overflow-y-auto border border-green-900/50 shadow-inner">
                    {logsHDFC.map((log, i) => (
                        <div key={i} className="mb-1 animate-in fade-in slide-in-from-left-2">{log}</div>
                    ))}
                    {stageHDFC === "ANALYZING" && <span className="animate-pulse">_</span>}
                </div>
            )}

            {/* PROPOSAL UI */}
            {stageHDFC === "PROPOSAL" && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded mb-4 animate-in zoom-in-95">
                    <div className="flex items-start gap-3">
                        <AlertOctagon className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-500">Recommendation Engine</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Identified <b>Razorpay</b> as best backup (0.2% cheaper).
                            </p>
                            <p className="text-xs font-semibold mt-2 text-foreground">Authorize reroute?</p>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="space-y-3 mt-auto">
            {/* ACTION BUTTONS BASED ON STATE */}
            {stageHDFC === "IDLE" && (
                <button
                onClick={triggerHDFC}
                disabled={stageHDFC === "PAUSED"}
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-3 rounded-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                🔥 TRIGGER HDFC OUTAGE
                </button>
            )}

            {stageHDFC === "ANALYZING" && (
                <button disabled className="w-full bg-muted text-muted-foreground px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2 cursor-wait">
                   <Activity className="h-4 w-4 animate-spin" /> Analyzing Logs...
                </button>
            )}

            {stageHDFC === "PROPOSAL" && (
                <button 
                    onClick={authorizeFix}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2 animate-pulse"
                >
                   <CheckCircle className="h-5 w-5" /> ACCEPT & FIX
                </button>
            )}

            {stageHDFC === "RESOLVING" && (
                <button disabled className="w-full bg-green-600/50 text-white px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2">
                   <ArrowRight className="h-4 w-4" /> Rerouting...
                </button>
            )}

            {stageHDFC === "RESOLVED" && (
                <button 
                    onClick={() => { setStageHDFC("IDLE"); setLogsHDFC([]); }}
                    className="w-full border border-border hover:bg-muted px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2"
                >
                   Reset Simulation
                </button>
            )}
            
            {/* KILL SWITCH */}
            <button
              onClick={toggleKillSwitchHDFC}
              className={`w-full border-2 px-4 py-2 rounded-sm font-bold transition-all flex items-center justify-center gap-2
                ${stageHDFC === "PAUSED"
                    ? "border-green-600 text-green-600 hover:bg-green-50" 
                    : "border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                }`}
            >
              {stageHDFC === "PAUSED" ? (
                  <><PlayCircle className="h-5 w-5" /> RESUME AI AGENT</>
              ) : (
                  <><PauseCircle className="h-5 w-5" /> PAUSE AI (KILL SWITCH)</>
              )}
            </button>
          </div>
        </div>

        {/* === SBI CARD (Simple Backup) === */}
        <div className={`border border-border bg-card p-6 rounded-sm transition-all ${pausedSBI ? "opacity-75 border-yellow-500/30" : ""}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> SBI Gateway
            </h3>
            {pausedSBI ? (
                <span className="bg-yellow-500/20 text-yellow-600 text-xs px-2 py-1 rounded font-bold">PAUSED</span>
            ) : (
                <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded font-bold">ACTIVE</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-6">
             Simulate a timeout error on SBI. The Agent should reroute traffic to Stripe.
          </p>
          <div className="space-y-3">
            <button
              onClick={triggerSBI}
              disabled={loadingSBI || pausedSBI}
              className={`w-full border px-4 py-3 rounded-sm font-bold transition-all flex items-center justify-center gap-2
                ${pausedSBI 
                    ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed" 
                    : "border-destructive text-destructive hover:bg-destructive/10"
                }
                 ${loadingSBI ? "animate-pulse bg-destructive/5" : ""}
              `}
            >
               {loadingSBI ? "Injecting Fault..." : "Trigger SBI Outage"}
            </button>

            <button
              onClick={toggleKillSwitchSBI}
              className={`w-full border-2 px-4 py-2 rounded-sm font-bold transition-all flex items-center justify-center gap-2
                ${pausedSBI 
                    ? "border-green-600 text-green-600 hover:bg-green-50" 
                    : "border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                }`}
            >
              {pausedSBI ? (
                  <><PlayCircle className="h-5 w-5" /> RESUME AI AGENT</>
              ) : (
                  <><PauseCircle className="h-5 w-5" /> PAUSE AI (KILL SWITCH)</>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}