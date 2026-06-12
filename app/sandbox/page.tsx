import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SandboxPage() {
  return (
    <main className="bg-background flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sandbox UI</CardTitle>
          <CardDescription>
            Verifica iniziale di Tailwind e componenti Shadcn/UI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Se questa card e il pulsante sono stilizzati, il setup UI di base
            risulta attivo.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Checkpoint Fase 1</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
