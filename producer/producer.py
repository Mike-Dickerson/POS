import time
import json
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
from flask import Flask, request

app = Flask(__name__)
producer = None

def connect_kafka():
    global producer
    delay = 2
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            print("Connected to Kafka.")
            break
        except NoBrokersAvailable:
            print(f"Kafka unavailable. Retrying in {delay}s...")
            time.sleep(delay)

connect_kafka()

@app.route('/send', methods=['POST'])
def send():
    data = request.json
    print("User entered:", data)
    try:
        producer.send('test_topic', data)
        print("Producer sent:", data)
        return {"status": "sent"}
    except Exception as e:
        print("Kafka error:", e)
        return {"status": "error"}, 500

app.run(host='0.0.0.0', port=5000)
