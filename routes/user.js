const express = require('express');
const router = express.Router();

const Momem = require('../models/momem')
const Theme = require('../models/theme')
const User = require('../models/user')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



router.put('/addFilter/:id', (req, res, next) => {
  const themeId = req.params.id;
  // const userId = req.session.currentUser._id;

  const userId = ObjectId("5be6af1eddc8a565f24c6e3e");

  User.findById(userId)
  .then(user => {

    user.filters.push({theme: themeId})
    user.save()
    .then(succes => {
      res.status(200).json({
        message: 'Filter added succesfully'
      })
    })
    .catch(error => {
      res.status(500).json({
        error: 'Internal server error'
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      error: 'Internal server error'
    })
  })
});

router.put('/filter/:themeId/addFont/:fontId', (req, res, next) => {
  const {themeId, fontId} = req.params;
  // const userId = req.session.currentUser._id;

  const userId = ObjectId("5be6af1eddc8a565f24c6e3e");

  User.findById(userId)
  .then(user => {

    user.filters.forEach((filter,idx) => {
      if (filter.theme.equals(ObjectId(themeId))) {
        filter.fonts.push(fontId)
      }
    })

    user.save()
    .then(succes => {
      res.status(200).json({
        message: 'Font added succesfully'
      })
    })
    .catch(error => {
      res.status(500).json({
        error: 'Internal server error'
      })
    })
  })
  .catch(error => {
    res.status(500).json({
      error: 'Internal server error'
    })
  })
});


router.get('/:id', (req, res, next) => {
  const userId = req.params.id;


  User.findById(userId)
  .populate('filters.fonts')
  .populate('filters.font.theme')
  .then( user => {
    res.status(200).json(user);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});


module.exports = router;