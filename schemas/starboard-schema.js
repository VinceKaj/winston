const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqArray = {
  type: Array,
  required: true
}

const reqBool = {
  type: Boolean,
  required: true
}

const reqNumber = {
  type: Number,
  required: true
}

const starboardSchema = mongoose.Schema({
  _id: reqString,
  boards: reqArray,
  messages: reqArray,
  selfStar: reqBool,
  min: reqNumber,
  channel: reqString,
  enabled: reqBool
});

module.exports = mongoose.model("starboard", starboardSchema);
