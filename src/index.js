const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

mongoose.connect(process.env.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userSchema);

app.listen(3000, () => {
  console.log("Server started on Port 3000");
});

app.route("/").get((req, res) => {
  res.render("home");
});
app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(err => {
        if (err) {
          console.log(`err code : ${err}`);
        } else {
          res.render("secrets");
        }
      });
    });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    let login_email = req.body.username;
    let login_password = req.body.password;

    User.findOne({ email: login_email }, (err, found) => {
      if (err) {
        console.log(`err code : ${err}`);
      } else {
        bcrypt.compare(login_password, found.password, function(err, result) {
          if (result === true) {
            console.log("login success");
            res.render("secrets");
          } else {
            console.log("Wrong login info please try again");
            res.redirect("login");
          }
        });
      }
    });
  });
app.route("/secrets").get((req, res) => {
  res.render("secrets");
});
