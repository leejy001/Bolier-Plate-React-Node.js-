const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const UserInfo = require("./UserInfo.js");
const LocalStrategy = passportLocal.Strategy;

dotenv.config();

mongoose.connect(
  `${process.env.MONGO_URI}`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected To Mongo");
  }
);

// MiddleWare
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "passwd",
    },
    (username, password, done) => {
      UserInfo.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  UserInfo.findOne({ _id: id }, (err, user) => {
    const userInformation = {
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

// Routes
app.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Improper values");
    return;
  }

  UserInfo.findOne({ username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserInfo({
        nickname: username,
        username: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("success");
      console.log("success");
    }
  });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("success");
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

app.listen(4000, () => {
  console.log("Server Started");
});
