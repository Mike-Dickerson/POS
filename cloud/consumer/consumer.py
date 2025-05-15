from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'sale_events',
    bootstrap_servers='kafka:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest'
)

print("Listening for restock events...")
for msg in consumer:
    print("Restock received:", msg.value)
