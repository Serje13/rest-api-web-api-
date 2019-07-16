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
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.urlencoded({limit: "5mb", extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

//Set Public folder
// app.use(express.static(path.join(__dirname + "/public")));
// app.use(express.static("public", { index: false, extensions: ["json"] }));
//app.use(express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css')));

// public route
app.use("/users", users);
app.use("/password/forgot", users);

// private routes
app.use("/users/remove", validateUser, users);
app.use("/users/update", validateUser, users);
app.use("/users/logout", validateUser, users);
app.use("/authenticated", validateUser, orders);

app.use("/password/reset", email);
// private route



app.get("/", (req, res) => {
    res.send("Hello from Express!!!");
});

//Start Server
app.listen(config.port, () => {
    console.log("App listening on port 3000!");
});
