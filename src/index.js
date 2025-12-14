// src/index.js
// Entry point: load env and start the express app.
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
