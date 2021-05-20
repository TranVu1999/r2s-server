const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeFeedbackSchema = new Schema({
    TypeName: {
        type: String,
        require: true,
        maxLength: 50
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("TypeFeedback", TypeFeedbackSchema)