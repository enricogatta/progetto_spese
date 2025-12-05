import React from 'react';
import { 
    Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Colori fissi per le categorie (estetica più pulita)
const CATEGORY_COLORS = [
    '#6c5ce7', // Viola principale
    '#0984e3', // Blu
    '#ff7f50', // Corallo
    '#feca57', // Giallo
    '#55efc4', // Menta
    '#a29bfe', // Lavanda
    '#e17055', // Terra
    '#2d3436', // Grigio scuro (per categorie aggiuntive)
    '#fab1a0', // Rosa chiaro
    '#ffeaa7', // Giallo chiaro
];

// Funzione per preparare i dati per il PieChart (Distribuzione per Categoria)
const prepareCategoryData = (spese) => {
    const spesePerDescrizione = spese.reduce((acc, spesa) => {
        // Capitalizza la descrizione per una visualizzazione pulita
        const desc = spesa.descrizione.charAt(0).toUpperCase() + spesa.descrizione.slice(1).toLowerCase(); 
        acc[desc] = (acc[desc] || 0) + spesa.importo;
        return acc;
    }, {});

    // Mappa nel formato array di oggetti con nomi e valori
    return Object.keys(spesePerDescrizione).map((name, index) => ({
        name: name,
        value: parseFloat(spesePerDescrizione[name].toFixed(2)),
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] // Cicla i colori
    }));
};


function GraficoSpese({ spese }) {
    
    const totaleSpese = spese.reduce((acc, spesa) => acc + spesa.importo, 0);

    // Dati per il grafico a torta
    const categoryData = prepareCategoryData(spese);

    // Formattatore per la tooltip (aggiunge €)
    const currencyFormatter = (value) => `${value.toFixed(2)} €`;

    // Formattatore per l'etichetta PieChart (mostra percentuale)
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        // Calcola la posizione del testo
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        // Non mostrare l'etichetta se la fetta è troppo piccola
        if ((percent * 100).toFixed(0) < 5) return null; 

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            
            <p className="total-expense">
                Totale Speso: {totaleSpese.toFixed(2)} €
            </p>

            {spese.length === 0 ? (
                <p>Aggiungi delle spese per visualizzare i grafici.</p>
            ) : (
                <div className="charts-grid" style={{ justifyContent: 'center' }}>
                    
                    {/* Grafico a Ciambella (Distribuzione per Categoria) - Ora è l'unico */}
                    <div className="chart-container doughnut-chart-container" style={{ margin: '0 auto' }}>
                        <h3>Distribuzione delle Spese</h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70} // Un po' più grande per l'estetica
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={3} // Spazio tra le fette
                                    labelLine={false}
                                    label={renderCustomizedLabel} // Mostra la percentuale
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color} 
                                            stroke={entry.color} // Bordo dello stesso colore
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={currencyFormatter} />
                                <Legend 
                                    layout="horizontal" 
                                    align="center" 
                                    verticalAlign="bottom" 
                                    wrapperStyle={{ paddingTop: '20px' }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GraficoSpese;