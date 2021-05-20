const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainerSchema = new Schema({
    UserName: {
        type: String,
        require: true,
        uniquire: true,
        maxLength: 50
    },

    Name: {
        type: String,
        require: true,
        maxLength: 50
    },

    Email: {
        type: String,
        require: true,
        maxLength: 50
    },

    Phone: {
        type: String,
        require: true,
        maxLength: 50
    },

    Address: {
        type: String,
        require: true,
        maxLength: 255
    },

    isActive: {
        type: Boolean,
        default: true
    },

    Password: {
        type: String,
        require: true,
        maxLength: 255
    },

    ActivationCode: {
        type: String,
        require: true,
        maxLength: 50,
        default: ""
    },

    ResetPasswordCode: {
        type: String,
        require: true,
        maxLength: 50,
        default: ""
    },

    IsReceiveNotification: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("Trainer", TrainerSchema)