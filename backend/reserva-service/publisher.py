import pika
import json
import os
import logging

# Configuração de logs para facilitar o debug no Docker
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@hotel_rabbitmq:5672/")

def publicar_evento_limpeza(quarto_id):
    """
    Envia um comando de limpeza para a fila de forma segura.
    """
    connection = None
    try:
        # 1. Configura a conexão com timeout para não travar a API
        params = pika.URLParameters(RABBITMQ_URL)
        params.heartbeat = 600
        params.blocked_connection_timeout = 300
        
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        # 2. Declara a fila (garante que ela existe antes de enviar)
        # durable=True garante que a fila sobreviva a um restart do RabbitMQ
        channel.queue_declare(queue='fila_limpeza', durable=True)

        corpo_mensagem = {
            "quarto_id": quarto_id,
            "acao": "preparar_limpeza"
        }

        # 3. Publica a mensagem
        channel.basic_publish(
            exchange='',
            routing_key='fila_limpeza',
            body=json.dumps(corpo_mensagem),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Torna a mensagem persistente no disco
                content_type='application/json'
            )
        )
        
        logger.info(f" [OK] Notificação de limpeza enviada para o quarto {quarto_id}")

    except Exception as e:
        # Se o RabbitMQ estiver fora, apenas logamos o erro para não quebrar a reserva
        logger.error(f" [ERRO] Falha ao conectar no RabbitMQ: {e}")
    
    finally:
        # 4. Fecha a conexão se ela foi aberta
        if connection and connection.is_open:
            connection.close()