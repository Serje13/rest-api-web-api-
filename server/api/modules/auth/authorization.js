const jwt = require("jsonwebtoken");
const config = require("../../../config");
const {id} = require("../../../info.json");

//The first level of privacy for all authorized users
const authorizeUser = async (req, res, next) => {
    try {
        //console.log("REQ QUERY FROM AUTHORIZATION - ", req.query);
        //console.log("REQ BODY FROM AUTHORIZATION - ", req.body);
        // console.log("TOKEN FROm HEADERS - ", req.headers["x-access-token"]);
        let token = req.headers["x-access-token"] ? req.headers["x-access-token"] : req.query.token;
        console.log("TOKEN - ", token);
        const msg = {auth: false, message: "No token provided."};
        if (!token)
            return res.status(401).send(msg);
        //Decode the token and verif user id 
        const decoded = await jwt.decode(token);
        // If Admin`s id, sets the secret for Admin else for user
        const secret = decoded.id === id ? config.SECRET + config.email : config.SECRET;
        await jwt.verify(token, secret, (err) => {
            const msg = {auth: false, message: "Failed to authenticate token."};
            if (err)
                return res.status(400).send(msg);
            else next();
        });
    } catch (err) {
        console.log("ERROR during Verifying  x-access-token - ", err);
        res.sendStatus(500);
    }
};

// The second level of privacy for Admin
const authorizeAdmin = async (req, res, next) => {
    try {
        let token = req.headers["x-access-token"] ? req.headers["x-access-token"] : req.query.token;
        //console.log("TOKEN - ", token);
        const msg = {auth: false, message: "No token provided."};
        if (!token)
            return res.status(401).send(msg);
        const secret = config.SECRET + config.email;
        await jwt.verify(token, secret, (err, decoded) => {
            console.log("decoded From Modified MODE - ", decoded);
            const msg = {message: "Access denied. You don`t have permission to perform this operation."};
            if (err)
                return res.status(400).send(msg);
            else next();
        });
    } catch (err) {
        console.log("ERROR during Verifying  x-access-token - ", err);
        res.sendStatus(500);
    }
};

module.exports = {
    authorizeUser,
    authorizeAdmin
};