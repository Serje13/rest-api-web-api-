const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
});

//Used Mongoose preSave HOOK for hashing password
// UserSchema.pre("save", (user) => {
//     console.log("USER IN PRE SAVE - ", user);
//     console.log("THIS IN PRE SAVE - ", this);
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
// });

module.exports = mongoose.model("User", UserSchema);