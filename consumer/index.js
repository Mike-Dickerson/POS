const http = require('http');
const { Kafka } = require('kafkajs');

let messages = [];

const kafka = new Kafka({
  clientId: 'pos-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({
  groupId: 'pos-group',
  retry: { retries: Number.MAX_SAFE_INTEGER }
});

// Wait for Kafka to become reachable before starting the consumer
async function waitForKafka() {
  const admin = kafka.admin();
  while (true) {
    try {
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();
      console.log("✅ Kafka is reachable");
      break;
    } catch (e) {
      console.warn("🕒 Waiting for Kafka to be ready...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

async function initConsumer() {
  await waitForKafka();

  while (true) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'pos-demo', fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ message }) => {
          const decoded = message.value.toString();
          console.log(`📥 Received: ${decoded}`);
          messages.push(decoded);
        }
      });
      break;
    } catch (err) {
      console.error("❌ Kafka consumer error. Retrying in 5s...", err);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

initConsumer();

// HTTP server to show received messages
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<html>
  <head>
    <title>POS Messages</title>
    <meta http-equiv="refresh" content="2">
  </head>
  <body>
    <h1>Received Messages</h1>
    <ul>${messages.map(m => `<li>${m}</li>`).join('')}</ul>
  </body>
</html>`);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => {
  console.log('🌐 Consumer Display UI at http://localhost:3001 (auto-refresh)');
});
