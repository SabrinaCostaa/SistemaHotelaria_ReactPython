import './App.css'
import { useState, useEffect } from 'react';
/* Adicionando os componentes/paginas */
import Home from './components/pages/Home';
import Contato from './components/pages/Contato';
import About from './components/pages/About';
import Hospedes from './components/pages/Hospedes';
import Quartos from './components/pages/Quartos';
import Hospedagens from './components/pages/Hospedagens';
import GerenciamentoReservas from './components/pages/GerenciamentoReservas';
import Limpeza  from './components/pages/Limpeza';
import Auditoria from './components/pages/Auditoria';
import NavbarTWM from './components/utils/NavbarTWM';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  // Inicializa o tema com o que estiver no localStorage ou 'light' por padrão
  const [tema, setTema] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema);
    // Salva a preferência do usuário
    localStorage.setItem('theme', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(tema === 'light' ? 'dark' : 'light');
  };

  return (
    <>
        <Router>
          
          <NavbarTWM toggleTema={toggleTema} temaAtual={tema} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/hospedes" element={<Hospedes />} />
            <Route path="/quartos" element={<Quartos />} />
            <Route path="/hospedagens" element={<Hospedagens />} />
            <Route path="/reservas" element={<GerenciamentoReservas />} />
            <Route path="/limpeza" element={<Limpeza />} />
            <Route path="*" element={<div className="container mt-5">Página não encontrada.</div>} />
          </Routes>
        </Router>
    </>
  )
}

export default App;