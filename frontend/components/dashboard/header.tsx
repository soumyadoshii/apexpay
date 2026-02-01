"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary">
          apeXpay
        </Link>
      </div>
      
      <div className="flex flex-1 justify-center px-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search transactions, routes, incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Manager Dashboard</span>
        <div className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
          MD
        </div>
      </div>
    </header>
  );
}
