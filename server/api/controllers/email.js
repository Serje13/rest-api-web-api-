const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const transporter = require("../modules/email/email");
const saltRounds = 10;


const receiveNewPassword = async (req, res) => {
    try {
        const {_id, token} = req.params;
        console.log("TOKEN - ", token);
        const {password} = req.body;
        console.log("password- ", password);
        const user = await User.findOne({_id});
        console.log("user- ", user);
        const secret = `${user.password}-${config.SECRET}`;
        console.log("secret- ", secret);
        const payload = await jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                const msg = {message: "Failed to authenticate token."};
                return res.status(400).send(msg);
            } else return decoded;
        });
        if (payload._id == user._id) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("hashedPassword - ", hashedPassword);
            const result = await User.findOneAndUpdate({_id}, {password: hashedPassword}, {new: true});
            console.log("RESULT AFTER SAVE NEW PASSWORD - ", result);
            return res.status(202).send({message: "Password changed accepted!!!"});
        }
    } catch (err) {
        res.status(400).send({message: "Error during accepting new password!!!"});
    }
};


module.exports = {
    receiveNewPassword
};