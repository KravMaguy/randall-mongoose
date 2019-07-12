const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  name: {
    type: String,
    required: 'enter a name'
  },
  email: {
    type: String,
    required: 'enter an email'
  },
  comment: {
    type: String
  }
});

module.exports = { feedbackSchema };