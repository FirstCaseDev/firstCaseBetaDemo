var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ListSchema = new Schema({
  idx: { type: Number },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  country: { type: String },
});

module.exports = mongoose.model('List', ListSchema);
