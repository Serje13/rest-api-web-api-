const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var config = require("../../config");
const saltRounds = 10;

const ASC = "ASC";

const normalizer = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};

const create = async (req, res) => {
    // console.log(req.body);
    try {
        const {name, email, password} = req.body;
        let userExist = await User.findOne({email});
        console.log("userExist - ", userExist);
        if (userExist && userExist.email === email) {
            console.log("userExist EMAIL - ", userExist.email);
            console.log("REQ BODY EMAIL - ", email);
            return res.status(403).send({message: "This user is already exists!!! Please try another email!"});
        } else {
            let hashedPassword = bcrypt.hashSync(password, saltRounds);
            let result = await User.create({name, email, password: hashedPassword});
            console.log(result);
            let token = jwt.sign({id: result._id}, config.SECRET, {expiresIn: "24h"});
            let newUser = normalizer(result);
            res.set("x-access-token", token);
            res.status(200).send({data: {newUser}, message: "The user successfully created!!!"});
        }
    } catch (err) {
        console.log("ERROR during creating new User - ", err);
        res.sendStatus(400);
    }
};


const authenticate = async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        console.log(user);
        if (user != null && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({id: user._id}, config.SECRET, {expiresIn: "24h"});
            console.log(token);
            res.set("x-access-token", token);
            res.status(200).send({message: "Authentication successfully passed!!!"});
        } else
            res.status(401).send({message: "This user doesn`t exist!!! Please, autorized!!! "});

    } catch (err) {
        console.log("ERROR during authenticating User - ", err);
        res.sendStatus(400);
    }
};

const logOut = async (req, res) => {
    try {
        const {_id} = req.body;
        res.status(200).send({_id, key: -1, message: "The User was Loged Out!!!"});
    } catch (err) {
        console.log("ERROR during authenticating User - ", err);
        res.sendStatus(400);
    }
};

const resetPassword = (req, res) => {
    console.log("Hello From Reset Password");
    res.status(200).send({message: "Password successfully reseted"});
};
const remove = async (req, res) => {
    console.log("REQ ID  - ", req.params.id);
    try {
        const _id = req.params.id;
        await User.findByIdAndDelete(_id);
        res.status(200).send({message: "User successfully DELETED!!!"});
    } catch (err) {
        console.log("ERROR during deleting User - ", err);
        res.status(400).send({message: "ERROR during deleting User"});
    }
};

const findOne = async (req, res) => {
    try {
        const _id = req.params.id;
        let result = await User.findOne({_id});
        result = normalizer(result);
        console.log(`User ${result._id} successfully Found!`);
        console.log(result);
        res.status(200).send({data: result, message: "User successfully FOUND!!!"});
    } catch (err) {
        console.log("Error during finding User - ", err);
        res.sendStatus(400);
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
            results = results.map(user => normalizer(user));
            console.log("WITH CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({data: results, message: "The users successfully found!!!"});
        } else {
            const total = await User.find({}).countDocuments();
            let results = await User.find({});
            results = results.map(user => normalizer(user));
            console.log("WITHOUT CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({data: results, message: "The users successfully found!!!"});
        }
    } catch (err) {
        console.log("ERROR during getting All Users - ", err);
        res.sendStatus(400);
    }
};


const updateUserInfo = async (req, res) => {
    try {
        const {_id, name, email} = req.body;
        console.log("BODY ID - ", _id);
        const newEmail = email;
        let userExist = await User.findOne({email: newEmail});
        console.log("userExist - ", userExist);
        if (userExist && userExist.email === newEmail) {
            console.log("userExist EMAIL - ", userExist.email);
            console.log("REQ NEW EMAIL - ", newEmail);
            return res.status(403).send({message: "This user is already exists!!! Please try another email!"});
        }
        else {
            let result = await User.findOneAndUpdate({_id},
                {name, email: newEmail},
                {new: true});
            result = normalizer(result);
            console.log("RESULT AFTER UPDATE - ", result);
            res.status(200).send({data: result, message: "Name and Email successfully Updated!!!"});
        }
    } catch (err) {
        console.log("ERROR during User updating - ", err);
        res.sendStatus(400);
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
    resetPassword
};