const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    RegistrationCode: {
        type: String,
        require: true,
        maxLength: 255
    },

    Class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },

    Module: {
        type: Schema.Types.ObjectId,
        ref:'Module'
    },

    Trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer'
    },
});

module.exports = mongoose.model("Assignment", AssignmentSchema)