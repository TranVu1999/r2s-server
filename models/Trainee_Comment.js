const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trainee_CommentSchema = new Schema({
    Comment: {
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
        ref: 'Module'
    },

    Trainee: {
        type: Schema.Types.ObjectId,
        ref: 'Trainee'
    },
});

module.exports = mongoose.model("TraineeComment", Trainee_CommentSchema)