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
const config = require("config");

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
mongoose.connect(config.get("db"));
const db = mongoose.connection;
db.on("error", debugMongoose.bind(console, "connection error"));
db.once("open", () => console.log(`Connected to database...`));

// Main route
app.use("/api/v1", require("./router/index"));

// Error handling
app.use(require("./middleware/error"));

// Port listening
app.listen(PORT, () => debugStartup(`Listening on port ${PORT}...`));
