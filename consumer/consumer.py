import time
import json
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable

def connect_kafka():
    while True:
        try:
            consumer = KafkaConsumer(
                'test_topic',
                bootstrap_servers='kafka:9092',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                group_id='demo-group'
            )
            print("Consumer connected. Listening...")
            return consumer
        except NoBrokersAvailable:
            print("Waiting for Kafka...")
            time.sleep(2)

consumer = connect_kafka()

for msg in consumer:
    print("Consumer received:", msg.value)
