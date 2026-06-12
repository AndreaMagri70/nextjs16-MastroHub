import { signInWithEmail } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <form
        action={signInWithEmail}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Accedi</h1>
          <p className="text-sm text-muted-foreground">
            Usa le credenziali del tuo account MastroHub.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Entra
        </button>
      </form>
    </main>
  );
}