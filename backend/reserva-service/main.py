from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import requests
from database import engine, get_db
from pydantic import BaseModel
from datetime import date
import pika, json
from publisher import publicar_evento_limpeza

models.Base.metadata.create_all(bind=engine)

#app = FastAPI(title="Serviço de Reservas - Gestão Hoteleira")
app = FastAPI(root_path='/api/reserva')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

class ReservaBase(BaseModel):
    hospede_id: int
    quarto_id: int
    data_checkin: date
    data_checkout: date
    status: str = "RESERVADO"

class ReservaCreate(ReservaBase):
    pass

class ReservaResponse(ReservaBase):
    id: int
    class Config:
        from_attributes = True


@app.post("/reservas", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def criar_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):

    # Validar se o Hóspede existe
    # No criar_reserva (ms_reserva)
    try:
        resp_hospede = requests.get(f"http://hospede_service:8000/hospedes/{reserva.hospede_id}")
        if resp_hospede.status_code == 404:
            raise HTTPException(status_code=404, detail="Hóspede não existe no banco de dados.")
        if resp_hospede.status_code != 200:
            raise HTTPException(status_code=500, detail="Erro desconhecido no Serviço de Hóspedes.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Serviço de Hóspedes fora do ar (Rede).")
    # Validar se o Quarto existe e está disponível
    try:
        resp_quarto = requests.get(f"http://ms_quarto:8000/quartos/{reserva.quarto_id}", timeout=2)
        if resp_quarto.status_code != 200:
            raise HTTPException(status_code=404, detail="Quarto não encontrado.")
        
        quarto_data = resp_quarto.json()
        if quarto_data["status"] != "DISPONIVEL":
            raise HTTPException(status_code=400, detail="O quarto selecionado não está disponível.")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Serviço de Quartos indisponível.")

    #Persistir a reserva
    nova_reserva = models.Reserva(**reserva.model_dump())
    db.add(nova_reserva)
    
    #Atualizar o status do quarto para RESERVADO
    try:
        requests.patch(
            f"http://quarto_service:8000/quartos/{reserva.quarto_id}/status",
            params={"novo_status": "RESERVADO"},
            timeout=2
        )
    except requests.exceptions.RequestException:
        print("Aviso: Falha ao atualizar status do quarto no MS Quartos.")

    db.commit()
    db.refresh(nova_reserva)

    return nova_reserva

@app.get("/reservas", response_model=List[ReservaResponse])
def listar_reservas(db: Session = Depends(get_db)):
   
    return db.query(models.Reserva).all()

@app.get("/reservas/{reserva_id}", response_model=ReservaResponse)
def obter_reserva(reserva_id: int, db: Session = Depends(get_db)):
    db_reserva = db.query(models.Reserva).filter(models.Reserva.id == reserva_id).first()
    if not db_reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada.")
    return db_reserva

@app.delete("/reservas/{reserva_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):

    db_reserva = db.query(models.Reserva).filter(models.Reserva.id == reserva_id).first()
    if not db_reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada.")
    
    # remove a reserva e poderia disparar evento para liberar o quarto
    db.delete(db_reserva)
    db.commit()
    return None

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "reserva-service"}