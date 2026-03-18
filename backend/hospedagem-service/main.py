from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, requests
from database import engine, get_db
from pydantic import BaseModel
from datetime import datetime
import pika
import json


models.Base.metadata.create_all(bind=engine)

#app = FastAPI(title="Serviço de Hospedagem")
app = FastAPI(root_path="/api/hospedagens")


class CheckInRequest(BaseModel):
    reserva_id: int

import pika
import json

def enviar_ordem_limpeza(quarto_id):
    try:
        #Conecta ao RabbitMQ usando o nome do serviço no Docker
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
        channel = connection.channel()

        # Declara a fila
        channel.queue_declare(queue='fila_limpeza', durable=True)

        mensagem = {
            "quarto_id": quarto_id,
            "acao": "LIMPEZA_POS_CHECKOUT",
            "timestamp": str(datetime.now())
        }

        channel.basic_publish(
            exchange='',
            routing_key='fila_limpeza',
            body=json.dumps(mensagem),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        connection.close()
        print(f" [x] Ordem de limpeza enviada para o quarto {quarto_id}")
    except Exception as e:
        print(f" [!] Erro ao enviar para o RabbitMQ: {e}")

@app.get("/hospedagens/ativas/detalhes")
def listar_hospedagens_detalhadas(db: Session = Depends(get_db)):
    #Busca as hospedagens ativas no banco local
    ativas = db.query(models.Hospedagem).filter(models.Hospedagem.status == "ATIVA").all()
    
    resultado = []
    
    for hosp in ativas:
        #Busca o nome do hóspede no MS Hóspedes
        nome_hospede = "Desconhecido"
        try:
            resp_h = requests.get(f"http://hospede-service:8000/hospedes/{hosp.hospede_id}", timeout=1)
            if resp_h.status_code == 200:
                nome_hospede = resp_h.json().get("nome")
        except:
            pass # Mantém como desconhecido se o serviço estiver fora

        #Busca o número do quarto no MS Quartos
        numero_quarto = "N/A"
        try:
            resp_q = requests.get(f"http://quarto-service:8000/quartos/{hosp.quarto_id}", timeout=1)
            if resp_q.status_code == 200:
                numero_quarto = resp_q.json().get("numero")
        except:
            pass

        #Monta o objeto combinado
        resultado.append({
            "hospedagem_id": hosp.id,
            "quarto_id": hosp.quarto_id,
            "numero_quarto": numero_quarto,
            "hospede_id": hosp.hospede_id,
            "nome_hospede": nome_hospede,
            "data_checkin": hosp.data_checkin,
            "status": hosp.status
        })

    return resultado

#Rota para quem ja tinha reserva e quer fazer check-in (integração com MS Reserva)
@app.post("/hospedagens/checkin", status_code=status.HTTP_201_CREATED)
def realizar_checkin(req: CheckInRequest, db: Session = Depends(get_db)):
    try:
        #Busca os dados da reserva
        resp = requests.get(f"http://reserva-service:8000/reservas/{req.reserva_id}", timeout=2)        
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Reserva {req.reserva_id} não encontrada.")
        
        reserva = resp.json()

        #CRIA O REGISTRO
        nova_hospedagem = models.Hospedagem(
            reserva_id=reserva["id"],
            quarto_id=reserva["quarto_id"],
            hospede_id=reserva["hospede_id"]
        )
        db.add(nova_hospedagem)
        db.flush()

        #ATUALIZA O STATUS DO QUARTO
        requests.patch(
            f"http://quarto-service:8000/api/quartos/{reserva['quarto_id']}/status",
            params={"novo_status": "OCUPADO"},
            timeout=2
        )

        db.commit()
        return {"message": "Check-in realizado com sucesso", "hospedagem_id": nova_hospedagem.id}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Erro de comunicação entre serviços: {e}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")
    
@app.post("/hospedagens/{hospedagem_id}/checkout")
def realizar_checkout(hospedagem_id: int, db: Session = Depends(get_db)):
    #Busca a hospedagem no banco local
    hospedagem = db.query(models.Hospedagem).filter(models.Hospedagem.id == hospedagem_id).first()
    if not hospedagem:
        raise HTTPException(status_code=404, detail="Hospedagem não encontrada.")
    
    if hospedagem.status == "FINALIZADA":
        raise HTTPException(status_code=400, detail="Checkout já realizado anteriormente.")

    #Busca o preço atualizado diretamente do Microserviço de Quartos
    url_quarto = f"http://quarto-service:8000/quartos/{hospedagem.quarto_id}"
    
    try:
        resp_quarto = requests.get(url_quarto, timeout=3)
        
        if resp_quarto.status_code != 200:
            raise HTTPException(status_code=502, detail="Erro ao consultar o Serviço de Quartos.")
        
        quarto_data = resp_quarto.json()
        preco_diaria = quarto_data.get("diaria")
        
        if preco_diaria is None:
            raise HTTPException(status_code=500, detail="Campo de preço não encontrado no cadastro do quarto.")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Serviço de Quartos indisponível no momento.")

    # Cálculo do Valor Total
    hospedagem.data_checkout = datetime.now()
    delta = hospedagem.data_checkout.replace(tzinfo=None) - hospedagem.data_checkin.replace(tzinfo=None)
    
    # Cálculo de diárias: se ficou menos de 24h, cobra 1 diária
    dias = max(1, delta.days) 
    valor_calculado = dias * float(preco_diaria)
    
    #Atualiza o registro local
    hospedagem.valor_total = valor_calculado
    hospedagem.status = "FINALIZADA"

    #Dispara a ordem de limpeza via RabbitMQ
    enviar_ordem_limpeza(hospedagem.quarto_id)

    db.commit()
    db.refresh(hospedagem)

    return {
        "message": "Checkout concluído com sucesso",
        "hospedagem_id": hospedagem.id,
        "dias_permanencia": dias,
        "valor_total": valor_calculado,
        "status_quarto": "DISPONIVEL"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "hospedagem-service"}