require('dotenv').config(); // Load .env variables
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI) 
    .then(() =>console.log("Connected to MongoDB"))
    .catch(err => console.error("Connection error:", err));

const express = require('express');
const cors = require('cors'); // For frontend requests
const app = express();
const port = 3001; // Port for server

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello from your bug tracker server!');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
