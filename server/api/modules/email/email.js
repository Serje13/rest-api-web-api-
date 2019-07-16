const nodemailer = require("nodemailer");
const config = require("../../../config");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: config.email,
        pass: config.pass
    }
});

const usePasswordHashToMakeToken = ({
    password,
    _id
}) => {
    const secret = `${password}-${config.SECRET}`;
    const token = jwt.sign({_id}, secret, {
        expiresIn: 3600 // 1 hour
    });
    return token;
};

const getPasswordResetURL = (user, token) =>
    `http://localhost:3000/password/reset/${user._id}/${token}`;

const resetPasswordTemplate = (user, url) => {
    const from = config.email;
    const to = user.email;
    const subject = "Password Reset";
    const html = `
      <p>Hey ${user.name || user.email},</p>
      <p>We heard that you lost your password. Sorry about that!</p>
      <p>But don’t worry! You can use the following link to reset your password:</p>
      <a href=${url}>${url}</a>
      <p>If you don’t use this link within 1 hour, it will expire.</p>
      <p>Do something outside today! </p>
      `;

    return {from, to, subject, html};
};

module.exports = {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate,
    usePasswordHashToMakeToken
};