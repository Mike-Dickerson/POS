
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('<h1>Store UI (Offline Mode Capable)</h1>'));
app.listen(port, () => console.log(`UI running on http://localhost:${port}`));
