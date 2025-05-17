const http = require('http');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'pos-web',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();
let queue = [];
let sending = false;

async function processQueue() {
  if (sending || queue.length === 0) return;
  sending = true;

  while (queue.length > 0) {
    const msg = queue[0];
    try {
      await producer.send({
        topic: 'pos-demo',
        messages: [{ value: msg }]
      });
      console.log(`📤 Sent to Kafka: ${msg}`);
      queue.shift();
    } catch (err) {
      console.warn(`⚠️ Failed to send, will retry: ${msg}`, err.message);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  sending = false;
}

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
      const msgInput = document.getElementById('message');
      const msg = msgInput.value;
      fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      }).then(res => res.text()).then(txt => {
        document.getElementById('status').innerText = txt;
        msgInput.value = ''; // ✅ Clears the field after sending
      });
    }
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlPage);
  } else if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body || '{}');
        if (message && message.trim()) {
          queue.push(message.trim());
          processQueue();
        }
        res.writeHead(200);
        res.end("✅ Queued for delivery");
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
