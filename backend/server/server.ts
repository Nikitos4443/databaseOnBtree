export const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/route');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use('/', router);

app.listen(5000, "localhost", () => {
    console.log('Server is working on url localhost:5000');
})