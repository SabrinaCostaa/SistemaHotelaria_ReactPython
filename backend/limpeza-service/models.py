from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class Limpeza(Base):
    __tablename__ = "limpezas"

    id = Column(Integer, primary_key=True, index=True)
    quarto_id = Column(Integer, nullable=False)
    status = Column(String(20), default="PENDENTE", nullable=False) 
    data_solicitacao = Column(DateTime, default=datetime.utcnow)
    data_fim = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Limpeza(quarto={self.quarto_id}, status={self.status})>"