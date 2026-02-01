"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const providers = ["Stripe", "HDFC", "SBI", "Razorpay", "PayU", "Paytm"];

export default function LandingPage() {
  const [activeNode, setActiveNode] = useState(0);
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6);
      setPulseNodes((prev) => {
        const newNode = Math.floor(Math.random() * 6);
        return [...prev.slice(-3), newNode];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center bg-gradient-to-br from-primary to-accent rounded-sm">
              <span className="text-xs font-bold text-primary-foreground">aX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-none text-foreground">apeXpay</span>
              <span className="text-xs text-muted-foreground">AI Reliability Engine</span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <a 
              href="#day-in-life" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a 
              href="#ooda-loop" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Under the Hood
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse bg-success rounded-full" />
              <span>All systems operational</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg rounded-sm"
            >
              <span>View War Room</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Compact Hero & Network Diagram */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Compact Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">apeXpay</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Autonomous reliability that keeps your payment infrastructure running 24/7
            </p>
          </div>

          {/* Network Diagram with Provider Nodes */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-96 w-96">
              {/* Central Hub */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-primary bg-background shadow-lg rounded-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">aX</div>
                  <div className="text-xs text-muted-foreground">AI Core</div>
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 384 384">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x = 192 + Math.cos(angle) * 140;
                  const y = 192 + Math.sin(angle) * 140;
                  return (
                    <line
                      key={i}
                      x1="192"
                      y1="192"
                      x2={x}
                      y2={y}
                      stroke={activeNode === i ? "#60A5FA" : "#E5E7EB"}
                      strokeWidth={activeNode === i ? "3" : "1"}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>

              {/* Provider Nodes */}
              {providers.map((provider, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = 50 + Math.cos(angle) * 36.5;
                const y = 50 + Math.sin(angle) * 36.5;
                const isActive = activeNode === i;
                const isPulsing = pulseNodes.includes(i);

                return (
                  <div
                    key={provider}
                    className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border bg-background text-center transition-all duration-300 rounded-sm ${
                      isActive
                        ? "border-primary shadow-lg"
                        : "border-border"
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    {isPulsing && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping bg-success rounded-full" />
                    )}
                    <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {provider}
                    </span>
                  </div>
                );
              })}

              {/* Floating Status Indicators */}
              <div className="absolute -right-4 top-8 border border-border bg-background px-3 py-2 shadow-md rounded-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse bg-success rounded-full" />
                  <span className="text-xs text-foreground">All Systems Operational</span>
                </div>
              </div>
              <div className="absolute -left-4 bottom-8 border border-border bg-background px-3 py-2 shadow-md rounded-sm">
                <div className="text-xs text-muted-foreground">Processing</div>
                <div className="text-sm font-semibold text-foreground">2,847 txn/min</div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 pt-16 border-t border-border mx-auto max-w-md mt-16">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">99.7%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">&lt;50ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">94%</div>
              <div className="text-sm text-muted-foreground">Auto-Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* The apeXpay Way Section */}
      <section id="day-in-life" className="border-t border-border py-24 bg-card">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">The apeXpay Way</h2>
            <p className="text-lg text-muted-foreground">Autonomous reliability that never sleeps</p>
          </div>

          {/* Full-width apeXpay Way Card */}
          <div className="border-2 border-success/40 bg-gradient-to-br from-success/8 to-success/5 p-12 rounded-sm">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-6 pb-6 border-b border-success/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-success/15 text-lg font-bold text-success">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Anomaly Detected</h3>
                  <p className="text-muted-foreground">&lt;100ms latency spike identified across payment infrastructure</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6 pb-6 border-b border-success/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-success/15 text-lg font-bold text-success">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI Reroutes Traffic</h3>
                  <p className="text-muted-foreground">Automatic failover activated instantly, routing to healthy providers</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6 pb-6 border-b border-success/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-success/15 text-lg font-bold text-success">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Slack Notification Sent</h3>
                  <p className="text-muted-foreground">Optional alert posted (no wake-up required—problem already solved)</p>
                </div>
              </div>

              {/* Step 4 - Highlight */}
              <div className="flex items-start gap-6 bg-success/10 p-6 rounded-sm border border-success/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-success text-lg font-bold text-success-foreground">
                  ✓
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-success mb-2">0ms Downtime. You Keep Sleeping.</h3>
                  <p className="text-muted-foreground">Full revenue protection. Complete audit trail. Zero human intervention.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Under the Hood - OODA Loop */}
      <section id="ooda-loop" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">Under the Hood</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Observe */}
            <div className="border border-border bg-card p-6 rounded-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-sm flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">👁</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Observe</h3>
              <p className="text-sm text-muted-foreground">Real-time log aggregation and metrics collection from all payment providers.</p>
              <div className="mt-4 pt-4 border-t border-border">
                <code className="text-xs font-mono text-accent">logs → metrics</code>
              </div>
            </div>

            {/* Orient */}
            <div className="border border-border bg-card p-6 rounded-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-sm flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">🧠</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Orient</h3>
              <p className="text-sm text-muted-foreground">ML model analyzes patterns and detects anomalies using historical baselines.</p>
              <div className="mt-4 pt-4 border-t border-border">
                <code className="text-xs font-mono text-accent">model.predict()</code>
              </div>
            </div>

            {/* Decide */}
            <div className="border border-border bg-card p-6 rounded-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-sm flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">⚡</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Decide</h3>
              <p className="text-sm text-muted-foreground">Rule engine evaluates response options and selects optimal action.</p>
              <div className="mt-4 pt-4 border-t border-border">
                <code className="text-xs font-mono text-accent">rules.evaluate()</code>
              </div>
            </div>

            {/* Act */}
            <div className="border border-border bg-card p-6 rounded-sm">
              <div className="h-12 w-12 bg-success/10 rounded-sm flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-success">✓</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Act</h3>
              <p className="text-sm text-muted-foreground">Python tools execute rerouting, failover, or mitigation automatically.</p>
              <div className="mt-4 pt-4 border-t border-border">
                <code className="text-xs font-mono text-success">execute_action()</code>
              </div>
            </div>
          </div>

          {/* OODA Loop Diagram */}
          <div className="mt-16 border border-border bg-card p-8 rounded-sm">
            <div className="grid grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">1</div>
                <p className="text-sm font-medium text-foreground">Observe</p>
                <p className="text-xs text-muted-foreground mt-1">Logs & Metrics</p>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-6 h-1 text-border" viewBox="0 0 24 4" fill="none" stroke="currentColor">
                  <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">2</div>
                <p className="text-sm font-medium text-foreground">Orient</p>
                <p className="text-xs text-muted-foreground mt-1">ML Patterns</p>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-6 h-1 text-border" viewBox="0 0 24 4" fill="none" stroke="currentColor">
                  <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-8">
              <div className="flex items-center justify-center">
                <svg className="w-1 h-6 text-border" viewBox="0 0 4 24" fill="none" stroke="currentColor">
                  <line x1="2" y1="0" x2="2" y2="24" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex items-center justify-center flex-col gap-2">
                <svg className="w-full h-1 text-primary" viewBox="0 0 24 4" fill="none" stroke="currentColor">
                  <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2" />
                </svg>
                <span className="text-xs font-medium text-primary">Feedback Loop</span>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-1 h-6 text-border" viewBox="0 0 4 24" fill="none" stroke="currentColor">
                  <line x1="2" y1="0" x2="2" y2="24" strokeWidth="2" />
                </svg>
              </div>
              <div />
            </div>
            <div className="grid grid-cols-4 gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">4</div>
                <p className="text-sm font-medium text-foreground">Act</p>
                <p className="text-xs text-muted-foreground mt-1">Python Tools</p>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-6 h-1 text-border" viewBox="0 0 24 4" fill="none" stroke="currentColor">
                  <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">3</div>
                <p className="text-sm font-medium text-foreground">Decide</p>
                <p className="text-xs text-muted-foreground mt-1">Rule Engine</p>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-6 h-1 text-border" viewBox="0 0 24 4" fill="none" stroke="currentColor">
                  <line x1="0" y1="2" x2="24" y2="2" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Experience Zero-Downtime Reliability
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            See apeXpay detect and resolve incidents in real-time, keeping your payment infrastructure running 24/7.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg rounded-sm"
          >
            Open Live Dashboard
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center bg-primary rounded-sm">
                <span className="text-xs font-bold text-primary-foreground">aX</span>
              </div>
              <span className="font-semibold text-foreground">apeXpay</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Docs</a>
              <a href="#" className="transition-colors hover:text-foreground">API</a>
              <a href="#" className="transition-colors hover:text-foreground">Status</a>
              <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
