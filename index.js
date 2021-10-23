const express = require('express');
const path = require('path');
const { rootRouter } = require('./src/routers/root.routers');
const app = express();

// static file
const publicPathDirectory = path.join(__dirname, './public');
app.use('/public', express.static(publicPathDirectory));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// http://localhost:9000/api/v1
app.use('/api/v1', rootRouter);

// http://localhost:9000
app.listen(9000, () => {
    console.log('connect success on port 9000');
});
