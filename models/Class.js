const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    ClassName: {
        type: String,
        require: true,
        maxLength: 255
    },

    Capacity: {
        type: Number,
        require: true
    },

    StartTime: {
        type: Date,
        default: Date.now
    },

    EndTime: {
        type: Date,
        default: Date.now
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Class", ClassSchema)