const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
var crypto = require("crypto");
ids = crypto.randomBytes(16).toString('hex');;
idss = crypto.randomBytes(20).toString('hex');;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
const stripe = require('stripe')('sk_test_51JtyaLG9HYj0Jnl6ws0mAi5WXj2f3pnEc5BpKkoKPr8lvQt474kaZSxkwBbcq5yg768vwZtpL02k1sdFiqGCtly500DMNvw32a')
const loadAsh = require("lodash");
const mongoose = require('mongoose');
const session = require('express-session');
const fetch = require("isomorphic-fetch");
const bcrypt = require('bcrypt');
const date = require(__dirname + "/date.js");



app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://root:root@cluster0.vqs2d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const isAuth = (req, res, next) => {
  if(req.session.isAuth){
    next()
  }else{
    res.redirect('/login');
  }
}

app.use(session({
  secret: 'work hard play hard',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1*60*60*1000
  }
}));

const userSchema = {

  unique_id: Number,
  email: String,
  username: String,
  password: String,
  passwordConf: String,
  active: Boolean,

}

const sendEmail = (email, uniqueString) => {
  var Transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "ravinthiran@ofoundation.nl",
      pass: "Nodedoodle@doodle1407"
    },
    from: 'ravinthiran@ofoundation.nl'
  });

  var mailOptions;
  let sender = "your_name";
  mailOptions = {
    from: sender,
    to: email,
    subject: "Account Confirmation ravinthiranpartheepan trello clone",
    html: "<p>Dear " + email + " </p><p>Thank you for creating your trello clone account in ravinthiranpartheepan.com!</p><div>Kind regards,</div><p>Ravinthiran Partheepan</p>"
  };

  Transport.sendMail(mailOptions, function(error, response) {
    // err ? res.json(res.status(400).json("Error " + err)) : res.json("Email sent.");
    if (error) {
      console.log(error);
    } else {
      console.log("message sent")
    }
  });

}


const itemsSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Todo list',
});
const item2 = new Item({
  name: 'Hit the + button to add a new item',
});
const item3 = new Item({
  name: '<-- Hit this to delete an item.',
});

const defaultItems = [item1, item2, item3];


const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);
var User = new mongoose.model("User", userSchema);

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
  res.sendFile(__dirname + '/public/login.html');
})

app.post("/login", function(req, res){
const resetIds = crypto.randomBytes(16).toString('base64');
  const username = req.body.emails;
  const password = req.body.passwords;

  User.findOne({
    email: req.body.emails
  }, function(err, user) {
    if (!user) {
      res.render('/register');
    }
    bcrypt.compare(password, user.password, (err, data) => {

      if (data) {
        // res.render('home', {
        //   id: resetIds
        // });
        Item.find({}, function(err, foundItems) {
          console.log(foundItems);

          if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('Successfully saved default items to DB');
              }
            });

            res.redirect('/list');
          } else {

            res.render('list', { listTitle: 'Today', newListItems: foundItems });
          }
        });
      
      } else {
        res.sendFile(__dirname + '/public/login.html');
      }

    });
  });
  req.session.isAuth = true;
});

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


app.get("/register", function(req, res){
  res.render('register');
})


app.post("/register", function(req, res){

  const response_key = req.body["g-recaptcha-response"];

  const secret_key = "6LfYPCQdAAAAAGLjaxbouApalsiTKSB98CLV5O2j";


  const url =
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;


  fetch(url, {
      method: "post",
    })
    .then((response) => response.json())
    .then((google_response) => {


      if (google_response.success == true) {

         res.sendFile(__dirname + '/public/login.html');
      } else {


           res.sendFile(__dirname + '/public/login.html');

      }
    })
    .catch((error) => {

      return res.json({
        error
      });
    });

    User.findOne({
      $or: [{
        email: req.body.email
      }]
    }).then(user => {
      if (user) {
        let errors = {};
        if (user.email === req.body.email) {
          errors.email = "Email already exists";
        } else {
          errors.email = "Email already exists";
        }
        return res.status(400).json(errors);
      } else {
        const newUser = new User({

          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(res.render('/login'))
              .catch(err => console.log(err));
          });
        });
        sendEmail(newUser.email)
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });

  });



app.get("/downloadRosie/:ids", function(req, res){
    res.download(__dirname + "/public/assets/uploads/Rosie.pdf");
});



app.get('/list', (req, res) => {

  Item.find({}, function(err, foundItems) {
    console.log(foundItems);

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully saved default items to DB');
        }
      });

      res.redirect('/list');
    } else {

      res.render('list', { listTitle: 'Today', newListItems: foundItems });
    }
  });
});


app.post('/list', (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;



  const item = new Item({
    name: itemName,
  });
  if (listName === 'Today') {
    item.save();
    res.redirect('/list');
  } else {
    //customlist
    List.findOne({ name: listName }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/list' + listName);
    });
  }
});


app.post('/delete', function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log('Successfully deleted checked item.');
        res.redirect('/list');
      }
    });
  } else {

    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function(err, foundList) {
        if (!err) {
          res.redirect('/list' + listName);
        }
      }
    );
  }
});


app.get('/list/:customListName', function(req, res) {
  const customListName = loadAsh.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function(err, foundList) {
    if (!err) {
      if (!foundList) {

        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect('/list' + customListName);
      } else {

        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post('/work', (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});




app.listen(process.env.PORT || 3000, function(){
  console.log("Server is connected at port 3000");
})
