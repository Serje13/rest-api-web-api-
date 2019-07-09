const config = require("./config");
const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(config.DB, {useNewUrlParser: true, useFindAndModify: false});
        console.log("Connected to DB");
    } catch (err) {
        console.log("ERROR during Connecting to DB - ", err);
    }
};

module.exports = dbConnect;