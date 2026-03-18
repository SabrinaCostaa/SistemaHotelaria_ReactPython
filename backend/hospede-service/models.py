from sqlalchemy import Column, Integer, String, Numeric
from database import Base

class Hospede(Base):
    """
    Representação da tabela de hospedes no schema_hospede.
    """
    __tablename__ = "hospedes"
    __table_args__ = {"schema": "schema_hospede"}

    id = Column(Integer, primary_key=True, index=True) 
    nome = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefone = Column(String(20), nullable=False)
    cep = Column(String(10), nullable=True)
    endereco = Column(String(200), nullable=True)

    def __repr__(self):
        return f"<Hospede(nome={self.nome}, email={self.email}, telefone={self.telefone}, status={self.status})>"