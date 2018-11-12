const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const fontSchema = new Schema({
 
  font:{
    type: ObjectId,
    ref: 'User',
  },
  theme: {
    type: ObjectId,
    ref: 'Theme'
  },
  karma: {
    type: Number,
    default: 0,
  }

});

const Font = mongoose.model('Font', fontSchema);

module.exports = Font;