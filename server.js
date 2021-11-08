const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.sendFile(__dirname+'/index.html');
})

app.get("/vrapp", function(req, res){
  res.render('vrapp');
})

app.get("/home", function(req, res){
  res.render('home');
})

app.get("/shop", function(req, res){
  res.render('shop');
})

app.get("/contact", function(req, res){
  res.render('contact');
})

app.get("/works", function(req, res){
  res.render('works');
})

app.get("/arapp", function(req, res){
  res.render('arapp');
})



app.get("/ethapp", function(req, res){
  res.render('ethapp');
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is connected at port 3000");
})
