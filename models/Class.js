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
        require: true,
        default: 1
    },

    StartTime: {
        type: String
    },

    EndTime: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Class", ClassSchema)