const jwt = require("jsonwebtoken");
const config = require("../config");

// const authorization = (req, res, next) => {
//     console.log("REQ HEADERS IN VALIDATE USER - ", req.headers);
//     let token = req.headers["x-access-token"];
//     const msg = {auth: false, message: "No token provided."};
//     if (!token)
//         return res.status(401).send(msg);

//     jwt.verify(token, config.SECRET, (err, decoded) => {
//         const msg = {auth: false, message: "Failed to authenticate token."};
//         if (err)
//             res.status(400).send(msg);
//         req.userId = decoded.id;
//         next();
//     });
// };
const authorization = async (req, res, next) => {
    console.log("REQ HEADERS IN VALIDATE USER - ", req.headers);
    try {
        let token = req.headers["x-access-token"];
        const msg = {auth: false, message: "No token provided."};
        if (!token)
            return res.status(401).send(msg);
        await jwt.verify(token, config.SECRET, (err, decoded) => {
            const msg = {auth: false, message: "Failed to authenticate token."};
            if (err)
                res.status(400).send(msg);
            req.userId = decoded.id;
            next();
        });
    } catch (err) {
        console.log("ERROR during Verifying  x-access-token - ", err);
    }
};

module.exports = authorization;