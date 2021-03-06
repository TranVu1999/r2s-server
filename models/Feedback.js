const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    Title: {
        type: String,
        require: true,
        maxLength: 255
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    AdminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    
    TypeFeedbackId: {
        type: Schema.Types.ObjectId,
        ref: 'TypeFeedback'
    },
});

module.exports = mongoose.model("Feedback", FeedbackSchema)