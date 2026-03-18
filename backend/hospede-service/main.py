from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
from database import engine, get_db
from pydantic import BaseModel, EmailStr

models.Base.metadata.create_all(bind=engine)

#app = FastAPI(title="Serviço de Hóspedes - Gestão Hoteleira")

app = FastAPI(root_path="/api/hospedes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HospedeBase(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    telefone: str
    cep: Optional[str] = None
    endereco: Optional[str] = None

class HospedeCreate(HospedeBase):
    pass

class HospedeResponse(HospedeBase):
    id: int

    class Config:
        from_attributes = True


@app.post("/hospedes/", response_model=HospedeResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_hospede(hospede: HospedeCreate, db: Session = Depends(get_db)):
    """
    Cadastro de Hóspedes: Permite registrar novos hóspedes no sistema.
    """
    # Verifica se o CPF já existe para evitar duplicidade 
    db_hospede_cpf = db.query(models.Hospede).filter(models.Hospede.cpf == hospede.cpf).first()
    if db_hospede_cpf:
        raise HTTPException(status_code=400, detail="CPF já cadastrado.")
    
    # Verifica se o Email já existe
    db_hospede_email = db.query(models.Hospede).filter(models.Hospede.email == hospede.email).first()
    if db_hospede_email:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    novo_hospede = models.Hospede(**hospede.model_dump())
    db.add(novo_hospede)
    db.commit()
    db.refresh(novo_hospede)
    return novo_hospede

@app.get("/hospedes/", response_model=List[HospedeResponse])
def listar_hospedes(db: Session = Depends(get_db)):
    """
    Consulta de Hóspedes: Retorna a lista de todos os hóspedes cadastrados.
    """
    return db.query(models.Hospede).all()

@app.get("/hospedes/{hospede_id}", response_model=HospedeResponse)
def obter_hospede(hospede_id: int, db: Session = Depends(get_db)):
    db_hospede = db.query(models.Hospede).filter(models.Hospede.id == hospede_id).first()
    if not db_hospede:
        raise HTTPException(status_code=404, detail="Hóspede não encontrado.")
    return db_hospede

@app.put("/hospedes/{hospede_id}", response_model=HospedeResponse)
def atualizar_hospede(hospede_id: int, hospede_atualizado: HospedeCreate, db: Session = Depends(get_db)):
    """
    Atualiza os dados de um hóspede existente.
    """
    db_hospede = db.query(models.Hospede).filter(models.Hospede.id == hospede_id).first()
    
    if not db_hospede:
        raise HTTPException(status_code=404, detail="Hóspede não encontrado.")
    
    # Atualiza os campos dinamicamente
    for key, value in hospede_atualizado.model_dump().items():
        setattr(db_hospede, key, value)
    
    db.commit()
    db.refresh(db_hospede)
    return db_hospede

@app.delete("/hospedes/{hospede_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_hospede(hospede_id: int, db: Session = Depends(get_db)):
    """
    Remove um hóspede do sistema.
    """
    db_hospede = db.query(models.Hospede).filter(models.Hospede.id == hospede_id).first()
    
    if not db_hospede:
        raise HTTPException(status_code=404, detail="Hóspede não encontrado.")
    
    db.delete(db_hospede)
    db.commit()
    return None

@app.get("/health")
def health_check():
    """
    Endpoint para monitoramento do Kubernetes (Liveness/Readiness Probe).
    """
    return {"status": "healthy", "service": "hospede-service"}