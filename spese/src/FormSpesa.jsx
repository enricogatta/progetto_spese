import React, { useState, useEffect } from 'react';

function FormSpesa({ onAggiungiSpesa, spesaDaModificare, onModificaSpesa, onAnnulla }) {
  // Stato interno per i campi del form
  const [descrizione, setDescrizione] = useState('');
  const [importo, setImporto] = useState('');
  // ✅ Reintrodotto il campo data_acquisto con la data odierna come default
  const [dataAcquisto, setDataAcquisto] = useState(new Date().toISOString().split('T')[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Effetto per popolare il form quando si seleziona una spesa da modificare
  useEffect(() => {
    if (spesaDaModificare) {
      setIsEditing(true);
      setDescrizione(spesaDaModificare.descrizione);
      setImporto(spesaDaModificare.importo.toString());
      // Estrai la data nel formato YYYY-MM-DD
      const date = new Date(spesaDaModificare.data_acquisto);
      setDataAcquisto(date.toISOString().split('T')[0]);
    }
  }, [spesaDaModificare]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!descrizione || !importo || parseFloat(importo) <= 0 || !dataAcquisto) {
      alert("Per favore, inserisci descrizione, importo e data validi.");
      return;
    }

    const spesa = {
      descrizione,
      importo: parseFloat(importo), 
      data_acquisto: dataAcquisto,
    };

    if (isEditing && spesaDaModificare) {
      // Modalità modifica
      onModificaSpesa(spesaDaModificare.id, spesa);
      handleAnnulla();
    } else {
      // Modalità creazione
      onAggiungiSpesa(spesa);
      // Reset del form e re-impostazione della data a oggi
      setDescrizione('');
      setImporto('');
      setDataAcquisto(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAnnulla = () => {
    setIsEditing(false);
    setDescrizione('');
    setImporto('');
    setDataAcquisto(new Date().toISOString().split('T')[0]);
    if (onAnnulla) {
      onAnnulla();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Modifica Spesa' : 'Aggiungi Nuova Spesa'}</h3>
      <input
        type="text"
        placeholder="Descrizione (es: Caffè, Benzina)"
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Importo (€)"
        value={importo}
        onChange={(e) => setImporto(e.target.value)}
        min="0.01"
        step="0.01"
        required
      />
      {/* ✅ Nuovo Campo Data */}
      <input
        type="date"
        value={dataAcquisto}
        onChange={(e) => setDataAcquisto(e.target.value)}
        required
      />
      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Salva Modifiche' : 'Registra Spesa'}</button>
        {isEditing && <button type="button" onClick={handleAnnulla}>Annulla</button>}
      </div>
    </form>
  );
}

export default FormSpesa;