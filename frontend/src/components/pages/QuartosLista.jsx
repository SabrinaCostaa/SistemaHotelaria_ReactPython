import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function QuartosLista(props) {
  // Debug para garantir que os dados estão chegando
  console.log("Renderizando Lista com:", props.data);

  if (!props.data || props.data.length === 0) {
    return <p className="text-center mt-3">Nenhum quarto cadastrado no momento.</p>;
  }

  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Número</th>
          <th>Tipo</th>
          <th>Preço (Diária)</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {props.data && props.data.map((quarto) => (
          <tr key={quarto.id}>
            <td>
              <input 
                type="radio" 
                name="rdQuarto" 
                onChange={() => props.handleSelecao(quarto.id)} 
              />
            </td>
            <td>{quarto.id}</td>
            <td>{quarto.numero}</td>
            <td>{quarto.tipo}</td> 
            <td>R$ {quarto.diaria ? parseFloat(quarto.diaria).toFixed(2) : "0.00"}</td>
            <td>
              <span className="badge bg-info text-dark">
                {quarto.status}
              </span>
            </td>
            <td>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => props.deletarQuarto(quarto.id)}
              >
                Excluir
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default QuartosLista;