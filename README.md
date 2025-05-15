# POS Demo System

## How to Run

1. Start Kafka:
   docker-compose -f docker-compose.kafka.yml up -d

2. Start Store:
   docker-compose -f docker-compose.store.yml up -d

3. Start Cloud:
   docker-compose -f docker-compose.cloud.yml up -d

Visit:
- Store UI: http://localhost:3000
- Cloud UI: http://localhost:3001
