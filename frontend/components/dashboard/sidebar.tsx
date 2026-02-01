"use client";

import React from "react"

import { useState } from "react";
import { ChevronDown, Activity, AlertTriangle, Zap, Eye, FileText, User } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "LIVE OPS",
    items: [
      { id: "overview", label: "Overview", icon: Activity },
      { id: "incident-response", label: "Incident Response", icon: AlertTriangle },
      { id: "shadow-mode", label: "Shadow Mode", icon: Eye },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { id: "root-cause", label: "Root Cause Analysis", icon: Zap },
      { id: "audit-trails", label: "Audit Trails", icon: FileText },
    ],
  },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-14 transition-all duration-300 h-[calc(100vh-56px)] border-r border-border bg-sidebar ${
      isCollapsed ? "w-16" : "w-56"
    }`}>
      <div className="flex flex-col h-full">
        {/* Header Profile Section */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                ME
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">Manager</div>
                <div className="text-xs text-muted-foreground truncate">manager@app.dev</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-sidebar-accent rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronDown className={`h-4 w-4 text-sidebar-foreground transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-8">
              {!isCollapsed && (
                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </span>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Live System Status Widget */}
        <div className="border-t border-border p-4">
          <div className={`border border-border rounded px-3 py-3 ${
            isCollapsed ? "flex justify-center" : ""
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-success rounded-full animate-pulse" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-sidebar-foreground">Admin Access</div>
                  <div className="text-xs text-muted-foreground">All Systems Operational</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
