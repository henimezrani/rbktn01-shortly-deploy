var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


let userSchema = mongoose.Schema({
  username: {type: String, unique: true},
  password: String

}) // All done

let User = mongoose.model('User', userSchema); // All done

User.on('save', function(next) {
  this.findOne({ password: { $regex: /^((?!\$.{59}).)*$/ , $options: 'gm' }  }).then((result) => {
    var cipher = Promise.promisify(bcrypt.hash);
    cipher(result.password, null, null).then(function(hash) {
      result.password = hash
      result.save()
    })
  }).then( () => {
    next()
  })
});

// userSchema.methods.initialize = function() {
//   this.on('creating', this.hashPassword);
//   // this.model('User').on('creating', this.hashPassword); reference this for the model.
// }

// userSchema.methods.comparePassword = function(attemptedPassword, callback) { // this.get password needs to be refactored
//   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//     callback(isMatch);
//   });
// }

// userSchema.methods.hashPassword = function() { // this.get password needs to be refactored
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.get('password'), null, null).bind(this)
//     .then(function(hash) {
//       this.set('password', hash);
//     });
// }

module.exports = User;
