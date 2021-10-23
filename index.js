const express = require('express');
const path = require('path');
const { rootRouter } = require('./src/routers/root.routers');
var exphbs = require('express-handlebars');
const app = express();

// static file
const publicPathDirectory = path.join(__dirname, './public');
app.use('/public', express.static(publicPathDirectory));

// setting express handlerbar
app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// http://localhost:9000/api/v1
app.use('/api/v1', rootRouter);

// http://localhost:9000
app.listen(9000, () => {
    console.log('connect success on port 9000');
});
