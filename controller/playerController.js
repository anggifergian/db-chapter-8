const debug = require("debug")("app:controller");
const _ = require("lodash");
const mongoose = require("mongoose");
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

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).send(`Invalid player id.`);

    const player = await Player.findById(_id);
    if (!player) return res.status(400).send("Invalid player id.");
    res.send(player);
};

module.exports.updatePlayer = async (req, res) => {
    // Check id in params should be included
    const _id = req.params.id;
    if (!_id) return res.status(400).send(`Id required`);

    // Check is the given id has mongoose id data type
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).send(`Invalid player id.`);

    // Check is there player with the given id
    let player = await Player.findById(_id);
    if (!player) return res.status(400).send("Invalid player id.");

    const { email, username, experience, level } = req.body;

    // Check request body changes
    if (
        player.email === email &&
        player.username === username &&
        player.level === level &&
        player.experience === experience
    ) {
        return res.send(`No data was changed.`);
    }

    // Check request email changes and unique
    if (email !== player.email) {
        player = await Player.findOne({ email: email });
        if (player) return res.status(400).send(`Email has been registered.`);
    }

    // Check request username changes and unique
    if (username !== player.username) {
        player = await Player.findOne({ username: username });
        if (player) return res.status(400).send(`Username has been registered.`);
    }

    // Main update function
    player = await Player.findByIdAndUpdate(
        _id,
        _.pick(req.body, ["username", "email", "experience", "level"]),
        { new: true }
    );
    if (!player) return res.status(400).send(`Player with id ${_id} is not found.`);
    res.send(`Player with id ${_id} has been updated.`);
};
