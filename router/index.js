const express = require("express");
const router = express.Router();

router.use("/player", require("./playerRouter"));

module.exports = router;
