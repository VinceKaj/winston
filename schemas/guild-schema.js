const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
}

const reqDate = {
  type: Date,
  required: true
}

const reqBool = {
  type: Boolean,
  required: true
}

const guildSchema = mongoose.Schema({
  _id: reqString,
  simpleWolframQueriesTotal: reqNumber,
  longWolframQueriesTotal: reqNumber,
  memberCount: reqNumber,
  dateJoined: reqDate,
  premium: reqBool
});

module.exports = mongoose.model("guild", guildSchema);
