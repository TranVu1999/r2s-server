const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    UserName: {
        type: String,
        uniquire: true,
        require: true,
        maxLength: 50
    },
    
    Name: {
        type: String,
        require: true,
        maxLength: 255
    },

    Email: {
        type: String,
        require: true,
        maxLength: 50
    },

    Password: {
        type: String,
        maxLength: 255,
        require: true
    }
});

module.exports = mongoose.model("Admin", AdminSchema)