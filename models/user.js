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
    default: "/images/avatar.png"
  },
  backgroundImage: {
    type: String,
    default: "/images/background.png"
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