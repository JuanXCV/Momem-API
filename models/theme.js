const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const themeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;