const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    QuestionContent: {
        type: String,
        maxLength: 255,
        require: true
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },

    TopicId: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
});

module.exports = mongoose.model("Question", QuestionSchema)