import React, { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import HospedesLista from './HospedesLista';
import { cpfMask, cepMask } from '../utils/Utils';
import axios from "axios";

function Hospedes() {
  const [idHospede, setIdHospede] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [hospedes, setHospedes] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  useEffect(() => {
    const dadosLocais = localStorage.getItem('db_hospedes');
    if (dadosLocais) {
      setHospedes(JSON.parse(dadosLocais));
    }
  }, [carregaPagina]);

  // Salvar ou Atualizar
  const salvarHospedes = (e) => {
    e.preventDefault();
    
    const novoHospede = {
      id: idHospede > 0 ? idHospede : Date.now(),
      nome,
      cpf: cpf.replace(/\D/g, ''),
      email,
      telefone,
      cep: cep.replace(/\D/g, ''),
      endereco: rua
    };

    let listaAtualizada = [...hospedes];

    if (idHospede > 0) {
      // MODO EDIÇÃO
      listaAtualizada = listaAtualizada.map(h => h.id === idHospede ? novoHospede : h);
      alert("Hóspede atualizado!");
    } else {
      // MODO CADASTRO
      listaAtualizada.push(novoHospede);
      alert("Hóspede cadastrado!");
    }

    localStorage.setItem('db_hospedes', JSON.stringify(listaAtualizada));
    limparFormulario();
    setCarregaPagina(!carregaPagina);
  };

  const excluirHospede = () => {
    if (idHospede > 0) {
      if (window.confirm("Deseja realmente excluir este hóspede?")) {
        const listaFiltrada = hospedes.filter(h => h.id !== idHospede);
        localStorage.setItem('db_hospedes', JSON.stringify(listaFiltrada));
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      }
    } else {
      alert("Selecione um hóspede na lista para excluir.");
    }
  };

  // Seleção na Tabela para Edição 
  const handleSelecao = (id) => {
    const hospedeEncontrado = hospedes.find(h => h.id === id);
    if (hospedeEncontrado) {
      setIdHospede(hospedeEncontrado.id); 
      setNome(hospedeEncontrado.nome);
      setEmail(hospedeEncontrado.email);
      setTelefone(hospedeEncontrado.telefone);
      setCpf(cpfMask(hospedeEncontrado.cpf));
      setCep(cepMask(hospedeEncontrado.cep || ''));
      setRua(hospedeEncontrado.endereco || '');
    }
  };

  // Busca de CEP
  const handleFillAddress = () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(res => {
          if(!res.data.erro) setRua(res.data.logradouro);
        })
        .catch(err => console.error("CEP não encontrado"));
    }
  };

  const limparFormulario = () => {
    setIdHospede(0);
    setNome('');
    setEmail('');
    setTelefone('');
    setCpf('');
    setCep('');
    setRua('');
  };

  return (
    <React.Fragment>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white py-3">
          <h2 className="mb-0">Gestão Local de Hóspedes</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={salvarHospedes}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" value={cpf} onChange={(e) => setCpf(cpfMask(e.target.value))} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control type="text" value={cep} onBlur={handleFillAddress} onChange={(e) => setCep(cepMask(e.target.value))} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Rua</Form.Label>
                  <Form.Control type="text" value={rua} onChange={(e) => setRua(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant={idHospede > 0 ? "warning" : "primary"} type="submit">
                {idHospede > 0 ? 'Atualizar Dados' : 'Salvar Hóspede'}
              </Button>
              {idHospede > 0 && (
                <Button variant="secondary" type="button" onClick={limparFormulario}>
                  Cancelar Edição
                </Button>
              )}
              <Button 
                variant="danger" 
                type="button" 
                onClick={excluirHospede} 
                disabled={idHospede === 0}
              >
                Excluir
              </Button>
            </div>
          </Form>
          <hr className="my-4" />
          <HospedesLista data={hospedes} handleSelecao={handleSelecao} />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default Hospedes;