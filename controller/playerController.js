const debug = require("debug")("app:controller");
const _ = require("lodash");
const { Player, validatePlayer } = require("../models/playerModel");

module.exports.createPlayer = async (req, res) => {
    const { error } = validatePlayer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let player = await Player.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (player) return res.status(400).send(`Player has been registered.`);

    player = new Player(_.pick(req.body, ["username", "email", "experience", "level"]));

    const customer = await player.save();
    res.send(`Success create player with id ${customer.id}`);
};

module.exports.getAllPlayer = async (req, res) => {
    const players = await Player.find().sort("username");
    res.send(players);
};

module.exports.getSelectedPlayer = async (req, res) => {
    const _id = req.params.id;
    if (!_id) return res.status(400).send(`Id required`);

    const player = await Player.findById(_id);
    if (!player) return res.status(400).send("Invalid player id.");
    res.send(player);
};

module.exports.updatePlayer = async (req, res) => {
    const _id = req.params.id;
    if (!_id) return res.status(400).send(`Id required`);

    let player = await Player.findById(_id);
    if (!player) return res.status(400).send("Invalid player id.");

    if (player.email === req.body.email && player.username === req.body.username) {
        return res.send(`No data was changed.`);
    }

    if (req.body.email !== player.email) {
        player = await Player.findOne({ email: req.body.email });
        debug("Ga ada email");
        if (player) return res.status(400).send(`Email has been registered.`);
    }

    player = await Player.findOne({ username: req.body.username });
    if (player) return res.status(400).send(`Username has been registered.`);

    player = await Player.findByIdAndUpdate(
        _id,
        _.pick(req.body, ["username", "email", "experience", "level"]),
        { new: true }
    );
    if (!player) return res.status(400).send(`Player with id ${_id} is not found.`);
    res.send(`Player with id ${_id} has been updated.`);
};
