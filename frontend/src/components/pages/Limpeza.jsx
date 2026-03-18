import React, { useState, useEffect } from 'react';

  const Limpeza = () => {
    const [quartosSuja, setQuartosSuja] = useState([
      { id: 1, quarto_id: 101, prioridade: "ALTA", status: "SUJO", tipo: "Luxo" },
      { id: 2, quarto_id: 105, prioridade: "MÉDIA", status: "AGUARDANDO", tipo: "Standard" },
      { id: 3, quarto_id: 202, prioridade: "BAIXA", status: "LIMPEZA EM ANDAMENTO", tipo: "Suíte" }]);  
  
    const [loading, setLoading] = useState(false);

  const API_LIMPEZA = "http://localhost:8005/limpeza"; // Microserviço de Limpeza
  const API_QUARTOS = "http://localhost:8002/quartos"; // Microserviço de Quartos

  const carregarQuartosParaLimpeza = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_LIMPEZA);
      
      // Se o status for 404 ou qualquer erro
      if (!res.ok) {
        console.error("Serviço de limpeza retornou erro:", res.status);
        setQuartosSuja([]); // Mantém como lista vazia para não quebrar o .map()
        return;
      }

      const data = await res.json();
      
      setQuartosSuja(Array.isArray(data) ? data : []);
      
    } catch (e) {
      console.error("Erro de conexão com microserviço de limpeza:", e);
      setQuartosSuja([]); // Evita o erro de .map
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //carregarQuartosParaLimpeza();
  }, []);

  const finalizarLimpeza = async (idTarefa) => {
    if (window.confirm("Confirmar que a limpeza deste quarto foi concluída?")) {
      try {
        // Envia o comando para o microserviço de limpeza
        await fetch(`${API_LIMPEZA}/${idTarefa}/concluir`, { method: 'POST' });
        alert("Limpeza concluída! O status do quarto será atualizado.");
        carregarQuartosParaLimpeza();
      } catch (e) {
        alert("Erro ao finalizar limpeza.");
      }
    }
  };

  if (loading) return <div className="container mt-5 text-center"><h4>Carregando escala de limpeza...</h4></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        
        <div className="card-header bg-warning text-white text-center p-3">
            <h2 className="m-0 fw-bold">Gestão de Limpeza e Governança</h2>
        </div>

        <div className="card-body p-4">
          <p className="text-muted text-center mb-4">
            Abaixo estão listados os quartos que aguardam limpeza após o check-out ou solicitação.
          </p>

          <div className="table-responsive">
            <table className="table table-hover align-middle border text-center">
              <thead className="table-dark">
                <tr>
                  <th className="py-3">Quarto</th>
                  <th className="py-3">Tipo</th>
                  <th className="py-3">Prioridade</th>
                  <th className="py-3">Status Atual</th>
                  <th className="py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {quartosSuja.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-5 text-muted italic">
                      Todos os quartos estão limpos e higienizados!
                    </td>
                  </tr>
                ) : (
                  quartosSuja.map((tarefa) => (
                    <tr key={tarefa.id}>
                      <td className="fw-bold fs-5">Nº {tarefa.quarto_id}</td>
                      <td><span className="badge bg-light text-dark border">Padrão</span></td>
                      <td>
                        <span className={`fw-bold ${tarefa.prioridade === 'ALTA' ? 'text-danger' : 'text-warning'}`}>
                          {tarefa.prioridade || 'MÉDIA'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark px-3 py-2 text-uppercase">
                          AGUARDANDO LIMPEZA
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => finalizarLimpeza(tarefa.id)}
                          className="btn btn-success btn-sm px-4 fw-bold shadow-sm"
                        >
                          CONCLUIR LIMPEZA
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <button onClick={carregarQuartosParaLimpeza} className="btn btn-outline-secondary btn-sm">
              Atualizar Escala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Limpeza;