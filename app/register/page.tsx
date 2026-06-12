import { signUpWithEmail } from "./actions";

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <form
        action={signUpWithEmail}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Crea account</h1>
          <p className="text-sm text-muted-foreground">
            Registrati per accedere a MastroHub.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Nome
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

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
            autoComplete="new-password"
            minLength={8}
            required
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Registrati
        </button>
      </form>
    </main>
  );
}