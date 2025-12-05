import React from 'react';

// Versione semplificata senza stato di modifica
function ItemSpesa({ spesa, onElimina, onModifica }) {
  const { id, descrizione, importo, data_acquisto } = spesa;
  
  // Formatta la data dal campo data_acquisto
  const formattedDate = new Date(data_acquisto).toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const handleDelete = () => {
    onElimina(id); 
  };

  const handleEdit = () => {
    onModifica(spesa);
  };

  return (
    <li>
      {/* Descrizione: testo principale, a sinistra */}
      <span className="spesa-descrizione">{descrizione}</span>
      
      <div className="spesa-info-right">
        {/* Data: testo secondario (ora data_acquisto) */}
        <span className="spesa-data">{formattedDate}</span>
        
        {/* Importo: in grassetto e di colore rosso (per spesa) */}
        <span className="spesa-importo">
            {importo.toFixed(2)} €
        </span>
        
        {/* Bottone Modifica */}
        <button 
            onClick={handleEdit}
            className="edit-btn"
            aria-label={`Modifica spesa: ${descrizione}`}
            title="Modifica"
        >
            ✎
        </button>
        
        {/* Bottone Elimina */}
        <button 
            onClick={handleDelete}
            className="delete-btn"
            aria-label={`Elimina spesa: ${descrizione}`}
            title="Elimina"
        >
            &times;
        </button>
      </div>
    </li>
  );
}

export default ItemSpesa;