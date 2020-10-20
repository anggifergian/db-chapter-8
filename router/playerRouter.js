const express = require("express");
const router = express.Router();

const player = require("./../controller/playerController");

router.post("/create", player.createPlayer);
router.put("/edit/:id", player.updatePlayer);
router.get("/players", player.getAllPlayer);
router.get("/player/:id", player.getSelectedPlayer);

module.exports = router;
