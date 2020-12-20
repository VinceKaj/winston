const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqArray = {
  type: Array,
  required: true
}

const starboardSchema = mongoose.Schema({
  _id: reqString,
  _boards: reqArray,
  _messages: reqArray
});

module.exports = mongoose.model("starboard", starboardSchema);
