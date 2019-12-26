var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');



let linkSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 },
  user: String
}) // All done


// linkSchema.methods.initialize: function() {
//   this.on('creating', function(model, attrs, options) {
//     var shasum = crypto.createHash('sha1');
//     shasum.update(model.get('url'));
//     model.set('code', shasum.digest('hex').slice(0, 5));
//   });
// }

let Link = mongoose.model('Link', linkSchema); // All done


module.exports = Link;
