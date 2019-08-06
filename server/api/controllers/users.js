const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const saltRounds = 10;
const emailController = require("../controllers/email");
const emailModule = require("../modules/email/email");
const uploader = require("../modules/uploader/uploader");
const multer = require("multer");
const {userNormalizer} = require("../modules/utils");


const ASC = "ASC";

const create = async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    try {
        const {name, email, password} = req.body;
        let userExist = await User.findOne({email});
        console.log("userExist - ", userExist);
        if (userExist && userExist.email === email) {
            console.log("userExist EMAIL - ", userExist.email);
            console.log("REQ BODY EMAIL - ", email);
            return res.status(403).send({message: "This user is already exists!!! Please try another email!"});
        } else {
            let hashedPassword = await bcrypt.hash(password, saltRounds);
            let result = await User.create({name, email, password: hashedPassword});
            console.log(result);
            const token = await jwt.sign({_id: result._id}, config.SECRET, {
                expiresIn: "1h"
            });
            console.log("NEW TOKEN - ", token);
            const url = await emailModule.getAutorizationURL(token);
            console.log("URL - ", url);
            const emailTemplate = await emailModule.authorizationTemplate(result, url);
            await emailModule.transporter.sendMail(emailTemplate, (err) => {
                if (err)
                    return res.status(500).send("Error sending email");
            });
            res.status(200).send({message: "Please, check Your email to get authorization link."});
        }
    } catch (err) {
        console.log("ERROR during creating new User - ", err);
        res.sendStatus(500);
    }
};


const authenticate = async (req, res) => {
    try {
        console.log("req.body - ", req.body);
        const {email, password} = req.body;
        let user = await User.findOne({email});
        console.log(user);
        if (!user) return res.status(401).send({message: "This user doesn`t exist!!! Please, autorized!!! "});
        const pass = await bcrypt.compare(password, user.password);
        console.log("COMPARE PASSWORD - ", pass);
        if (user !== null && pass !== false) {
            const token = jwt.sign({id: user._id}, config.SECRET, {expiresIn: "24h"});
            console.log(token);
            res.set("x-access-token", token);
            return res.status(200).send({message: "Authentication successfully passed!!!"});
        } else
            return res.status(401).send({message: "Incorrect Password!!!"});

    } catch (err) {
        console.log("ERROR during authenticating User - ", err);
        res.sendStatus(500);
    }
};

const logOut = async (req, res) => {
    try {
        const {_id} = req.body;
        res.status(200).send({_id, key: -1, message: "The User was Loged Out!!!"});
    } catch (err) {
        console.log("ERROR during authenticating User - ", err);
        res.sendStatus(500);
    }
};

const forgotPassword = async (req, res) => {
    console.log("REQ BODY FROM FORGOT PASSWORD - ", req.params);
    try {
        const {email} = req.body;
        let user = await User.findOne({email});
        console.log(user);
        if (!user)
            return res.status(404).send({message: `The user with this email - ${email} doesn\`t exist!`});
        const token = await emailModule.usePasswordHashToMakeToken(user);
        console.log("NEW TOKEN - ", token);
        const url = await emailModule.getPasswordResetURL(user, token);
        console.log("URL - ", url);
        const emailTemplate = await emailModule.resetPasswordTemplate(user, url);
        await emailModule.transporter.sendMail(emailTemplate, (err) => {
            if (err)
                return res.status(500).send("Error sending email");
        });
        res.status(200).send({message: "The message was sent to Your email!!!"});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};



const remove = async (req, res) => {
    console.log("REQ ID  - ", req.params.id);
    try {
        const _id = req.params.id;
        await User.findByIdAndDelete({_id});
        res.status(200).send({message: "User successfully DELETED!!!"});
    } catch (err) {
        console.log("ERROR during deleting User - ", err);
        res.sendStatus(500);
    }
};

const findOne = async (req, res) => {
    try {
        const _id = req.params.id;
        let result = await User.findOne({_id});
        result = userNormalizer(result);
        console.log(`User ${result._id} successfully Found!`);
        console.log(result);
        res.status(200).send({data: result, message: "User successfully FOUND!!!"});
    } catch (err) {
        console.log("Error during finding User - ", err);
        res.sendStatus(500);
    }
};

const getAll = async (req, res) => {
    console.log("REQ QUERY -", req.query);
    try {
        const {_end, _start, q, _sort, _order} = req.query;
        if (_end && _start || q || _sort && _order) {
            const start = Number(_start);
            const end = Number(_end);
            const queryConditions = {name: {$regex: q || "", $options: "i"}}; // conditions
            const total = await User.find(queryConditions).countDocuments();
            let results = await User.find(queryConditions)
                .skip(start)
                .limit(end - start)
                .sort({[_sort]: _order === ASC ? 1 : -1});
            results = results.map(user => userNormalizer(user));
            console.log("WITH CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({data: results, message: "The users successfully found!!!"});
        } else {
            const total = await User.find({}).countDocuments();
            let results = await User.find({});
            results = results.map(user => userNormalizer(user));
            console.log("WITHOUT CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({data: results, message: "The users successfully found!!!"});
        }
    } catch (err) {
        console.log("ERROR during getting All Users - ", err);
        res.sendStatus(500);
    }
};


const updateUserInfo = async (req, res) => {
    try {
        const {_id, name, email} = req.body;
        const newEmail = email;
        let userExist = await User.findOne({email: newEmail});
        if (userExist && userExist.email === newEmail)
            return res.status(403).send({message: "This user is already exists!!! Please try another email!"});
        else {
            let result = await User.findOneAndUpdate({_id},
                {name, email: newEmail},
                {new: true});
            result = userNormalizer(result);
            return res.status(200).send({data: result, message: "Name and Email successfully Updated!!!"});
        }
    } catch (err) {
        console.log("ERROR during User updating - ", err);
        res.sendStatus(500);
    }
};


module.exports = {
    create,
    authenticate,
    remove,
    findOne,
    getAll,
    updateUserInfo,
    logOut,
    forgotPassword,
};