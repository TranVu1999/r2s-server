const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feedback_CommentSchema = new Schema({
    FeedbackId: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    QuestionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
});

module.exports = mongoose.model("Feedback_Comment", Feedback_CommentSchema)