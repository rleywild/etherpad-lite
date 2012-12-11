// forward http to https
// TODO factor as cmd line args
var params = {hostname: "127.0.0.1", https_port: "9001", http_port: "8001"}

var express = require("express");
var app = express();

app.get('*',function(req,res){  
    res.redirect("https://" + params.hostname + ":" + params.https_port + req.url)
})
app.listen(params.http_port);
