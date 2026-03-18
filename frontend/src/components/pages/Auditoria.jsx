import React from 'react';

const Auditoria = () => {
  // Dados simulados de log
  const logs = [
    { id: 1, usuario: "admin", acao: "Alteração de Status", descricao: "Quarto 101 alterado para 'Disponível'", data: "16/03/2026 14:30" },
    { id: 2, usuario: "recepcao_01", acao: "Novo Check-in", descricao: "Hóspede Sabrina Costa vinculado ao Quarto 102", data: "16/03/2026 13:15" },
    { id: 3, usuario: "sistema", acao: "Backup", descricao: "Backup automático concluído com sucesso", data: "16/03/2026 00:00" },
    { id: 4, usuario: "limpeza_user", acao: "Baixa de Limpeza", descricao: "Quarto 103 marcado como 'Limpo'", data: "15/03/2026 18:45" },
    { id: 5, usuario: "admin", acao: "Exclusão", descricao: "Reserva #88 cancelada por solicitação do cliente", data: "15/03/2026 16:20" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"> Relatórios de Auditoria</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={() => window.print()}>
          🖨️ Exportar PDF
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Data/Hora</th>
                  <th>Usuário</th>
                  <th>Ação</th>
                  <th>Descrição</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted small">{log.data}</td>
                    <td><span className="badge bg-secondary">{log.usuario}</span></td>
                    <td><strong>{log.acao}</strong></td>
                    <td>{log.descricao}</td>
                    <td>
                      <span className="text-success">● Sucesso</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p className="mt-3 text-muted small">
        * Os logs são mantidos por 90 dias conforme a política de segurança do laboratório.
      </p>
    </div>
  );
};

export default Auditoria;