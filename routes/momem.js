const express = require('express');
const router = express.Router();

const Momem = require('../models/momem')
const Theme = require('../models/theme')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/list', (req, res, next) => {

  Momem.find()
  .populate('owner')
  .then( momemList => {
    res.status(200).json(momemList);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.post('/', (req, res, next) => {
  const {title, content, themes, image, location} = req.body;
  const ownerId = req.session.currentUser._id

  if (!title || !content || !image || !themes) {
    return res.status(422).json({
      error: 'empty'
    });
  }

  const newMomem = new Momem({
    owner: ObjectId(ownerId),
    title,
    content,
    image,
    themes,
  });
  
  newMomem.save()
  .then(momem => {
    res.status(200).json(momem);
  })
  .catch( error => {
    res.status(500).json({
      error: error
    });
  });
 
});

router.get('/:id', (req, res, next) => {

  const momemId = req.params.id;

  Momem.findById(momemId)
  .populate('owner')
  .then( momem => {
    res.status(200).json(momem);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.put('/:id', (req, res, next) => {

  const momemId = req.params.id;
  const {title, content, image, themes, location} = req.body;

  const momemToUpdate = {
    title,
    content,
    image
  };
  
  Momem.findByIdAndUpdate(momemId, momemToUpdate)
  .then( momem => {
    res.status(200).json(momem);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.delete('/:id', (req, res, next) => {

  const momemId = req.params.id;

  Momem.findByIdAndDelete(momemId)
  .then( momem => {
    res.status(200).json(momem);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});











module.exports = router;