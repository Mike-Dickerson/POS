const http = require('http');
const fs = require('fs');
const path = require('path');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pos-web',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

async function initProducer() {
  while (true) {
    try {
      await producer.connect();
      console.log("✅ Kafka producer connected");
      break;
    } catch (err) {
      console.error("❌ Kafka connect error. Retrying in 5s...", err);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

initProducer();

const htmlPage = `
<!DOCTYPE html>
<html>
<head><title>POS Input</title></head>
<body>
  <h1>POS Store Input</h1>
  <input id="message" placeholder="Enter item or message" />
  <button onclick="send()">Send</button>
  <p id="status"></p>
  <script>
    function send() {
      const msg = document.getElementById('message').value;
      fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      }).then(res => res.text()).then(txt => {
        document.getElementById('status').innerText = txt;
        msgInput.value = '';
      });
    }
  </script>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlPage);
  } else if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      const { message } = JSON.parse(body);
      try {
        await producer.send({
          topic: 'pos-demo',
          messages: [{ value: message }]
        });
        console.log(`📤 Sent to Kafka: ${message}`);
        res.writeHead(200);
        res.end("✅ Sent!");
      } catch (e) {
        console.error("⚠️ Kafka send error", e);
        res.writeHead(500);
        res.end("❌ Failed to send");
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log("🌐 Web UI (Store Input) on http://localhost:3000");
});
