var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
   Link.find({user: req.session.user._id}, function(err, links) {
    res.json(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;


  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
   Link.findOne({ url: uri }, function(err, found) {
    if (found) {
      res.json(found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var shasum = crypto.createHash('sha1');
        shasum.update(uri);
        Link.create({
          url: uri,
          title: title,
          code : shasum.digest('hex').slice(0, 5),
          baseUrl: req.headers.origin,
          user: req.session.user._id
        } , (err ,created) => {
          res.json(created);
        });
      });
    }
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).then( (user) => {
    if (!user) {
      res.redirect('/login');
    } else {
      console.log(password , user.password)
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(isMatch)
        if (isMatch) {
          util.createSession(req, res, user);

        } else {
          res.redirect('/login');
        }
  });

    }
  });



exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //

  User.findOne({ username: username }, function(err, user) {
    if (!user) {

      var cipher = Promise.promisify(bcrypt.hash);
      cipher(password, null, null).then(function(hash) {
        console.log(cipher , hash)
        User.create({username: username , password : hash} , (err, created)=>{
          util.createSession(req, res, created);

        });

      })


    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });

};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    console.log(req.params)
    if (!link) {
      res.redirect('/');
    } else {
      url = link.url
      link.visits++
      link.save()
      res.redirect(url);
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });

};