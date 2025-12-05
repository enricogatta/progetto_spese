# 💰 Expense Tracker Application

Un'applicazione web semplice e moderna sviluppata in React per tracciare e visualizzare le tue spese in tempo reale. Utilizza PocketBase come backend per una persistenza dei dati rapida e leggera.

## ✨ Funzionalità Principali

Questa applicazione è progettata per offrire un controllo completo e intuitivo sulle tue finanze personali:

1. **Gestione Completa delle Spese (CRUD):**
* **Crea:** Inserisci nuove spese con descrizione, importo e data.
* **Leggi:** Visualizza un elenco ordinato e aggiornato di tutte le spese.
* **Aggiorna (Modifica):** Modifica i dettagli di una spesa esistente direttamente dall'elenco.
* **Elimina:** Rimuovi le spese non necessarie in modo permanente.
2. **Dashboard Grafica:** Presenta una dashboard con il totale complessivo delle spese.
3. **Analisi della Distribuzione:** Genera un grafico a torta per visualizzare come le spese si distribuiscono per categoria (descrizione).
4. **Persistenza dei Dati:** Tutti i dati sono salvati e recuperati tramite un'istanza PocketBase configurata localmente.
5. **Design Responsive:** Interfaccia utente ottimizzata per l'uso su dispositivi mobili, tablet e desktop.

## 🛠️ Tecnologie Utilizzate

* **Frontend:** HTML, CSS, JavaScript (React Hooks).
* **Backend/Database:** PocketBase (utilizzato tramite Fetch API per le operazioni CRUD).
* **Grafici:** Recharts per la visualizzazione dei dati.

## 🚀 Istruzioni per l'Avvio Locale

Per avviare l'applicazione in locale, devi prima configurare il database PocketBase e poi avviare l'applicazione React.

### Passo 1: Configurazione di PocketBase

1. **Scarica PocketBase:** Visita il [sito ufficiale di PocketBase](https://pocketbase.io/) e scarica l'ultima release per il tuo sistema operativo.
2. **Avvia il Server:** Esegui il file PocketBase scaricato. Questo avvierà il server backend, di solito all'indirizzo `https://www.google.com/search?q=http://127.0.0.1:8090`.
3. **Configura la Collezione:**
* Apri l'interfaccia di amministrazione (visita `https://www.google.com/search?q=http://127.0.0.1:8090` nel browser).
* Crea una nuova collezione denominata ** `spese` ** .
* Aggiungi i seguenti campi:
* `descrizione`: Testo
* `importo`: Numero
* `data_acquisto`: Data/Ora
* **Regole API Importanti:** Per permettere all'app di funzionare, assicurati che le **API Rules** per la collezione `spese` siano impostate su "Anyone" per le operazioni `View`, `Create`, `Update` e `Delete`.

### Passo 2: Avvio dell'Applicazione React

L'applicazione è sviluppata in un singolo file React. Poiché l'applicazione utilizza il backend PocketBase all'indirizzo `https://www.google.com/search?q=http://127.0.0.1:8090`, non è necessario modificare l'URL nel codice a meno che tu non lo stia eseguendo su un server diverso.

1. Assicurati che il server PocketBase stia ancora funzionando (`https://www.google.com/search?q=http://127.0.0.1:8090`).
2. Avvia l'applicazione (in un ambiente di sviluppo React standard, questo implicherebbe l'uso di `npm install` e `npm start`).

L'applicazione si connetterà automaticamente al database PocketBase e inizierà a caricare e salvare i dati.
