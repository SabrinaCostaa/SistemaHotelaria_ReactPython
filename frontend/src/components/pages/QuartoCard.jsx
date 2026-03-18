import React from 'react';

const QuartoCard = ({ quarto }) => {
  // Define a cor com base no status vindo do backend
  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponivel':
        return 'bg-success text-white'; // Verde
      case 'ocupado':
        return 'bg-danger text-white';  // Vermelho
      case 'limpeza':
      case 'manutenção':
        return 'bg-warning text-dark';  // Amarelo
      default:
        return 'bg-secondary text-white'; // Cinza
    }
  };

  return (
    <div className={`card h-100 shadow-sm ${getStatusClasses(quarto.status)}`} style={{ minWidth: '150px' }}>
      <div className="card-body text-center">
        <h6 className="card-subtitle mb-2 opacity-75">Quarto</h6>
        <h2 className="card-title font-weight-bold">{quarto.numero}</h2>
        <p className="card-text small mb-0">{quarto.tipo}</p>
        <hr className="my-2 border-white opacity-25" />
        <span className="badge badge-light shadow-sm text-uppercase" style={{ fontSize: '0.7rem' }}>
          {quarto.status}
        </span>
      </div>
    </div>
  );
};

export default QuartoCard;