const express = require('express');
const path = require('path');
const { handleError } = require('./src/helpers/error');
const { rootRouter } = require('./src/routers/root.routers');
const app = express();
require('dotenv').config();

// static file
const publicPathDirectory = path.join(__dirname, './public');
app.use('/public', express.static(publicPathDirectory));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 9000;
// http://localhost:9000/api/v1
app.use('/api/v1', rootRouter);
// custom Error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});
// http://localhost:9000
app.listen(PORT, () => {
    console.log(`connect success on port ${PORT}`);
});
