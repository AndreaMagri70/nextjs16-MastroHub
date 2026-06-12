
> [!IMPORTANT]  
> Poiché TI HO chiesto di procedere passo passo chiedendoti cosa serve per collegare i miei account, questo piano è strutturato a fasi. Non andare avanti con la configurazione senza prima aver ricevuto da me le chiavi necessarie o il via libera.
Ecco la tua Roadmap Architetturale aggiornata con la struttura file moderna basata sulla root. Mettiamoci al lavoro.
FASE 0 - Analisi e progettazione
Tempo stimato: 2-3 giorni | Livello di difficoltà: Medio
1. Obiettivo e Perché ora
    • Obiettivo: Definire il modello dati (Entity-Relationship) e l'architettura dei permessi (RBAC) prima di scrivere una singola riga di codice.
    • Perché in questo momento: "Mesi di coding possono farti risparmiare ore di progettazione". Se il database è strutturato male, tutto il codice backend diventerà un incubo di workaround.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Modellazione relazionale avanzata, Role-Based Access Control (RBAC).
    • Teoria: Relazioni 1:N e N:M. Concetto di "Soft Delete" (non eliminare mai una fattura, marcala come eliminata). Normalizzazione del database vs denormalizzazione per performance in lettura sulla Dashboard.
3. Best Practice & Errori Comuni
    • Best Practice: Usa gli UUID (o CUID) per le chiavi primarie, non interi sequenziali (evita che un utente indovini quanti preventivi hai). Tieni traccia di createdAt e updatedAt in ogni tabella.
    • Errori più comuni: Creare tabelle "tuttofare" (es. una tabella Lavori che mischia preventivi e cantieri). Dimenticarsi di definire i comportamenti ON DELETE CASCADE o RESTRICT.
4. Pratica: Struttura File e Comandi
Non scriveremo ancora codice applicativo, ma useremo strumenti di diagrammazione (es. dbdiagram.io o Eraser).
    • Struttura file coinvolti: docs/schema.md, docs/rbac.md.
5. Esercizi di Consolidamento
    • Disegna su carta o su un tool lo schema che collega: User -> Quote (Preventivo) -> Client -> Project (Cantiere).
    • Mappa chi può fare cosa: Il "Tecnico" può creare un preventivo? O può solo aggiornare lo stato del cantiere? Scrivilo in una matrice ruoli/permessi.
6. Checklist e Checkpoint Finale
    • Diagramma ER completato.
    • Matrice dei permessi documentata.
    • Checkpoint Finale: Se puoi spiegare a voce alta come recuperare tutti i cantieri attivi di un cliente partendo dall'ID dell'utente loggato, hai compreso il modello.
FASE 1 - Setup Ambiente
Tempo stimato: 1 giorno | Livello di difficoltà: Basso
1. Obiettivo e Perché ora
    • Obiettivo: Inizializzare il repository con tutte le dipendenze base e la configurazione corretta di linting/formatting.
    • Perché in questo momento: Un ambiente pulito e standardizzato riduce l'attrito cognitivo e previene bug legati alla configurazione.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Struttura dell'App Router di Next.js, configurazione di Tailwind e Shadcn/UI.
    • Teoria: Differenza sostanziale tra Server Components e Client Components nel nuovo paradigma di React. Il concetto di "Tree Shaking" e path aliases (@/components).
3. Best Practice & Errori Comuni
    • Best Practice: Abilita strict mode in TypeScript. Usa ESLint e Prettier fin dal primo commit. Mantieni Shadcn/UI circoscritto a una cartella specifica.
    • Errori più comuni: Installare pacchetti UI completi quando serve solo un bottone, appesantendo il bundle. Ignorare i warning di TypeScript nei file di configurazione.
4. Pratica: Struttura File e Comandi
    • Comandi da eseguire:
      Bash
      npx create-next-app@latest erp-artigiani --typescript --tailwind --eslint --no-src-dir
      cd erp-artigiani
      npx shadcn-ui@latest init
      npm i -D prettier prettier-plugin-tailwindcss
    • Struttura file coinvolti:
      Plaintext
      /app        # App router (pagine e layout)
      /components # Componenti UI (es. pulsanti, form di shadcn)
      /lib        # Utility globali (es. utils.ts di shadcn)
5. Esercizi di Consolidamento
    • Crea una pagina /sandbox all'interno di /app e installa/utilizza il componente Button e Card di Shadcn per testare che il setup CSS funzioni correttamente.
6. Checklist e Checkpoint Finale
    • Progetto Next.js avviato senza errori.
    • Prettier formatta automaticamente su salvataggio.
    • Checkpoint Finale: Avvia npm run dev. Se vedi la schermata di default e i componenti Shadcn renderizzano con gli stili corretti, il setup è concluso.
