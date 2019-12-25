var app = require('./server-config.js');
const dotenv = require('dotenv');
dotenv.config();

var port = process.env.PORT;

app.listen(port);

console.log('Server now listening on port ' + port);
