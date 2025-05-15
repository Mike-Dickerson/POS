
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
    const response = await fetch('http://producer:5000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.json(result);
});

app.listen(port, () => console.log(`Web UI running at http://localhost:${port}`));
