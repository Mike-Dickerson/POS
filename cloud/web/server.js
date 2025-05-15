
const express = require('express');
const app = express();
const port = 3001;
app.get('/', (req, res) => res.send('<h1>Cloud UI (Offline Mode Capable)</h1>'));
app.listen(port, () => console.log(`UI running on http://localhost:${port}`));
