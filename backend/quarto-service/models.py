from sqlalchemy import Column, Integer, String, Numeric, Float
from database import Base

class Quarto(Base):

    __tablename__ = "quartos"

    id = Column(Integer, primary_key=True, index=True) 
    numero = Column(Integer, unique=True, nullable=False)
    tipo = Column(String(50), nullable=False)
    diaria = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="DISPONIVEL", nullable=False)
    descricao = Column(String, nullable=True)

#Para facilitar a visualização dos objetos Quarto
    def __repr__(self):
        return f"<Quarto(numero={self.numero}, status={self.status})>"