const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.post('/get-stock-data', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5500/get-stock-data', req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error: ${error.message}');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



