const express = require('express');
const router = express.Router();

const Momem = require('../models/momem')
const Theme = require('../models/theme')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/list', (req, res, next) => {

  Theme.find()
  .populate('fonts')
  .then( themeList => {
    res.status(200).json(themeList);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.post('/', (req, res, next) => {
  const {name} = req.body;
  const ownerId = req.session.currentUser._id

  if (!name) {
    return res.status(422).json({
      error: 'empty'
    });
  }

  Theme.find({name: name})
  .then(theme => {
    if(theme){
      theme.fonts.push(ObjectId(req.session.currentUser._id))
      theme.save()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).json({
          error: 'Internal server Error'
        })
      })
    } else {

      const newTheme = new Theme({
        name,
        fonts: [{font: ObjectId(req.session.currentUser._id)}]
      });
      
      newTheme.save()
      .then(momem => {
        res.status(200).json(momem);
      })
      .catch( error => {
        res.status(500).json({
          error: error
        });
      });

    }


  })
  .catch(error => {
    res.status(500).json({
      error: 'Internal server Error'
    })
  })
});

router.delete('/theme/:id', (req, res, next) => {
  const themeId = req.params.id;

  Theme.findById(themeId)
  .populate('fonts')
  .then( theme => {
    theme.fonts.forEach((item,idx) => {
      if (item.font._id.equals(req.session.currentUser._id)) {
        theme.fonts.splice(idx, 1)
      }
    })

    // (item.font._id.toString() === req.session.currentUser._id.toString())

    theme.save()
    .then(succes => {

      res.status(200).json(themeList);
    })
    .catch(error => {
      res.status(500).json({
        error: 'Internal server error'
      })
    })


  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

module.exports = router;