FASE 2 - Database e Prisma
Tempo stimato: 2 giorni | Livello di difficoltà: Medio
1. Obiettivo e Perché ora
    • Obiettivo: Trasformare l'analisi della Fase 0 in codice tramite Prisma e connettere il database Neon.
    • Perché in questo momento: L'applicazione è data-driven. Tutto (auth, UI, logica) ruoterà attorno allo schema del database.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: ORM (Object-Relational Mapping), Migrations, Connection Pooling.
    • Teoria: Come Prisma genera i tipi TypeScript in base allo schema. Come funziona Neon (Serverless Postgres) e perché il connection pooling è vitale in un ambiente serverless.
3. Best Practice & Errori Comuni
    • Best Practice: Metti sempre l'URL del DB in un file .env e non committarlo mai. Crea uno script di seed.ts per popolare il DB con dati finti da usare in sviluppo.
    • Errori più comuni: Modificare manualmente il database senza usare prisma migrate. Esporre il client Prisma globale in sviluppo, esaurendo le connessioni DB (hot-reloading loop).
4. Pratica: Struttura File e Comandi
    • Comandi da eseguire:
      Bash
      npm i @prisma/client
      npm i -D prisma
      npx prisma init
      # ... dopo aver scritto schema.prisma ...
      npx prisma migrate dev --name init
      npx prisma generate
    • Struttura file coinvolti:
      Plaintext
      /prisma
        schema.prisma
        seed.ts
      /lib
        prisma.ts # Istanza singleton per evitare connection limits
5. Esercizi di Consolidamento
    • Scrivi lo schema.prisma inserendo le tabelle User, Client, Quote, ConstructionSite.
    • Crea uno script seed.ts che generi un Cliente e un Preventivo associato.
6. Checklist e Checkpoint Finale
    • Neon DB creato online.
    • schema.prisma riflette l'analisi.
    • Migrazione eseguita con successo.
    • Checkpoint Finale: Apri npx prisma studio. Se vedi le tue tabelle e puoi inserire record manualmente, la fondazione dati è pronta.
FASE 3 - Autenticazione
Tempo stimato: 2-3 giorni | Livello di difficoltà: Alto
1. Obiettivo e Perché ora
    • Obiettivo: Implementare login/logout e proteggere le rotte tramite Neon Auth (o logiche JWT/Session affini).
    • Perché in questo momento: L'autenticazione definisce il contesto globale (chi sta usando l'app). Serve prima di creare qualsiasi logica di business.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Sessioni vs JWT, Next.js Middleware, Contesto Utente.
    • Teoria: Come il middleware in Next.js intercetta le richieste prima che tocchino la logica della pagina. Il ciclo di vita di un token di autenticazione.
3. Best Practice & Errori Comuni
    • Best Practice: Proteggi le rotte sensibili a livello di Middleware, non solo nei componenti. Salva sempre l'ID utente esterno (di Neon Auth) nel tuo database Prisma per collegarci le operazioni.
    • Errori più comuni: Passare dati sensibili dell'utente al frontend nei Server Components. Dimenticarsi di revocare i cookie al logout.
4. Pratica: Struttura File e Comandi
    • Struttura file coinvolti:
      Plaintext
      middleware.ts       # Protezione rotte (direttamente nella root del progetto)
      /app/(auth)         # Layout raggruppato (login, register)
      /lib/auth.ts        # Funzioni helper (es. getUser())
5. Esercizi di Consolidamento
    • Crea un Middleware che reindirizzi a /login chiunque provi ad accedere a /dashboard se non è loggato.
    • Salva il ruolo utente ("Admin", "Tecnico") nei metadata del token e mostralo nella navbar.
6. Checklist e Checkpoint Finale
    • Login e registrazione funzionanti.
    • Rotte private inaccessibili da sloggati.
    • Utente sincronizzato nel DB locale Prisma.
    • Checkpoint Finale: Effettua l'accesso come "Tecnico", prova a navigare su un URL riservato all'Admin (es. /admin/users) e assicurati di ricevere un 403 o un redirect.
FASE 4 - Architettura Backend (Server Actions & Logica)
Tempo stimato: 4 giorni | Livello di difficoltà: Alto
1. Obiettivo e Perché ora
    • Obiettivo: Creare le fondamenta per l'accesso ai dati e la mutazione tramite Server Actions, integrandole con Zod per la validazione.
    • Perché in questo momento: Con i dati e gli utenti pronti, serve il "ponte" sicuro tra frontend e database prima di costruire l'interfaccia.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Server Actions, Data Validation, Error Handling.
    • Teoria: Come le Server Actions sostituiscono le API REST in Next.js. La differenza tra esecuzione sequenziale e transazioni di database.
3. Best Practice & Errori Comuni
    • Best Practice: Valida sempre e in modo rigoroso sia l'input che ricevi dal client (usa zod), sia che l'utente loggato abbia il permesso di eseguire quell'azione.
    • Errori più comuni: Fidarsi dei dati inviati dal client. Esporre i messaggi di errore grezzi del database (es. errori di Prisma) all'utente finale.
4. Pratica: Struttura File e Comandi
    • Comandi da eseguire:
      Bash
      npm i zod
    • Struttura file coinvolti:
      Plaintext
      /actions         # Server Actions isolate (es. quote-actions.ts)
      /schemas         # Schemi Zod (es. quote-schema.ts)
      /lib/dal.ts      # Data Access Layer (recupero dati riutilizzabile)
5. Esercizi di Consolidamento
    • Crea uno schema Zod CreateClientSchema.
    • Crea una Server Action createClient(data: FormData) che valida i dati, controlla l'auth, salva su DB con Prisma, gestisce l'errore e fa revalidatePath('/clients').
6. Checklist e Checkpoint Finale
    • Schemi Zod creati per le entità principali.
    • Server action per CRUD base funzionanti (isolate).
    • Checkpoint Finale: Testa la server action passandogli dati fittizi direttamente dal codice (senza form UI). Se Prisma salva e valida correttamente, il backend è solido.
FASE 5 - UI e Componenti (Forms & Data Table)
Tempo stimato: 5-7 giorni | Livello di difficoltà: Medio/Alto
1. Obiettivo e Perché ora
    • Obiettivo: Costruire le interfacce per la gestione di Clienti, Preventivi e Cantieri, collegandole alle Server Actions create nella Fase 4.
    • Perché in questo momento: L'infrastruttura sottostante è completa. Ora diamo vita all'applicazione per l'utente finale.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: React Hook Form + Zod, Optimistic UI, Composizione dei componenti.
    • Teoria: useTransition e useActionState in React per gestire stati di caricamento durante le Server Actions. Server Components (per visualizzare le tabelle) vs Client Components (per i forms interattivi).
3. Best Practice & Errori Comuni
    • Best Practice: Usa le DataTable di Shadcn/UI (TanStack Table) per listare i dati. Separa sempre il componente "Pagina" (Server, che fetcha i dati) dal componente "Form" (Client, che invia l'azione).
    • Errori più comuni: Rendere tutto l'albero un Client Component ("use client") solo perché serve un onClick, perdendo i vantaggi dell'App Router.
4. Pratica: Struttura File e Comandi
    • Comandi da eseguire:
      Bash
      npx shadcn-ui@latest add form table input dialog
      npm i react-hook-form @hookform/resolvers
    • Struttura file coinvolti:
      Plaintext
      /app/clients/page.tsx                    # Server Component (Fetch data)
      /app/clients/_components/client-form.tsx # Client Component
5. Esercizi di Consolidamento
    • Crea il form di "Creazione Preventivo" con React Hook Form, collegando i campi allo schema Zod della fase 4, e mostra gli errori di validazione sotto ogni input.
    • Per la funzione PDF, implementa una generazione tramite pacchetti come @react-pdf/renderer o un'API esterna.
6. Checklist e Checkpoint Finale
    • Tabelle dati implementate con paginazione.
    • Forms protetti da validazione Zod frontend e backend.
    • Stati di caricamento visibili (spinners/disabled buttons).
    • Checkpoint Finale: Naviga l'app come utente: crea un cliente, associagli un preventivo, trasforma il preventivo in cantiere. Se l'UX è fluida e non ci sono refresh forzati, ottimo lavoro.
FASE 6 - Dashboard (Analytics & Perf)
Tempo stimato: 2 giorni | Livello di difficoltà: Medio
1. Obiettivo e Perché ora
    • Obiettivo: Creare le metriche di riepilogo (Preventivi aperti, accettati, fatturato) utilizzando aggregazioni su database.
    • Perché in questo momento: Ha senso costruire analytics solo dopo aver creato i moduli che generano i dati.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Aggregazioni SQL tramite Prisma, Caching in Next.js, Suspense e Streaming.
    • Teoria: Come Next.js memorizza in cache le richieste. L'utilizzo di <Suspense> per fare lo streaming differito dei Widget della Dashboard senza bloccare il caricamento della pagina intera.
3. Best Practice & Errori Comuni
    • Best Practice: Calcola il "Fatturato" tramite funzioni aggregate di Prisma (groupBy, aggregate), non portare tutti i preventivi in memoria server per calcolarli con reduce in Javascript!
    • Errori più comuni: Fare una mega-query bloccante all'inizio della pagina Dashboard. Mostrare il loader per 5 secondi rendendo l'app percepita come lenta.
4. Pratica: Struttura File e Comandi
    • Struttura file coinvolti:
      Plaintext
      /app/dashboard/page.tsx
      /app/dashboard/_components/stat-card.tsx
      /app/dashboard/loading.tsx
5. Esercizi di Consolidamento
    • Crea 3 query Prisma distinte per le statistiche.
    • Avvolgi ogni "Widget" in un componente e usa <Suspense fallback={<Skeleton />}> per farli apparire uno ad uno mano a mano che il db risponde.
6. Checklist e Checkpoint Finale
    • Metriche calcolate correttamente.
    • Suspense implementato per UI non bloccante.
    • Checkpoint Finale: Ricarica la Dashboard. Dovresti vedere lo scheletro della struttura quasi istantaneamente, seguito dai dati veri popolati poco dopo.
FASE 7 - Testing
Tempo stimato: 3 giorni | Livello di difficoltà: Alto
1. Obiettivo e Perché ora
    • Obiettivo: Garantire stabilità scrivendo test per i flussi critici (es. calcolo preventivo, permessi utente).
    • Perché in questo momento: Con l'app funzionante, dobbiamo "bloccare" il comportamento corretto prima del rilascio, prevenendo regressioni future.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: Test Piramid, Mocks, E2E Testing.
    • Teoria: La differenza tra Unit test (testare una funzione che calcola l'IVA) e E2E test (testare che l'utente riesca a fare login e cliccare "Crea Cantiere").
3. Best Practice & Errori Comuni
    • Best Practice: Non testare "React" (es. non testare che il bottone cambi colore). Testa il valore di business: i permessi RBAC e i calcoli matematici dei preventivi. Usa Playwright per un test E2E felice ("Happy Path").
    • Errori più comuni: Mirare al 100% di code coverage testando cose inutili (getter/setter). Usare il database di produzione per far girare i test.
4. Pratica: Struttura File e Comandi
    • Comandi da eseguire:
      Bash
      npm i -D vitest @testing-library/react
      npm init playwright@latest
    • Struttura file coinvolti:
      Plaintext
      /tests/unit        # File di vitest (es. calc.test.ts)
      /e2e               # File di Playwright
5. Esercizi di Consolidamento
    • Scrivi un test unitario con Vitest per assicurarti che un utente "Commerciale" non possa chiamare l'action deleteConstructionSite().
    • Scrivi un test Playwright che fa login, va sui Clienti, e verifica che la tabella esista.
6. Checklist e Checkpoint Finale
    • Unit test sui calcoli critici e schemi Zod.
    • Almeno 1 test E2E per il flusso principale (Happy path).
    • Checkpoint Finale: Lancia npm run test e npx playwright test. Se tutto è verde, il codice è "production-ready".
FASE 8 - Deploy
Tempo stimato: 1 giorno | Livello di difficoltà: Basso/Medio
1. Obiettivo e Perché ora
    • Obiettivo: Portare l'ERP online e configurare ambienti di staging e produzione.
    • Perché in questo momento: L'app è testata, finita e pronta per l'utilizzo reale da parte degli artigiani.
2. Teoria e Concetti da Apprendere
    • Obiettivi di apprendimento: CI/CD base, Gestione Environment Variables, Edge Runtime vs Node Runtime.
    • Teoria: Come Vercel gestisce il deploy serverless. Capire la differenza concettuale tra il database locale usato fino ad ora e quello di produzione.
3. Best Practice & Errori Comuni
    • Best Practice: Usa variabili d'ambiente diverse per Staging e Produzione. Imposta branch protection rule su GitHub per non poter pushare direttamente sul branch main.
    • Errori più comuni: Dimenticarsi di impostare l'URL base (es. NEXT_PUBLIC_APP_URL) su Vercel, rompendo redirect, webhooks o auth. Non limitare le IP/origini accettate dal DB di produzione.
4. Pratica: Struttura File e Comandi
    • Collega il repository GitHub a Vercel tramite interfaccia grafica.
    • Imposta le chiavi segrete .env nella dashboard Vercel (Prisma URL, Neon Auth keys).
5. Esercizi di Consolidamento
    • Verifica di aver rimosso tutti i console.log usando le regole di ESLint.
    • Esegui un npm run build in locale per scovare errori di Type Checking prima che fallisca su Vercel.
6. Checklist e Checkpoint Finale
    • npm run build eseguito in locale con successo.
    • Variabili .env configurate su Vercel.
    • Database di Produzione creato e migrato.
    • Checkpoint Finale: L'app è accessibile via browser sull'URL pubblico. L'autenticazione funziona e i dati persistono. Hai costruito un ERP professionale. Complimenti!

