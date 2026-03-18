import React from 'react';
import './MapaReservas.css';

const MapaReservas = () => {
  // Dados Mockados
  const quartos = [
    { id: 101, numero: "101", tipo: "Standard" },
    { id: 102, numero: "102", tipo: "Luxo" },
    { id: 103, numero: "103", tipo: "Standard" },
  ];

  const reservas = [
    { id: 1, quarto_id: 101, hospede: "Sabrina", inicio: 2, fim: 5 },
    { id: 2, quarto_id: 102, hospede: "Henrique", inicio: 10, fim: 15 },
    { id: 3, quarto_id: 103, hospede: "João", inicio: 5, fim: 8 },
  ];

  const diasMes = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="m-0 fw-bold">Mapa de Ocupação Visual</h4>
        </div>
        <div className="card-body p-0 overflow-auto">
          <div className="gantt-wrapper">
            <div className="gantt-row header">
              <div className="gantt-cell label fw-bold">Quarto</div>
              {diasMes.map(dia => (
                <div key={dia} className="gantt-cell day">{dia}</div>
              ))}
            </div>
            {quartos.map(quarto => (
              <div key={quarto.id} className="gantt-row">
                <div className="gantt-cell label">
                  <strong>{quarto.numero}</strong> <br/>
                  <small className="text-muted">{quarto.tipo}</small>
                </div>
                
                {diasMes.map(dia => (
                  <div key={dia} className="gantt-cell day-slot"></div>
                ))}

                {reservas
                  .filter(r => r.quarto_id === quarto.id)
                  .map(r => (
                    <div 
                      key={r.id} 
                      className="gantt-bar bg-info text-white shadow-sm"
                      style={{ 
                        gridColumnStart: r.inicio + 1, // +1 por causa da label lateral
                        gridColumnEnd: r.fim + 1
                      }}
                    >
                      {r.hospede}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <div className="card-footer bg-light small text-muted">
          Legenda: Março 2026 - Arraste para os lados para ver mais dias.
        </div>
      </div>
    </div>
  );
};

export default MapaReservas;