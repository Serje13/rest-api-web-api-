module.exports = {
    SECRET: "artpix3d",
    DB: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rest-api",
    port: process.env.port || 3000,
    email: process.env.EMAIL_LOGIN || "testpostbag@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "123.qwerty123"
};