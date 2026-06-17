import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  value: string;
};

const labels: Record<string, string> = {
  DRAFT: "Bozza",
  SENT: "Inviato",
  ACCEPTED: "Accettato",
  REJECTED: "Rifiutato",
  EXPIRED: "Scaduto",
  CANCELLED: "Annullato",
  PLANNED: "Pianificato",
  IN_PROGRESS: "In corso",
  ON_HOLD: "Sospeso",
  COMPLETED: "Completato",
  ADMIN: "Admin",
  MANAGER: "Manager",
  SALES: "Commerciale",
  TECHNICIAN: "Tecnico",
};

const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  SENT: "outline",
  ACCEPTED: "default",
  REJECTED: "destructive",
  EXPIRED: "destructive",
  CANCELLED: "secondary",
  PLANNED: "outline",
  IN_PROGRESS: "default",
  ON_HOLD: "secondary",
  COMPLETED: "default",
  ADMIN: "default",
  MANAGER: "secondary",
  SALES: "outline",
  TECHNICIAN: "outline",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <Badge variant={variants[value] ?? "outline"}>
      {labels[value] ?? value}
    </Badge>
  );
}