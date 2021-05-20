const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    ModuleName: {
        type: String,
        require: true,
        maxLength: 50
    },

    StartTime: {
        type: Date,
        default: Date.now,
        require: true
    },

    EndTime: {
        type: Date,
        default: Date.now,
        require: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    FeedbackStartTime: {
        type: Date,
        default: Date.now,
        require: true
    },

    FeedbackEndTime: {
        type: Date,
        default: Date.now,
        require: true
    },

    Feedback: {
        type: Schema.Types.ObjectId,
        ref: Feedback
    },
});

module.exports = mongoose.model("Module", ModuleSchema)