# Schema dati - Fase 0

## Assunzioni

- MastroHub e' un gestionale per artigiani: clienti, preventivi, cantieri e attivita operative.
- L'autenticazione sara' gestita con Neon Auth; nel database applicativo salveremo il riferimento esterno dell'utente.
- Le chiavi primarie saranno UUID o CUID, non interi sequenziali.
- Le entita operative principali avranno `createdAt` e `updatedAt`.
- Le entita fiscali o storiche non verranno eliminate fisicamente: useremo soft delete dove serve conservare audit e storico.

## Entita principali

### User

Rappresenta un utente interno dell'applicazione.

Campi previsti:

- `id`: identificatore interno.
- `authProviderId`: identificatore utente proveniente da Neon Auth.
- `email`: email di accesso.
- `name`: nome visualizzato.
- `role`: ruolo RBAC.
- `createdAt`: data di creazione.
- `updatedAt`: data di ultimo aggiornamento.
- `deletedAt`: soft delete opzionale.

Relazioni:

- Un `User` puo creare molti `Client`.
- Un `User` puo creare molti `Quote`.
- Un `User` puo essere assegnato a molti `ConstructionSite`.

### Client

Rappresenta un cliente privato o aziendale.

Campi previsti:

- `id`: identificatore interno.
- `ownerId`: utente che ha creato o gestisce il cliente.
- `type`: `PRIVATE` o `BUSINESS`.
- `name`: nome cliente o ragione sociale.
- `email`: email principale.
- `phone`: telefono principale.
- `taxCode`: codice fiscale opzionale.
- `vatNumber`: partita IVA opzionale.
- `address`: indirizzo sintetico.
- `notes`: note interne.
- `createdAt`: data di creazione.
- `updatedAt`: data di ultimo aggiornamento.
- `deletedAt`: soft delete.

Relazioni:

- Un `Client` appartiene a un `User`.
- Un `Client` puo avere molti `Quote`.
- Un `Client` puo avere molti `ConstructionSite`.

### Quote

Rappresenta un preventivo commerciale.

Campi previsti:

- `id`: identificatore interno.
- `clientId`: cliente collegato.
- `createdById`: utente che ha creato il preventivo.
- `number`: numero preventivo leggibile.
- `title`: titolo sintetico.
- `status`: stato del preventivo.
- `subtotal`: imponibile.
- `taxRate`: aliquota IVA applicata.
- `taxTotal`: totale IVA.
- `total`: totale preventivo.
- `validUntil`: scadenza validita.
- `acceptedAt`: data accettazione opzionale.
- `rejectedAt`: data rifiuto opzionale.
- `createdAt`: data di creazione.
- `updatedAt`: data di ultimo aggiornamento.
- `deletedAt`: soft delete.

Relazioni:

- Un `Quote` appartiene a un `Client`.
- Un `Quote` e' creato da un `User`.
- Un `Quote` contiene molte `QuoteItem`.
- Un `Quote` accettato puo generare un `ConstructionSite`.

### QuoteItem

Rappresenta una riga del preventivo.

Campi previsti:

- `id`: identificatore interno.
- `quoteId`: preventivo collegato.
- `description`: descrizione voce.
- `quantity`: quantita.
- `unitPrice`: prezzo unitario.
- `lineTotal`: totale riga.
- `sortOrder`: ordinamento manuale.
- `createdAt`: data di creazione.
- `updatedAt`: data di ultimo aggiornamento.

Relazioni:

- Un `QuoteItem` appartiene a un `Quote`.

### ConstructionSite

Rappresenta un cantiere o progetto operativo.

Campi previsti:

- `id`: identificatore interno.
- `clientId`: cliente collegato.
- `quoteId`: preventivo di origine opzionale.
- `managerId`: responsabile interno.
- `title`: nome cantiere.
- `status`: stato operativo.
- `startDate`: data inizio prevista o reale.
- `endDate`: data fine prevista o reale.
- `address`: luogo del cantiere.
- `notes`: note operative.
- `createdAt`: data di creazione.
- `updatedAt`: data di ultimo aggiornamento.
- `deletedAt`: soft delete.

Relazioni:

- Un `ConstructionSite` appartiene a un `Client`.
- Un `ConstructionSite` puo nascere da un `Quote`.
- Un `ConstructionSite` ha un responsabile `User`.
- Un `ConstructionSite` puo avere molti assegnatari tramite `ConstructionSiteAssignment`.

### ConstructionSiteAssignment

Rappresenta l'assegnazione di utenti a un cantiere.

Campi previsti:

- `id`: identificatore interno.
- `constructionSiteId`: cantiere collegato.
- `userId`: utente assegnato.
- `assignedAt`: data assegnazione.

Relazioni:

- Collega molti `User` a molti `ConstructionSite`.

## Stati iniziali

### QuoteStatus

- `DRAFT`: bozza interna.
- `SENT`: inviato al cliente.
- `ACCEPTED`: accettato.
- `REJECTED`: rifiutato.
- `EXPIRED`: scaduto.
- `CANCELLED`: annullato internamente.

### ConstructionSiteStatus

- `PLANNED`: pianificato.
- `IN_PROGRESS`: in lavorazione.
- `ON_HOLD`: sospeso.
- `COMPLETED`: completato.
- `CANCELLED`: annullato.

### UserRole

- `ADMIN`: gestione completa.
- `MANAGER`: gestione operativa e commerciale.
- `TECHNICIAN`: aggiornamento cantieri assegnati.
- `SALES`: gestione clienti e preventivi.

## Relazioni ER sintetiche

```text
User 1 -> N Client
User 1 -> N Quote
User 1 -> N ConstructionSite as manager
User N -> N ConstructionSite through ConstructionSiteAssignment

Client 1 -> N Quote
Client 1 -> N ConstructionSite

Quote 1 -> N QuoteItem
Quote 0..1 -> 0..1 ConstructionSite
```

## Regole di cancellazione

- `User`: soft delete, per non perdere storico di clienti, preventivi e cantieri.
- `Client`: soft delete; i preventivi e cantieri collegati restano consultabili.
- `Quote`: soft delete; mai eliminazione fisica per storico commerciale.
- `QuoteItem`: eliminazione fisica consentita solo se il preventivo e' in `DRAFT`.
- `ConstructionSite`: soft delete; mantiene storico operativo.
- `ConstructionSiteAssignment`: eliminazione fisica consentita, perche rappresenta una relazione modificabile.

## Domanda checkpoint

Come recuperare tutti i cantieri attivi di un cliente partendo dall'utente loggato:

1. Recuperare l'utente applicativo usando `authProviderId` dalla sessione Neon Auth.
2. Verificare il ruolo e i permessi dell'utente.
3. Filtrare il `Client` richiesto escludendo `deletedAt`.
4. Leggere i `ConstructionSite` del cliente con stato `PLANNED`, `IN_PROGRESS` o `ON_HOLD`.
5. Se il ruolo e' `TECHNICIAN`, limitare i risultati ai cantieri in cui l'utente e' assegnato.
