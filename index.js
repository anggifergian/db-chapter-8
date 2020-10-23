const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const debugMongoose = require("debug")("app:db");
const debugStartup = require("debug")("app:startup");
const debugRequest = require("debug")("app:req");
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3000;

// Setup middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev", { stream: { write: (msg) => debugRequest(msg) } }));

// Setup mongoose
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/chapter-8");
const db = mongoose.connection;
db.on("error", debugMongoose.bind(console, "connection error"));
db.once("open", () => debugMongoose(`Connected to database...`));

// Main route
app.use("/api/v1", require("./router/index"));

app.use(function (err, req, res, next) {
    res.status(500).send("Something failed.");
});

// Port listening
app.listen(PORT, () => debugStartup(`Listening on port ${PORT}...`));
