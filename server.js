var app = require('./server-config.js');
// const dotenv = require('dotenv');
// dotenv.config();

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
