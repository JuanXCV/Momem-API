const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(404).json({
      error: 'not-found'
    });
  }
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({
      error: 'Empty fields'
    });
  }

  User.findOne({
      username
    })
    .populate('filters.theme')
    .populate('filters.fonts')
    .populate('filters.fonts.font')
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: 'User not exists'
        });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      }
      return res.status(404).json({
        error: 'Incorrect password'
      });
    })
    .catch(next);
});


router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    email
  } = req.body;

  if (!username || !password || !email) {
    return res.status(422).json({
      error: 'Empty fields'
    });
  }

  User.findOne({
      username
    }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'User already exists'
        });
      }

      User.findOne( {email} )
      .then(result => {
        if(result) {
          return res.status(422).json({
            error: 'Email already exists'
          });
        }
        
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        
        const newUser = User({
          username,
          email,
          password: hashPass,
          name: username,
        });
        
        return newUser.save().then(() => {
          req.session.currentUser = newUser;
          res.json(newUser);
        });
        
        
      })
      .catch(next)
    })
    .catch(next);
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

module.exports = router;
