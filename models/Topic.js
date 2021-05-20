const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    TopicName: {
        type: String,
        require: true,
        maxLength: 255
    }
});

module.exports = mongoose.model("Topic", TopicSchema)