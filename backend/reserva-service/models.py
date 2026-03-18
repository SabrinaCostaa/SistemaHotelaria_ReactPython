from sqlalchemy import Column, Integer, String, Date
from database import Base

class Reserva(Base):
    """
    RF05 - Criação de Reservas
    Representação da tabela no schema_reserva
    """
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    hospede_id = Column(Integer, nullable=False)
    quarto_id = Column(Integer, nullable=False)
    data_checkin = Column(Date, nullable=False)
    data_checkout = Column(Date, nullable=False)
    
    # Status possíveis: RESERVADO, CANCELADO, FINALIZADO
    status = Column(String(20), default="RESERVADO", nullable=False)

    def __repr__(self):
        return f"<Reserva(id={self.id}, hospede={self.hospede_id}, quarto={self.quarto_id})>"