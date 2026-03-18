import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import QuartosLista from './QuartosLista';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';

function Quartos() {
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('disponível');
  const [quartos, setQuartos] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const dadosLocais = localStorage.getItem('db_quartos');
    if (dadosLocais) {
      setQuartos(JSON.parse(dadosLocais));
    }
  }, [carregaPagina]);

  const limparCampos = () => {
    setNumero('');
    setTipo('');
    setPreco('');
    setDescricao('');
    setStatus('disponível');
  };

  const salvarQuarto = (e) => {
    e.preventDefault();
    
    const novoQuarto = {
      id: modoEdicao && idSelecionado ? idSelecionado : Date.now(),
      numero: parseInt(numero),
      tipo: tipo,
      diaria: parseFloat(preco),
      status: status,
      descricao: descricao
    };

    let listaAtualizada = [...quartos];

    if (modoEdicao && idSelecionado) {
      // MODO EDIÇÃO: Atualiza o item existente na lista
      listaAtualizada = listaAtualizada.map(q => q.id === idSelecionado ? novoQuarto : q);
      alert("Quarto atualizado localmente!");
    } else {
      // MODO CADASTRO: Adiciona novo item
      listaAtualizada.push(novoQuarto);
      alert("Quarto cadastrado localmente!");
    }

    // Salva no LocalStorage e atualiza o estado
    localStorage.setItem('db_quartos', JSON.stringify(listaAtualizada));
    
    setModoEdicao(false);
    setIdSelecionado(null);
    setCarregaPagina(!carregaPagina);
    limparCampos();
  };

  // Funcao para selecionar um quarto da lista e carregar os dados para edição
  const handleSelecao = (id) => {
    const quartoEncontrado = quartos.find(q => q.id === id);
    if (quartoEncontrado) {
      setIdSelecionado(id);
      setModoEdicao(true);
      setNumero(quartoEncontrado.numero);
      setTipo(quartoEncontrado.tipo);
      setPreco(quartoEncontrado.diaria);
      setDescricao(quartoEncontrado.descricao);
      setStatus(quartoEncontrado.status);
    }
  };

  const deletarQuarto = (id) => {
    if (!id) return;

    if (window.confirm("Tem certeza que deseja excluir este quarto?")) {
      const listaFiltrada = quartos.filter(q => q.id !== id);
      localStorage.setItem('db_quartos', JSON.stringify(listaFiltrada));
      
      alert("Quarto excluído com sucesso!");
      setCarregaPagina(!carregaPagina);
      
      if(id === idSelecionado) {
          setModoEdicao(false);
          setIdSelecionado(null);
          limparCampos();
      }
    }
  };

  const handleNumero = (e) => setNumero(e.target.value);
  const handleTipo = (e) => setTipo(e.target.value);
  const handlePreco = (e) => setPreco(e.target.value);
  const handleDescricao = (e) => setDescricao(e.target.value);
  const handleStatus = (e) => setStatus(e.target.value);

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h2 className="mb-0">Gestão Local de Quartos</h2>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={salvarQuarto}>
          <Row>
            <Col md={3}>
              <Form.Group controlId="formBasicNumero">
                <Form.Label>Número</Form.Label>
                <Form.Control type="text" placeholder="Ex: 101" onChange={handleNumero} value={numero} required/>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formBasicTipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Select onChange={handleTipo} value={tipo} required>
                  <option value="">Selecione o tipo</option>
                  <option value="solteiro">Solteiro</option>
                  <option value="casal">Casal</option>
                  <option value="duplo">Duplo</option>
                  <option value="suite">Suite</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formBasicPreco">
                <Form.Label>Preço Diária</Form.Label>
                <Form.Control type="number" placeholder="0.00" onChange={handlePreco} value={preco} step="0.01" required/>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="formBasicStatus">
                <Form.Label>Status Inicial</Form.Label>
                <Form.Select onChange={handleStatus} value={status}>
                  <option value="disponível">Disponível</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="manutenção">Manutenção</option>
                  <option value="limpeza">Limpeza</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12}>
              <Form.Group controlId="formBasicDescricao">
                <Form.Label>Descrição Detalhada</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Detalhes do quarto..." onChange={handleDescricao} value={descricao}/>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-4">
            <Button type="submit" variant={modoEdicao ? "warning" : "primary"}>
              {modoEdicao ? "Atualizar Quarto" : "Salvar Quarto"}
            </Button>
            {modoEdicao && (
              <Button 
                variant="secondary" 
                className="ms-2" 
                onClick={() => {setModoEdicao(false); setIdSelecionado(null); limparCampos();}}
              >
                Cancelar Edição
              </Button>
            )}
          </div>
          <hr />
          <QuartosLista data={quartos} handleSelecao={handleSelecao} deletarQuarto={deletarQuarto}/>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Quartos;