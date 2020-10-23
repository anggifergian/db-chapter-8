const express = require("express");
const router = express.Router();

const player = require("./../controller/playerController");

function asyncMiddlewareFunction(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (err) {
            next(err);
        }
    };
}

router.post("/create", asyncMiddlewareFunction(player.createPlayer));
router.put("/edit/:id", asyncMiddlewareFunction(player.updatePlayer));
router.get("/get", asyncMiddlewareFunction(player.getAllPlayer));
router.get("/get/:id", asyncMiddlewareFunction(player.getSelectedPlayer));

module.exports = router;
