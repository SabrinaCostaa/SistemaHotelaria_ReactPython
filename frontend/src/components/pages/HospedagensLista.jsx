import React from 'react'
import Button from 'react-bootstrap/Button';

export default function HospedagensLista(props) {

  // Função para formatar data de forma segura
  const formatarData = (data) => {
    if (!data) return '---';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <br />
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Hóspede</th>
            <th scope="col">Quarto</th>
            <th scope="col">Check-in</th>
            <th scope="col">Status</th>
            <th scope="col" className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.data && props.data.length > 0 ? (
            props.data.map((hosp) => (
              <tr key={hosp.hospedagem_id}>
                <td>{hosp.hospedagem_id}</td>
                <td><strong>{hosp.nome_hospede}</strong></td>
                <td>Quarto {hosp.numero_quarto}</td>
                <td>{formatarData(hosp.data_checkin)}</td>
                <td>
                   <span className={`badge ${hosp.status === 'ATIVA' ? 'bg-success' : 'bg-secondary'}`}>
                    {hosp.status}
                   </span>
                </td>
                <td className="text-center">
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => props.realizarCheckout(hosp.hospedagem_id)}
                  >
                    Realizar Checkout
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Nenhuma hospedagem ativa encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}