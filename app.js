const express = require('express');
const app= express();
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


//connect to db 
mongoose.connect('mongodb+srv://hoangthuc701:FySN2y5TV4MF2nW@cluster0-fbnn5.mongodb.net/test?retryWrites=true', {useNewUrlParser:true})
.then(()=>console.log("DB connected."));
mongoose.connection.on('error',err=>{
    console.log(err.message);
})



//apply midleware
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:false}));
app.use(cors())
app.use('/',require('./routes/url'));
app.use(function(req,res,next){
    res.render('notfound.html');
})



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running in port ${PORT}`);
})

