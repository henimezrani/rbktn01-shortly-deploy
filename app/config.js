var mongoose = require("mongoose")
mongoose.connect('mongodb://AhmedAndHeni:AhmedAndHeni1@ds047955.mlab.com:47955/shortly', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', ()=> console.log("there is an err"))
db.once('open', ()=> console.log("alrighty"))


module.exports = db;
