const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  momem: {
    type: ObjectId,
    ref: 'Momem'
  },
  comment: {
    type: String,
    required: true,
  },
  likes: [{
    type: ObjectId,
    ref: 'User',
  }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;