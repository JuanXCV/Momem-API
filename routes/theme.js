const express = require('express');
const router = express.Router();

const Momem = require('../models/momem')
const Theme = require('../models/theme')
const Font = require('../models/font')

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
  // const ownerId = req.session.currentUser._id

  const ownerId = ObjectId("5be6af1eddc8a565f24c6e3e");

  if (!name) {
    return res.status(422).json({
      error: 'empty'
    });
  }

  Theme.findOne({name: name})
  .then(theme => {
    if(theme){

      Font.find({font: ownerId})
      .populate('theme')
      .then(fonts => {

        if(fonts.length>0){
          fonts.forEach( font => {
            if(font.theme.name === name){
              return res.status(422).json({
                message: 'Font yet added'
              })
            } 
          })
        } else {

          const newFont = new Font({
            font: ownerId,
            theme: theme._id
          })

          newFont.save()
          .then( succes => {
            res.status(200).json({
              message: 'Font added succesfully'
            })
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

          res.status(200).json({
            message: 'Theme added succesfully'
          });
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
  const ownerId = ObjectId("5be6af1eddc8a565f24c6e3e");

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