interface PageHeaderProps {
  title: string;
  description: string;
  lastUpdated?: Date;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleString();
}

export function PageHeader({ title, description, lastUpdated }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
        {lastUpdated && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Last updated: {formatRelativeTime(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  );
}
