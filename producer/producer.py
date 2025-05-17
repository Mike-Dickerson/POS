from kafka import KafkaProducer
import time

producer = None
while producer is None:
    try:
        producer = KafkaProducer(bootstrap_servers='kafka:9092')
        print("✅ Producer connected to Kafka.")
    except Exception as e:
        print(f"❌ Kafka connection failed. Retrying... ({e})")
        time.sleep(5)

print("Waiting for input...")
while True:
    msg = input("Enter a message to send: ")
    producer.send('pos-demo', msg.encode('utf-8'))
    print(f"📤 Sent: {msg}")
