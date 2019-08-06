const jwt = require("jsonwebtoken");
const config = require("../../../config");

const authorization = async (req, res, next) => {
    try {
        console.log("REQ QUERY FROM AUTHORIZATION - ", req.query);
        let token = req.headers["x-access-token"] ? req.headers["x-access-token"] : req.query.token;
        console.log("TOKEN - ", token);
        const msg = {auth: false, message: "No token provided."};
        if (!token)
            return res.status(401).send(msg);
        await jwt.verify(token, config.SECRET, (err) => {
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

module.exports = authorization;