const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const momemSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  themes: [{
    type: ObjectId,
    ref: 'Theme'
  }],
  likes: [{
    type: ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Momem = mongoose.model('Momem', momemSchema);

module.exports = Momem;