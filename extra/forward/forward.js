// script to forward http:8080 to https:9001

// set up plain http server
var express = require("express");
var app = express();

// set up a route to redirect http to https
app.get('*',function(req,res){  
    res.redirect('https://127.0.0.1:9001'+req.url)
})

// have it listen on 8080
app.listen(8080);
