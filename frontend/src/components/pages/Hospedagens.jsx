import { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import HospedagensLista from './HospedagensLista';
import api from '../utils/Utils'; 

function Hospedagens() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [hospede, setHospede] = useState('');
  const [quarto, setQuarto] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [diarias, setDiarias] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  
  // --- LISTAS E DADOS MOCKADOS ---
  const [listaHospedes, setListaHospedes] = useState([
    { id: 1, nome: "Sabrina Costa", cpf: "123.456.789-00" },
    { id: 2, nome: "Henrique Silva", cpf: "987.654.321-11" }
  ]);
  
  const [listaQuartos, setListaQuartos] = useState([
    { id: 101, numero: "101", tipo: "Luxo", diaria: 250.00, status: "DISPONIVEL" },
    { id: 104, numero: "104", tipo: "Standard", diaria: 150.00, status: "DISPONIVEL" },
    { id: 202, numero: "202", tipo: "Suíte", diaria: 400.00, status: "OCUPADO" }
  ]);

  const [hospedagens, setHospedagens] = useState([
    { 
      id: 1, 
      hospede: "Sabrina Costa", 
      quarto: "101", 
      tipo: "Luxo",
      entrada: "2026-03-15", 
      saida_prevista: "2026-03-20",
      status: "HOSPEDADO" 
    },
    { 
      id: 2, 
      hospede: "Henrique Silva", 
      quarto: "104", 
      tipo: "Standard",
      entrada: "2026-03-16", 
      saida_prevista: "2026-03-18",
      status: "HOSPEDADO" 
    }
  ]);

  const [carregaPagina, setCarregaPagina] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        /* // Descomentar aqui quando o backend estiver pronto
        const [resH, resQ, resHos] = await Promise.all([
          api.get('/hospedes/hospedes/'),
          api.get('/quartos/quartos/'),
          api.get('/hospedagens/hospedagens/ativas/detalhes')
        ]);
        setListaHospedes(resH.data);
        setListaQuartos(resQ.data); 
        setHospedagens(resHos.data);
        */
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDados();
  }, [carregaPagina]);

  //Lógica de Cálculos de Diárias
  useEffect(() => {
    if (dataEntrada && dataSaida && quarto) {
      const entrada = new Date(dataEntrada);
      const saida = new Date(dataSaida);
      const diffTime = saida - entrada;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const q = listaQuartos.find(item => item.id === parseInt(quarto));
      
      if (diffDays > 0) {
        setDiarias(diffDays);
        if (q) setValorTotal(diffDays * q.diaria);
      } else {
        setDiarias(0);
        setValorTotal(0);
      }
    }
  }, [dataEntrada, dataSaida, quarto, listaQuartos]);

  const salvarHospedagem = async (e) => {
    e.preventDefault();
    alert("Simulação: Check-in realizado com sucesso (Mock)!");
    limparFormulario();
    // Com o backend feito: await api.post('/hospedagens/hospedagens/checkin', dataToSend);
  };

  const realizarCheckout = async (id) => {
    if (window.confirm("Deseja realizar o checkout?")) {
      setHospedagens(hospedagens.filter(h => h.id !== id));
      alert("Checkout concluído!");
    }
  };

  const limparFormulario = () => {
    setHospede(''); setQuarto(''); setDataEntrada(''); setDataSaida('');
    setDiarias(0); setValorTotal(0);
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-success text-white py-3">
        <h2 className="mb-0 fw-bold">Check-in e Hospedagens</h2>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={salvarHospedagem}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Hóspede *</Form.Label>
                <Form.Select value={hospede} onChange={(e) => setHospede(e.target.value)} required>
                  <option value="">Selecione um hóspede</option>
                  {listaHospedes.map((h) => (
                    <option key={h.id} value={h.id}>{h.nome} - {h.cpf}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Quarto Disponível *</Form.Label>
                <Form.Select value={quarto} onChange={(e) => setQuarto(e.target.value)} required>
                  <option value="">Selecione um quarto</option>
                  {listaQuartos.filter(q => q.status === 'DISPONIVEL').map((q) => (
                    <option key={q.id} value={q.id}>
                      Quarto {q.numero} - {q.tipo} (R$ {q.diaria?.toFixed(2)})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">Data Entrada *</Form.Label>
                <Form.Control type="date" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">Previsão Saída</Form.Label>
                <Form.Control type="date" value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">Diárias</Form.Label>
                <Form.Control type="number" value={diarias} disabled className="bg-light" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Valor Estimado</Form.Label>
                <Form.Control type="text" value={`R$ ${valorTotal.toFixed(2)}`} disabled className="bg-light fw-bold text-success" />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mb-4">
            <Button variant="success" type="submit" className="px-4 fw-bold">Realizar Check-in</Button>
            <Button variant="outline-secondary" onClick={limparFormulario}>Limpar</Button>
          </div>

          <hr className="my-5" />
          
          <h4 className="fw-bold text-dark mb-4">Hospedagens Ativas no Hotel</h4>
          <HospedagensLista 
            data={hospedagens} 
            realizarCheckout={realizarCheckout} 
          />
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Hospedagens;