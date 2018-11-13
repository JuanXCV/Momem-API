const express = require('express');
const router = express.Router();

const Momem = require('../models/momem')
const Theme = require('../models/theme')
const Font = require('../models/font')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/list', (req, res, next) => {

  Theme.find()
  .then( themeList => {
    res.status(200).json(themeList);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.get('/fonts/font/:id', (req, res, next) => {
  const fontId = req.params.id;

  Font.findById(fontId)
  .populate('font')
  .populate('theme')
  .then( fontList => {
    res.status(200).json(fontList);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

router.get('/fonts/:id', (req, res, next) => {
  const themeId = req.params.id;

  Font.find({theme: themeId})
  .populate('font')
  .then( fontList => {
    res.status(200).json(fontList);
  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});


router.post('/', (req, res, next) => {
  let {name} = req.body;
  // const ownerId = req.session.currentUser._id
  name = name.toUpperCase();
  const ownerId = req.session.currentUser._id

  if (!name) {
    return res.status(422).json({
      error: 'empty'
    });
  }

  Theme.findOne({name: name})
  .then(theme => {
    if(theme){

      Font.find({font: ownerId, theme: theme._id})
      .populate('theme')
      .then(fonts => {

        if(fonts.length>0){
          fonts.forEach( font => {
            if(font.theme.name === name){
              return res.status(200).json(theme)
            } 
          })
        } else {

          const newFont = new Font({
            font: ownerId,
            theme: theme._id
          })

          newFont.save()
          .then( succes => {
            res.status(200).json(theme)
          })
          .catch( error => {
            res.status(500).json({
              error: 'Internal server error'
            })
          })
        }
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          error: error,
        })
      })

    } else {

      const newTheme = new Theme({
        name
      });
      
      newTheme.save()
      .then(theme => {

        const newFont = new Font({
          font: ownerId,
          theme: theme._id
        })

        newFont.save()
        .then( succes => {

          res.status(200).json(theme);
        })
        .catch( error => {
          res.status(500).json({
            error: 'Internal server error'
          });
        })
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

router.delete('/:id', (req, res, next) => {
  const themeId = req.params.id;
  // const ownerId = req.session.currentUser._id
  const ownerId = req.session.currentUser._id

  Font.findOneAndDelete({theme: ObjectId(themeId), font: ownerId})
  .then( succes => {
    res.status(200).json(succes)

  })
  .catch(error => {
    res.status(500).json({
      error: error,
    });
  });
});

module.exports = router;