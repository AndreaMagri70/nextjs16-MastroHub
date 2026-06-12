import { cn } from "@/lib/utils";

type FormMessageProps = {
  success: boolean;
  message: string;
};

export function FormMessage({ success, message }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role={success ? "status" : "alert"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-destructive/20 bg-destructive/10 text-destructive",
      )}
    >
      {message}
    </p>
  );
}