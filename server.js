const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
var crypto = require("crypto");
ids = crypto.randomBytes(16).toString('hex');;
idss = crypto.randomBytes(20).toString('hex');;
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

app.get("/login", function(req, res){
  res.render('login');
})


app.post('/contact', function(req, res) {
  const link = "https://ravinthiranpartheepan.com/ethapp?id=" +ids
  const vrapp = "https://ravinthiranpartheepan.com/vrapp?id=" +idss
  const name = req.body.name;
  const email = req.body.emails;
  const subject = req.body.subject;
  const messsage = req.body.message;
  let transporters = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: 'ravinthiran@ofoundation.nl',
      pass: 'Nodedoodle@doodle1407'
    }
  });
  let mailOptions = {
    from: '"Ravinthiran Partheepan" <ravinthiran1407@gmail.com>',
    to: email,
    subject: "Thank you for contacting me - Ravinthiran Partheepan",
    html: "<p>Dear " + name + " </p><p>Thank you again for contacting me! I will respond to you message as soon as possible. In the mean time checkout my ethereum shop:"+ link +" </p><p> Oh! I have a gift for you. Here's my VR App session for you "+ vrapp +"</p>"


  };

  transporters.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message  sent: ', info.messageId, info.response);
    res.redirect('/home');
  });
  console.log(email)
});


app.get("/ethapp", function(req, res){
  res.render('ethapp');
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is connected at port 3000");
})
