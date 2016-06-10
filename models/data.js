// Load required packages
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/IQtests');

// Define our beer schema
var DataSchema   = new mongoose.Schema({
  question: String,
  answer: String,
  image: String,
  explanation: String,
  date: {type: Date,'default': Date.now},
   date_created:Date,
   option: String
});

// Export the Mongoose model
module.exports = mongoose.model('Data', DataSchema);