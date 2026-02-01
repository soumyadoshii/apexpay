"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Overview } from "@/components/dashboard/overview";
import { IncidentResponse } from "@/components/dashboard/incident-response";
import { RootCauseAnalysis } from "@/components/dashboard/root-cause-analysis";
import { ShadowMode } from "@/components/dashboard/shadow-mode";
import { AuditTrails } from "@/components/dashboard/audit-trails";
import { ChatBot } from "@/components/dashboard/chatbot";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "incident-response":
        return <IncidentResponse />;
      case "root-cause":
        return <RootCauseAnalysis />;
      case "shadow-mode":
        return <ShadowMode />;
      case "audit-trails":
        return <AuditTrails />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-56 pt-14">
        <div className="p-6">
          {renderSection()}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
