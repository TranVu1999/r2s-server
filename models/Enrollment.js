const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
    Class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },

    Trainee: {
        type: Schema.Types.ObjectId,
        ref: 'Trainee'
    },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema)