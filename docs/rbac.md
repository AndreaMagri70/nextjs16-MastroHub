# RBAC - Fase 0

## Obiettivo

Definire chi puo vedere, creare, modificare o cancellare le principali risorse di MastroHub prima di implementare database, autenticazione e Server Actions.

## Ruoli iniziali

### ADMIN

Ha accesso completo al gestionale. Gestisce utenti, ruoli, clienti, preventivi, cantieri e impostazioni.

### MANAGER

Coordina lavoro commerciale e operativo. Gestisce clienti, preventivi e cantieri, ma non modifica ruoli o impostazioni globali.

### SALES

Lavora su clienti e preventivi. Non gestisce cantieri operativi oltre alla lettura dello stato.

### TECHNICIAN

Lavora sui cantieri assegnati. Puo aggiornare stato e note operative, ma non creare clienti, preventivi o utenti.

## Matrice permessi

| Risorsa    | Azione                           | ADMIN | MANAGER | SALES | TECHNICIAN                                     |
| ---------- | -------------------------------- | ----- | ------- | ----- | ---------------------------------------------- |
| Utenti     | Leggere utenti                   | Si    | Si      | No    | No                                             |
| Utenti     | Creare utenti                    | Si    | No      | No    | No                                             |
| Utenti     | Modificare ruoli                 | Si    | No      | No    | No                                             |
| Clienti    | Leggere clienti                  | Si    | Si      | Si    | Solo clienti dei cantieri assegnati            |
| Clienti    | Creare clienti                   | Si    | Si      | Si    | No                                             |
| Clienti    | Modificare clienti               | Si    | Si      | Si    | No                                             |
| Clienti    | Eliminare clienti                | Si    | No      | No    | No                                             |
| Preventivi | Leggere preventivi               | Si    | Si      | Si    | Solo lettura se collegati a cantieri assegnati |
| Preventivi | Creare preventivi                | Si    | Si      | Si    | No                                             |
| Preventivi | Modificare preventivi in bozza   | Si    | Si      | Si    | No                                             |
| Preventivi | Accettare o rifiutare preventivi | Si    | Si      | Si    | No                                             |
| Preventivi | Eliminare preventivi             | Si    | No      | No    | No                                             |
| Cantieri   | Leggere cantieri                 | Si    | Si      | Si    | Solo assegnati                                 |
| Cantieri   | Creare cantieri da preventivo    | Si    | Si      | No    | No                                             |
| Cantieri   | Modificare dettagli cantiere     | Si    | Si      | No    | Solo note e stato dei cantieri assegnati       |
| Cantieri   | Assegnare tecnici                | Si    | Si      | No    | No                                             |
| Cantieri   | Eliminare cantieri               | Si    | No      | No    | No                                             |
| Dashboard  | Vedere metriche globali          | Si    | Si      | No    | No                                             |
| Dashboard  | Vedere metriche commerciali      | Si    | Si      | Si    | No                                             |

## Regole di autorizzazione

- Ogni lettura o modifica deve partire dall'utente autenticato.
- Le Server Actions dovranno verificare sempre autenticazione e autorizzazione, anche se la pagina e' gia protetta.
- Gli ID ricevuti dal client non sono affidabili: ogni risorsa va riletta dal database prima della mutazione.
- I tecnici vedono solo cantieri assegnati tramite `ConstructionSiteAssignment`.
- I record con `deletedAt` valorizzato non devono comparire nelle liste operative.
- I dati restituiti ai Client Components devono essere DTO minimi, non record Prisma completi.

## Regole per risorse specifiche

### Clienti

- `ADMIN`, `MANAGER` e `SALES` possono creare clienti.
- Solo `ADMIN` puo eseguire soft delete di un cliente.
- Un cliente con preventivi o cantieri collegati non viene mai eliminato fisicamente.

### Preventivi

- `ADMIN`, `MANAGER` e `SALES` possono creare preventivi.
- Un preventivo `DRAFT` puo essere modificato da chi ha permesso commerciale.
- Un preventivo `ACCEPTED`, `REJECTED` o `EXPIRED` non deve essere modificato nei dati economici.
- Solo `ADMIN` puo soft-eliminare un preventivo.

### Cantieri

- `ADMIN` e `MANAGER` possono creare cantieri da preventivi accettati.
- `TECHNICIAN` puo aggiornare solo stato operativo e note dei cantieri assegnati.
- `SALES` puo leggere lo stato del cantiere per supporto cliente, ma non modificarlo.
- Solo `ADMIN` puo soft-eliminare un cantiere.

## Checkpoint tutor

Prima della Fase 1 dobbiamo confermare:

- I ruoli iniziali sono corretti.
- La differenza tra `MANAGER` e `SALES` e' chiara.
- Il tecnico deve vedere solo i propri cantieri.
- La creazione cantiere deve partire solo da un preventivo accettato.

Se questi punti sono approvati, la prossima fase sara' il setup dell'ambiente: Prettier, Shadcn/UI e pagina `/sandbox` per verificare Tailwind e componenti UI.
