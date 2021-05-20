const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    longUrl:{
        type: String,
        required:true,
        trim: true
    },
    shortUrl:{
        type: String,
        trim: true
    },
    created:{
        type:Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Url",UrlSchema);