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

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is connected at port 3000");
})
