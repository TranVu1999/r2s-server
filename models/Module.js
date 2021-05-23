const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    ModuleName: {
        type: String,
        require: true,
        maxLength: 50
    },

    StartTime: {
        type: String,
        default: ""
    },

    EndTime: {
        type: String,
        default: ""
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    FeedbackStartTime: {
        type: String,
        default: ""
    },

    FeedbackEndTime: {
        type: String,
        default: ""
    },

    Feedback: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    },

    Admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
});

module.exports = mongoose.model("Module", ModuleSchema)