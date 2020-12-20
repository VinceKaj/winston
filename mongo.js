const path = require("path");
const mongoose = require('mongoose');
const mongoPath = process.env.MONGO_URL;

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    return mongoose;
}