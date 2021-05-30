const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    Value: {
        type: Number,
        require: true
    },

    Class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },

    Module: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },

    Trainee: {
        type: Schema.Types.ObjectId,
        ref: 'Trainee'
    },

    Question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }
});

module.exports = mongoose.model("Answer", AnswerSchema)