import time
import json
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

def connect():
    while True:
        try:
            return KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
        except NoBrokersAvailable:
            print("Kafka unavailable. Retrying...")
            time.sleep(2)

producer = connect()

sale = {'sku': 'ITEM123', 'qty': 1, 'store': 'cloud_ctrl'}
try:
    producer.send('sale_events', sale)
    print("Sale event sent.")
except Exception as e:
    print("Kafka error:", e)
