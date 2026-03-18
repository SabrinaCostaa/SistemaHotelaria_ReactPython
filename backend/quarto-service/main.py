from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
from database import engine, get_db, Base
from pydantic import BaseModel
from typing import Optional

models.Base.metadata.create_all(bind=engine)

#app = FastAPI(title="Serviço de Quartos - Gestão Hoteleira")
app = FastAPI(root_path="/api/quartos")

#libera acesso de outros serviços (frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuartoBase(BaseModel):
    numero: int
    tipo: str
    diaria: float
    status: str = "DISPONIVEL"
    descricao: Optional[str] = None

    class Config:
        from_attributes = True

class QuartoCreate(QuartoBase):
    pass

class QuartoResponse(QuartoBase):
    id: int

    class Config:
        from_attributes = True


@app.post("/", response_model=QuartoResponse, status_code=status.HTTP_201_CREATED)
def criar_quarto(quarto: QuartoCreate, db: Session = Depends(get_db)):

    db_quarto = db.query(models.Quarto).filter(models.Quarto.numero == quarto.numero).first()
    if db_quarto:
        raise HTTPException(status_code=400, detail="Quarto com este número já cadastrado.")
    
    novo_quarto = models.Quarto(**quarto.model_dump())
    db.add(novo_quarto)
    db.commit()
    db.refresh(novo_quarto)
    return novo_quarto

@app.get("/quartos/", response_model=List[QuartoResponse])
def listar_quartos(db: Session = Depends(get_db)):

    return db.query(models.Quarto).all()

@app.get("/quartos/{quarto_id}", response_model=QuartoResponse)
def obter_quarto(quarto_id: int, db: Session = Depends(get_db)):
    db_quarto = db.query(models.Quarto).filter(models.Quarto.id == quarto_id).first()
    if not db_quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    return db_quarto

@app.patch("/quartos/{quarto_id}/status")
def atualizar_status_quarto(quarto_id: int, novo_status: str, db: Session = Depends(get_db)):
    
    #Disponível, Reservado, Ocupado, Em limpeza
    
    db_quarto = db.query(models.Quarto).filter(models.Quarto.id == quarto_id).first()
    if not db_quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    # Validação simples de status permitidos
    status_permitidos = ["DISPONIVEL", "RESERVADO", "OCUPADO", "EM_LIMPEZA"]
    if novo_status.upper() not in status_permitidos:
        raise HTTPException(status_code=400, detail="Status inválido")

    db_quarto.status = novo_status.upper()
    db.commit()
    return {"message": f"Status do quarto {db_quarto.numero} atualizado para {novo_status}"}

@app.put("/quartos/{quarto_id}", response_model=QuartoResponse)
def atualizar_quarto(quarto_id: int, quarto_atualizado: QuartoCreate, db: Session = Depends(get_db)):
    db_quarto = db.query(models.Quarto).filter(models.Quarto.id == quarto_id).first()
    
    if db_quarto is None:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    # Usando o dicionario para atualizar de forma mais limpa
    for var, value in quarto_atualizado.model_dump().items():
        setattr(db_quarto, var, value)
    
    db.commit()
    db.refresh(db_quarto)
    return db_quarto

@app.delete("/quartos/{quarto_id}")
def deletar_quarto(quarto_id: int, db: Session = Depends(get_db)):
    # Busca o quarto no banco
    db_quarto = db.query(models.Quarto).filter(models.Quarto.id == quarto_id).first()
    
    #Se nao encontrar retorna 404
    if db_quarto is None:
        raise HTTPException(status_code=404, detail="Quarto não encontrado")
    
    db.delete(db_quarto)
    db.commit()
    
    return {"message": "Quarto deletado com sucesso"}


@app.get("/health")
def health_check():
    """
    Endpoint essencial para o Liveness/Readiness Probe do Kubernetes.
    """
    return {"status": "healthy"}