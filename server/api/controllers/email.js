const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const transporter = require("../modules/email/email");
const saltRounds = 10;


const receiveNewPassword = async (req, res) => {
    try {
        const {_id, token} = req.params;
        const {password} = req.body;
        const user = await User.findOne({_id});
        const secret = `${password}-${config.SECRET}`;
        const payload = jwt.decode(token, secret);
        if (payload._id == user._id) {
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            console.log("hashedPassword - ", hashedPassword);
            const result = await User.findOneAndUpdate({_id}, {password: hashedPassword}, {new: true});
            console.log("RESULT AFTER SAVE NEW PASSWORD - ", result);
            res.status(202).send({message: "Password changed accepted!!!"});
        }
    } catch (err) {
        res.status(400).send({message: "Error during accepting new password!!!"});
    }
};


module.exports = {
    receiveNewPassword
};