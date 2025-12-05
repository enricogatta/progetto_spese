import React, { useState, useEffect, useCallback } from 'react';
import ItemSpesa from './ItemSpesa';
import FormSpesa from './FormSpesa';
import GraficoSpese from './GraficoSpese';
import './App.css'; 

// URL base della tua istanza PocketBase locale
const PB_URL = 'http://127.0.0.1:8090'; 

// Funzione di utilità per convertire YYYY-MM-DD in formato ISO 8601 (richiesto da PocketBase)
const toPocketBaseDateTime = (dateString) => {
    if (!dateString) return null;
    // Creiamo la data in UTC per evitare problemi di fuso orario
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const dateObject = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    
    if (isNaN(dateObject)) return null; 
    return dateObject.toISOString();
};


function App() {
  const [spese, setSpese] = useState([]); 
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [spesaDaModificare, setSpesaDaModificare] = useState(null);

  // ------------------------------------------------------------------
  // READ: Recupero delle Spese da PocketBase 
  // ------------------------------------------------------------------

  const fetchSpese = useCallback(async () => {
    setCaricamento(true);
    setErrore(null);
    try {
      const endpoint = `${PB_URL}/api/collections/spese/records?sort=-data_acquisto`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}. Controlla che PocketBase sia attivo e le API Rules siano "Anyone".`);
      }
      
      const data = await response.json();
      
      setSpese(data.items); 
    } catch (err) {
      console.error("Errore nel recupero delle spese:", err);
      setErrore("Impossibile caricare i dati. Verifica che PocketBase sia attivo e la collezione 'spese' sia configurata correttamente (URL, Rules).");
      setSpese([]);
    } finally {
      setCaricamento(false);
    }
  }, []); 

  useEffect(() => {
    fetchSpese();
  }, [fetchSpese]); 

  // ------------------------------------------------------------------
  // CREATE: Aggiunta di una Nuova Spesa 
  // ------------------------------------------------------------------

  const handleAggiungiSpesa = async (nuovaSpesa) => {
    try {
        // --- Validazione e Conversione Dati (CREATE) ---
        if (!nuovaSpesa.descrizione || nuovaSpesa.descrizione.trim() === "") {
            setErrore("La descrizione non può essere vuota.");
            return;
        }

        // Gestione Importo (Converti in numero e gestisci la virgola italiana)
        if (nuovaSpesa.importo === undefined || nuovaSpesa.importo === null) {
            setErrore("L'importo non può essere vuoto.");
            return;
        }
        
        let importoString = String(nuovaSpesa.importo).replace(',', '.');
        let importoNumerico = parseFloat(importoString);
        
        if (isNaN(importoNumerico) || importoNumerico <= 0) {
            setErrore("Errore nell'aggiunta: L'importo non è un numero valido (> 0).");
            return; 
        }
        nuovaSpesa.importo = importoNumerico;

        // Gestione Data (Converti nel formato PocketBase)
        if (!nuovaSpesa.data_acquisto) {
            setErrore("La data non può essere vuota.");
            return;
        }
        let dataConvertita = toPocketBaseDateTime(nuovaSpesa.data_acquisto);
        if (!dataConvertita) {
            setErrore("Il formato della data non è valido.");
            return;
        }
        nuovaSpesa.data_acquisto = dataConvertita;
        // --- Fine Validazione ---

      const response = await fetch(`${PB_URL}/api/collections/spese/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuovaSpesa),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Dettagli errore PocketBase (Create):", errorDetails);
        throw new Error(`Errore HTTP: ${response.status}. Dettagli: ${JSON.stringify(errorDetails)}`);
      }

      const recordCreato = await response.json();

      // Aggiorna lo stato locale
      setSpese((prevSpese) => {
        const updatedSpese = [recordCreato, ...prevSpese];
        return updatedSpese.sort((a, b) => new Date(b.data_acquisto) - new Date(a.data_acquisto));
      });
      setErrore(null); // Resetta gli errori
      
    } catch (err) {
      console.error("Errore nell'aggiunta della spesa:", err);
      // Mostra un errore più specifico se possibile
      if (!errore) {
          setErrore("Errore nell'aggiunta della spesa. Riprova e assicurati che i campi siano validi.");
      }
    }
  };


  // ------------------------------------------------------------------
  // UPDATE: Modifica di una Spesa 
  // ------------------------------------------------------------------

  const handleModificaSpesa = async (id, spiesa) => {
    try {
      // Validazione
      if (!spiesa.descrizione || spiesa.descrizione.trim() === "") {
        setErrore("La descrizione non può essere vuota.");
        return;
      }

      if (spiesa.importo === undefined || spiesa.importo === null) {
        setErrore("L'importo non può essere vuoto.");
        return;
      }
      
      let importoString = String(spiesa.importo).replace(',', '.');
      let importoNumerico = parseFloat(importoString);
      
      if (isNaN(importoNumerico) || importoNumerico <= 0) {
        setErrore("L'importo non è un numero valido (> 0).");
        return; 
      }
      spiesa.importo = importoNumerico;

      if (!spiesa.data_acquisto) {
        setErrore("La data non può essere vuota.");
        return;
      }
      let dataConvertita = toPocketBaseDateTime(spiesa.data_acquisto);
      if (!dataConvertita) {
        setErrore("Il formato della data non è valido.");
        return;
      }
      spiesa.data_acquisto = dataConvertita;

      const response = await fetch(`${PB_URL}/api/collections/spese/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spiesa),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Dettagli errore PocketBase (Update):", errorDetails);
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const recordAggiornato = await response.json();

      // Aggiorna lo stato locale
      setSpese((prevSpese) => {
        const updatedSpese = prevSpese.map((s) => s.id === id ? recordAggiornato : s);
        return updatedSpese.sort((a, b) => new Date(b.data_acquisto) - new Date(a.data_acquisto));
      });
      setErrore(null);
      
    } catch (err) {
      console.error("Errore nella modifica della spesa:", err);
      setErrore("Errore nella modifica della spesa. Riprova.");
    }
  };

  // Handler wrapper per la modifica dal click su ItemSpesa
  const handleClickModificaSpesa = (spesa) => {
    setSpesaDaModificare(spesa);
  };

  // Handler per annullare la modifica
  const handleAnnullaModifica = () => {
    setSpesaDaModificare(null);
  };

  // ------------------------------------------------------------------
  // DELETE: Eliminazione di una Spesa 
  // ------------------------------------------------------------------

  const handleEliminaSpesa = async (id) => {
    const endpoint = `${PB_URL}/api/collections/spese/records/${id}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      setSpese((prevSpese) => 
        prevSpese.filter((spesa) => spesa.id !== id)
      );
      
    } catch (err) {
      console.error(`Errore nell'eliminazione della spesa ID: ${id}`, err);
      setErrore("Errore nell'eliminazione della spesa. Riprova.");
    }
  };

  // ------------------------------------------------------------------
  // 5. Renderizzazione
  // ------------------------------------------------------------------

  // Calcola il totale delle spese (utile per il banner)
  const totaleSpese = spese.reduce((acc, s) => acc + (Number(s.importo) || 0), 0);
  const formattedTotale = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(totaleSpese);

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="total-banner">
        <div className="total-left">
          <h3>Totale Spese</h3>
          <div className="total-amount">{formattedTotale}</div>
        </div>
        <div className="total-right">
          <div className="total-meta">{spese.length} {spese.length === 1 ? 'voce' : 'voci'}</div>
        </div>
      </div>

      <FormSpesa 
        onAggiungiSpesa={handleAggiungiSpesa}
        spesaDaModificare={spesaDaModificare}
        onModificaSpesa={handleModificaSpesa}
        onAnnulla={handleAnnullaModifica}
      /> 

      <hr />

      {/* NUOVA STRUTTURA DEL TITOLO CON IL BADGE */}
      <div className="section-header">
        <h2>Lista delle Spese Recenti</h2>
        <span className="badge-spese">
          {caricamento ? '...' : spese.length} {spese.length === 1 ? 'Spesa' : 'Spese'}
        </span>
      </div>

      {errore && <p className="error-message">ERRORE: {errore}</p>}
      
      {caricamento ? (
        <p>Caricamento spese in corso...</p>
      ) : (
        spese.length === 0 ? (
          <p>Nessuna spesa registrata. Aggiungi la prima spesa qui sopra!</p>
        ) : (
          <ul className="spese-list">
            {spese.map((spesa) => (
              <ItemSpesa 
                key={spesa.id} 
                spesa={spesa} 
                onElimina={handleEliminaSpesa}
                onModifica={handleClickModificaSpesa} 
              />
            ))}
          </ul>
        )
      )}

      <hr />
      
      <GraficoSpese spese={spese} /> 
    </div>
  );
}

export default App;