export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
    </div>
  );
}