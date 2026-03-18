from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
from database import engine, get_db, SessionLocal
import threading
import pika
import json
from pydantic import BaseModel
from datetime import datetime
import time
import requests

models.Base.metadata.create_all(bind=engine)

app = FastAPI(root_path='/api/limpeza')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AtualizarLimpeza(BaseModel):
    status: str  # "CONCLUIDA" ou "EM_LIMPEZA"

def callback(ch, method, properties, body):
    """
    Função executada sempre que uma nova mensagem de checkout chega na fila.
    """
    try:
        data = json.loads(body)
        quarto_id = data.get('quarto_id')
        print(f" [v] Processando ordem de limpeza para o quarto: {quarto_id}")
        
        db = SessionLocal()
        try:
            nova_limpeza = models.Limpeza(
                quarto_id=quarto_id, 
                status="PENDENTE"
            )
            db.add(nova_limpeza)
            db.commit()
            print(f" [OK] Registro de limpeza criado para o quarto {quarto_id}")
        except Exception as db_err:
            print(f" [!] Erro ao persistir limpeza no banco: {db_err}")
            db.rollback()
        finally:
            db.close()
            
        # Confirma para o RabbitMQ que a mensagem foi processada
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f" [!] Erro crítico no processamento da mensagem: {e}")

def run_worker():
    while True:
        try:
            # Conecta usando o nome do serviço definido no docker-compose
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='rabbitmq', heartbeat=600)
            )
            channel = connection.channel()
            channel.queue_declare(queue='fila_limpeza', durable=True)
            
            # Distribuição justa: entrega apenas 1 mensagem por vez ao worker
            channel.basic_qos(prefetch_count=1)
            
            channel.basic_consume(queue='fila_limpeza', on_message_callback=callback)
            print(' [*] Worker de limpeza ativo e aguardando ordens...')
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError:
            print(" [!] RabbitMQ fora do ar. Tentando reconectar em 5 segundos...")
            time.sleep(5)
        except Exception as e:
            print(f" [!] Erro inesperado no Worker: {e}. Reiniciando...")
            time.sleep(5)

# Inicia o Worker em uma Thread separada
threading.Thread(target=run_worker, daemon=True).start()

# --- ENDPOINTS DA API ---

@app.get("/limpezas")
def listar_limpezas(db: Session = Depends(get_db)):

    return db.query(models.Limpeza).all()

@app.patch("/limpezas/{limpeza_id}/status")
def atualizar_status_limpeza(limpeza_id: int, req: AtualizarLimpeza, db: Session = Depends(get_db)):

    limpeza = db.query(models.Limpeza).filter(models.Limpeza.id == limpeza_id).first()
    
    if not limpeza:
        raise HTTPException(status_code=404, detail="Registro de limpeza não encontrado.")
    
    limpeza.status = req.status
    
    if req.status == "CONCLUIDA":
        limpeza.data_fim = datetime.utcnow()
        
        # Comunicação Síncrona: Avisar o Quarto-Service para mudar status para DISPONIVEL
        try:
            url_quarto = f"http://quarto-service:8000/quartos/{limpeza.quarto_id}/status"
            requests.patch(
                url_quarto,
                params={"novo_status": "DISPONIVEL"},
                timeout=3
            )
            print(f" [!] Quarto {limpeza.quarto_id} marcado como DISPONIVEL no sistema.")
        except Exception as e:
            # Erro de rede não trava a atualização da limpeza
            print(f" [!] Erro ao notificar Quarto-Service: {e}")
    
    db.commit()
    return {"message": f"Status da limpeza {limpeza_id} atualizado para {req.status}"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "limpeza-service"}