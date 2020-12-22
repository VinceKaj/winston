const path = require("path");
const mongoose = require('mongoose');
const MONGO_URL =
  (process.env.MODE == "DEVELOPER" ? process.env.MONGO_URL_OLD : process.env.MONGO_URL);

module.exports = async () => {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    return mongoose;
}