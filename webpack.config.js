const path = require('path');


module.exports = {
    mode : 'development',
    devtool : 'source-map',
    contexte : path.resolve(__dirname, 'src'),
    entry : 'index.js',
}
