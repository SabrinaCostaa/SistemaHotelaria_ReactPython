import React from "react";
import { Card, Row, Col, Table, Badge, Alert } from "react-bootstrap";

function Informacoes() {
  const microservicos = [
    { nome: 'Hóspede Service', porta: '8001', status: 'Simulado', db: 'LocalStorage: db_hospedes', icon: '👤' },
    { nome: 'Quarto Service', porta: '8002', status: 'Simulado', db: 'LocalStorage: db_quartos', icon: '🛏️' },
    { nome: 'Reserva Service', porta: '8003', status: 'Simulado', db: 'LocalStorage: db_reservas', icon: '📅' },
    { nome: 'Hospedagem Service', porta: '8004', status: 'Simulado', db: 'LocalStorage: db_hospedagens', icon: '🔑' },
    { nome: 'Limpeza Service', porta: '8005', status: 'Simulado', db: 'LocalStorage: db_limpezas', icon: '🧹' },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4">Painel de Controle de Microserviços</h1>
      
      <Alert variant="info" className="mb-4 shadow-sm border-0 border-start border-4 border-info">
        <strong>Status do Sistema:</strong> O frontend está operando em modo isolado (Mock Mode). 
        As instâncias de persistência estão sendo redirecionadas para o <strong>Browser Web Storage</strong> para garantir a fluidez da demonstração.
      </Alert>

      <Row className="mb-4">
        {microservicos.map((servico, index) => (
          <Col md={2} sm={4} xs={6} key={index} className="mb-3" style={{ minWidth: '200px' }}>
            <Card className="shadow-sm border-0 h-100 bg-white">
              <Card.Body className="text-center">
                <div style={{ fontSize: '2rem' }} className="mb-2">{servico.icon}</div>
                <Card.Title className="h6 text-dark font-weight-bold">{servico.nome}</Card.Title>
                <Badge bg="success" className="mb-2">ONLINE</Badge>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  <strong>Porta:</strong> {servico.porta}<br/>
                  {servico.db}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg={8} md={12}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-dark text-white font-weight-bold">
              Infraestrutura e Comunicação entre Microserviços
            </Card.Header>
            <Card.Body>
              <Table responsive borderless hover className="align-middle">
                <thead className="text-muted">
                  <tr>
                    <th>Componente</th>
                    <th>Tecnologia</th>
                    <th>Padrão de Comunicação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>API Gateway</strong></td>
                    <td>Nginx</td>
                    <td>Roteamento Reverso (Porta 8080)</td>
                  </tr>
                  <tr>
                    <td><strong>Event Broker</strong></td>
                    <td>RabbitMQ</td>
                    <td>Protocolo AMQP (Assíncrono)</td>
                  </tr>
                  <tr>
                    <td><strong>Bancos de Dados</strong></td>
                    <td>PostgreSQL</td>
                    <td>Database-per-Service Pattern</td>
                  </tr>
                  <tr>
                    <td><strong>Ambiente</strong></td>
                    <td>Docker & WSL2</td>
                    <td>Containerização de Microserviços</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 bg-light h-100">
            <Card.Body>
              <h5 className="mb-3 text-primary">Pipeline de Eventos</h5>
              <div className="small">
                <div className="p-2 border-bottom">
                  <strong>1. Checkout:</strong> Requisição PATCH no <code>ms-hospedagem</code>.
                </div>
                <div className="p-2 border-bottom">
                  <strong>2. Mensageria:</strong> Disparo de evento para o <code>rabbitmq</code>.
                </div>
                <div className="p-2 border-bottom">
                  <strong>3. Limpeza:</strong> Consumo pelo worker do <code>ms-limpeza</code>.
                </div>
                <div className="p-2">
                  <strong>4. Reset:</strong> Atualização de status no <code>ms-quarto</code>.
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Informacoes;