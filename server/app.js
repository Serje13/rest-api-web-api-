const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const logger = require("morgan");
const config = require("./config");
const orders = require("./api/routes/orders");
const users = require("./api/routes/users");
const email = require("./api/routes/email");
const validateUser = require("./api/modules/auth/authorization");
const dbConnect = require("./db");
const multer = require("multer");
var upload = multer();

dbConnect();

app.use((req, res, next) => {
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.sendStatus(200);
    }
    next();
});

app.use(bodyParser.urlencoded({limit: "5mb", extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

//Set Public folder
app.use("/uploads", express.static("uploads"));

// public route
app.use("/users", upload.none(), users);

// private routes
app.use("/authenticated", validateUser, users);
app.use("/authenticated", validateUser, orders);
app.use("/password/reset", upload.none(), email);
// private route

app.get("/", (req, res) => {
    res.send("Hello from Express!!!");
});

//Start Server
app.listen(config.port, () => {
    console.log("App listening on port 3000!");
});
