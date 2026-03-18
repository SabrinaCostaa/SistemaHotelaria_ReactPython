from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Float
from database import Base
from datetime import datetime

class Hospedagem(Base):
    __tablename__ = "hospedagens"

    id = Column(Integer, primary_key=True, index=True)
    reserva_id = Column(Integer, nullable=False)
    quarto_id = Column(Integer, nullable=False)
    hospede_id = Column(Integer, nullable=False)
    data_checkin = Column(DateTime, default=datetime.utcnow)
    data_checkout = Column(DateTime, nullable=True)
    valor_total = Column(Float, nullable=True)
    status = Column(String(20), default="ATIVA")