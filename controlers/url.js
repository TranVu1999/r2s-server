require('dotenv').config();
const Url = require('./../models/url');
const validUrl = require("valid-url");
const shortid = require("shortid");


exports.createUrl = async(req,res)=>{
    const urlCode = shortid.generate();
    const baseUrl =process.env.HOST;
    const shortUrl = baseUrl + '/'+urlCode;
    const longUrl =req.body.longUrl;
    if (validUrl.isUri(longUrl)){
        const newUrl = await new Url({
            longUrl,
            shortUrl:urlCode
        });
        await newUrl.save();
        res.status(200).json({
            code:'200',
            shortUrl
        });
    }
    else
    {
        res.status(401).json({
            code:'401',
            error:'Invalid Original Url.'
        });
    }
}

exports.queryUrl = async (req,res)=>{
    const urlCode = req.params.code;
    const item = await Url.findOne({shortUrl:urlCode});
    if (item){
        res.redirect(item.longUrl);
    }
    else
    {
        res.redirect('https://shortingurl.herokuapp.com');
    }
}
exports.indexpage = (req,res)=>{
    res.render('index.html');
}