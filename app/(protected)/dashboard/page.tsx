// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// import { signOut } from "./actions";

import { requireCurrentUser } from "@/lib/current-user";


export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  
  const user = await requireCurrentUser();

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto max-w-4xl space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-2xl font-semibold">Bentornato</h1>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground">
          <p className="text-sm text-muted-foreground">Utente autenticato</p>
          <p className="font-medium">{user.email}</p>
          <p className="text-sm text-muted-foreground">Ruolo: {user.role}</p>
        </div>
      </section>
    </main>
  );
}