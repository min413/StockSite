'use strict'

import routes from "./routes/index.js";
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express();
const port = 5000;


app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', routes);

app.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
  });


/*app.post('/get-stock-data', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5500/get-stock-data', req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error: ${error.message}');
    }
});*/

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



