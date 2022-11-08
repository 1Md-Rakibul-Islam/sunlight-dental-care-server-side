const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');



require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// require('crypto').randomBytes(64).toString('hex')

// middle qares
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Sinlight Dental Care server is running')
})

app.listen(port, () => {
    console.log(`Sinlight Dental Care server running on ${port}`);
})