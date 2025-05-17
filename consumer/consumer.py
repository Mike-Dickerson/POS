from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'pos-demo',
    bootstrap_servers='kafka:9092',
    auto_offset_reset='earliest',
    group_id='pos-group'
)

print("✅ Consumer started. Waiting for messages...")
for msg in consumer:
    print(f"📥 Received: {msg.value.decode('utf-8')}")
