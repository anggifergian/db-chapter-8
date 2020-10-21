const moment = require("moment");
const Joi = require("joi");
const mongoose = require("mongoose");

const Player = mongoose.model(
    "Player",
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
        },
        level: {
            type: String,
        },
        createdAt: {
            type: Date,
            required: true,
            default: moment().format("YYYY-MM-DD, HH:mm:ss"),
        },
    })
);

function validatePlayer(player) {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        experience: Joi.string().required(),
        level: Joi.string().required(),
    });

    return schema.validate(player);
}

module.exports = {
    Player,
    validatePlayer,
};
