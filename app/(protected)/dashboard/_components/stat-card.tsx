type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
};

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <p className="text-lg text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}