const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trainee_AssignmentSchema = new Schema({
    RegistrationCode: {
        type: String,
        require: true,
        maxLength: 50
    },

    Trainee: {
        type: Schema.Types.ObjectId,
        ref: 'Trainee'
    },
});

module.exports = mongoose.model("Trainee_Assignment", Trainee_AssignmentSchema)