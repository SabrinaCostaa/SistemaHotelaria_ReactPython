import React, { useState, useEffect } from 'react';

const GerenciamentoReservas = () => {
  const [reservas, setReservas] = useState([
  { id: 1, hospede_id: 1, quarto_id: 101, data_checkin: "2026-03-20", data_checkout: "2026-03-25", status: "CONFIRMADA" },
  { id: 2, hospede_id: 2, quarto_id: 102, data_checkin: "2026-03-18", data_checkout: "2026-03-20", status: "PENDENTE" },
  { id: 3, hospede_id: 3, quarto_id: 201, data_checkin: "2026-04-01", data_checkout: "2026-04-05", status: "CONFIRMADA" }
]);  const [loading, setLoading] = useState(false);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
    hospede_id: '',
    quarto_id: '',
    data_checkin: '',
    data_checkout: ''
  });

  const API_RESERVAS = "http://localhost:8003/reservas";

  const carregarReservas = async () => {
      try {
        const res = await fetch(API_RESERVAS);
        if (res.ok) {
          const data = await res.json();
          setReservas(data);
        }
      } catch (e) {
        console.log("Mantendo dados mockados devido a erro de conexão.");
      }
  };

  useEffect(() => { 
    //carregarReservas(); 
  }, []);

const handleSalvarReserva = async (e) => {
    e.preventDefault();
    
    // verifica se todos os campos estão preenchidos antes de enviar a requisição
    if (!formData.hospede_id || !formData.quarto_id || !formData.data_checkin || !formData.data_checkout) {
      alert("Por favor, preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const response = await fetch(API_RESERVAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospede_id: parseInt(formData.hospede_id), // Converte para inteiro para o FastAPI
          quarto_id: parseInt(formData.quarto_id),   // Converte para inteiro
          data_checkin: formData.data_checkin,
          data_checkout: formData.data_checkout,
          status: "RESERVADO" // Status inicial padrão
        }),
      });

      if (response.ok) {
        alert("Reserva criada com sucesso!");
        // Limpa o formulário após salvar
        setFormData({ hospede_id: '', quarto_id: '', data_checkin: '', data_checkout: '' });
        // Atualiza a tabela automaticamente
        carregarReservas();
      } else {
        const erro = await response.json();
        alert(`Erro ao salvar: ${erro.detail || "Verifique a conexão com os microserviços."}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao Microserviço de Reservas.");
    }
  };
  
  if (loading) return <div className="container mt-5 text-center"><h4>Carregando interface operacional...</h4></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        
        <div className="card-header bg-danger text-white text-center p-3" style={{ backgroundColor: '#dc3545' }}>
          <h2 className="m-0 fw-bold">Gerenciamento de Reservas</h2>
        </div>

        <div className="card-body p-4">
          
          <form onSubmit={handleSalvarReserva}>
            <div className="row g-3 text-center">
              <div className="col-md-3">
                <label className="form-label fw-normal">ID Hóspede</label>
                <input 
                  type="number" 
                  className="form-control text-center bg-light" 
                  placeholder="Ex: 1"
                  value={formData.hospede_id}
                  onChange={(e) => setFormData({...formData, hospede_id: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-normal">ID Quarto</label>
                <input 
                  type="number" 
                  className="form-control text-center bg-light" 
                  placeholder="Ex: 101"
                  value={formData.quarto_id}
                  onChange={(e) => setFormData({...formData, quarto_id: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-normal">Data Check-in</label>
                <input 
                  type="date" 
                  className="form-control text-center bg-light"
                  value={formData.data_checkin}
                  onChange={(e) => setFormData({...formData, data_checkin: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-normal">Data Check-out</label>
                <input 
                  type="date" 
                  className="form-control text-center bg-light"
                  value={formData.data_checkout}
                  onChange={(e) => setFormData({...formData, data_checkout: e.target.value})}
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm">
                Salvar Reserva
              </button>
            </div>
          </form>

          <hr className="my-5 opacity-25" />

          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-dark text-center">
                <tr>
                  <th className="py-3">#</th>
                  <th className="py-3">Hóspede (ID)</th>
                  <th className="py-3">Quarto (ID)</th>
                  <th className="py-3">Período</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {reservas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-muted">Nenhuma reserva encontrada no banco de dados.</td>
                  </tr>
                ) : (
                  reservas.map((res) => (
                    <tr key={res.id}>
                      <td className="text-muted">•</td>
                      <td className="fw-bold">{res.hospede_id}</td>
                      <td>{res.quarto_id}</td>
                      <td className="small text-secondary">
                        {res.data_checkin} — {res.data_checkout}
                      </td>
                      <td>
                        <span className="badge bg-info text-dark px-3 py-2 text-uppercase">
                          {res.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm px-3 shadow-sm">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <button onClick={carregarReservas} className="btn btn-outline-secondary btn-sm">
              Atualizar Lista
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GerenciamentoReservas;