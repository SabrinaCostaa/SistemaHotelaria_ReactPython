# 🏨 Sistema de Hotelaria

Este projeto consiste em um ecossistema de gestão hoteleira robusto, desenvolvido com foco em escalabilidade e comunicação assíncrona. A solução demonstra a integração de múltiplos serviços independentes compartilhando uma infraestrutura de dados organizada por schemas.

## 🏗️ Arquitetura do Sistema

O projeto adota o padrão de **Shared Database / Separate Schemas**. Cada microserviço é responsável por seu próprio esquema lógico dentro do banco de dados, garantindo que a evolução de um serviço não impacte diretamente a estrutura de dados dos demais.

### 🛰️ Microserviços
1.  **Hóspede Service (8001):** Gestão de perfis e histórico de clientes.
2.  **Quarto Service (8002):** Controle de inventário e estados (Disponível, Ocupado, Limpeza).
3.  **Reserva Service (8003):** Lógica de agendamento e disponibilidade.
4.  **Hospedagem Service (8004):** Orquestrador de Check-in e Checkout.
5.  **Limpeza Service (8005):** Worker assíncrono para ordens de serviço.

---

## 🔄 Comunicação e Mensageria

O sistema utiliza **RabbitMQ** para implementar comunicação assíncrona orientada a eventos. 
- Ao realizar um **Checkout**, o `Hospedagem Service` publica uma mensagem na fila `fila_limpeza`. 
- O `Limpeza Service` consome essa mensagem em background, permitindo que a operação de saída do hóspede seja concluída sem latência de processamento operacional.
- Após concluída a limpeza, o microserviço de quarto é acessado e o quarto volta para o status "Disponível".

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy (ORM).
- **Frontend:** React, React-Bootstrap, Vite (Operando em **Mock Mode** via LocalStorage).
- **Mensageria:** RabbitMQ (Protocolo AMQP).
- **Banco de Dados:** PostgreSQL (Organização por Schemas).
- **Infraestrutura:** Docker & K8s (em fase de configuração).

---

## 🚀 Como Executar o Projeto

Certifique-se de estar em um ambiente com Docker instalado (WSL2 recomendado).

### 1. Clonar e Subir Infraestrutura
```bash
git clone [https://github.com/SabrinaCostaa/SistemaHotelaria_ReactPython.git](https://github.com/SabrinaCostaa/SistemaHotelaria_ReactPython.git)
cd SistemaHotelaria
docker-compose up -d --build
```
### 2. Rodar o Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Acessar a página no navegador
http://localhost:5173
