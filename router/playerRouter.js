const express = require("express");
const router = express.Router();

const player = require("./../controller/playerController");

router.post("/create", player.createPlayer);
router.put("/edit/:id", player.updatePlayer);
router.get("/get", player.getAllPlayer);
router.get("/get/:id", player.getSelectedPlayer);

module.exports = router;
