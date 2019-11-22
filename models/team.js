const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const teamSchema = new Schema({
  name: String,
  project: String,
  projDesc: String,
  members: [
    { name: String, reg: String, email: String, phone: String, image: String }
  ]
});
module.exports = mongoose.model('team', teamSchema, 'teams');
