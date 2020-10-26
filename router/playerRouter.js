const express = require("express");
const router = express.Router();

const player = require("./../controller/playerController");
const asyncMiddleware = require("./../middleware/async");

router.post("/create", asyncMiddleware(player.createPlayer));
router.put("/edit/:id", asyncMiddleware(player.updatePlayer));
router.get("/get", asyncMiddleware(player.getAllPlayer));
router.get("/get/:id", asyncMiddleware(player.getSelectedPlayer));

module.exports = router;
