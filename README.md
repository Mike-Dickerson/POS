# Minimal Kafka Demo

## Start it up
```bash
docker-compose up --build
```

## Use It
- Go to http://localhost:3000
- Type a message and click send
- Watch the terminal logs:
  - Web logs user input
  - Producer sends to Kafka
  - Consumer logs the received message

Kafka can be restarted mid-demo to show retry logic.
