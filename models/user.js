const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    default: "Say something about you"
  },
  image: {
    type: String,
    default: "http://profilepicturesdp.com/wp-content/uploads/2018/06/default-profile-picture-gmail-3.png"
  },
  backgroundImage: {
    type: String,
    default: "https://cdn-images-1.medium.com/max/1600/0*I-sI3u34g0ydRqyA"
  },
  filters: [{
    theme:{
      type: ObjectId,
      ref: 'Theme'
    },
    fonts:[{
      type: ObjectId,
      ref: 'Font'
    }]
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;