import React from 'react';
import MapaReservas from './MapaReservas';
import { Link } from 'react-router-dom';

const Home = () => {
  // Dados fictícios para os indicadores
  const indicadores = [
    { titulo: "Ocupação", valor: "75%", cor: "success", detalhe: "15 de 20 quartos" },
    { titulo: "Check-ins Hoje", valor: "4", cor: "primary", detalhe: "Previstos para tarde" },
    { titulo: "Para Limpeza", valor: "3", cor: "warning", detalhe: "Urgência: Média" },
  ];

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Painel de Controle</h2>
          <p className="text-muted">Bem-vindo(a) de volta ao sistema de gestão do hotel!</p>
        </div>
        <Link to="/reservas" className="btn btn-primary shadow-sm">
          + Nova Reserva
        </Link>
      </div>

      <div className="row g-3 mb-5">
        {indicadores.map((ind, index) => (
          <div className="col-md-4" key={index}>
            <div className={`card border-0 border-start border-4 border-${ind.cor} shadow-sm h-100`}>
              <div className="card-body">
                <h6 className={`text-${ind.cor} fw-bold text-uppercase small`}>{ind.titulo}</h6>
                <h2 className="fw-bold mb-1">{ind.valor}</h2>
                <small className="text-muted">{ind.detalhe}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-12">
          <MapaReservas />
        </div>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold mb-3">Atalhos Operacionais</h5>
        <div className="d-flex gap-2">
          <Link to="/hospedes" className="btn btn-outline-secondary btn-sm">Cadastrar Hóspede</Link>
          <Link to="/limpeza" className="btn btn-outline-secondary btn-sm">Lista de Governança</Link>
          <Link to="/about" className="btn btn-outline-secondary btn-sm">Ajuda do Sistema</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;