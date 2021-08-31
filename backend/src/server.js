const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
let appDir = path.dirname(require.main.filename);
const UserInfo = require("./UserInfo.js");
const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;

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
  new LocalStrategy((username, password, done) => {
    UserInfo.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          console.log("success");
          return done(null, user);
        } else {
          console.log("fail");
          return done(null, false);
        }
      });
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: "/auth/google/callback",
    },
    function (acessTocken, refreshTocken, profile, cb) {
      UserInfo.findOne({ googleId: profile.id }, async (err, doc) => {
        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new UserInfo({
            googleId: profile.id,
            username: profile.id,
            nickname: profile.name.givenName,
          });

          await newUser.save();
          cb(null, newUser);
        }

        if (doc) {
          cb(null, doc);
        }
      });
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
      callbackURL: "/auth/github/callback",
    },
    function (acessTocken, refreshTocken, profile, cb) {
      UserInfo.findOne({ githubId: profile.id }, async (err, doc) => {
        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new UserInfo({
            githubId: profile.id,
            username: profile.id,
            nickname: profile.username,
          });

          await newUser.save();
          cb(null, newUser);
        }

        if (doc) {
          cb(null, doc);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log("deserialize");
  UserInfo.findById(id, (err, doc) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(null, doc);
  });
  /*
  UserInfo.findOne({ _id: id }, (err, user) => {
    const userInformation = {
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    console.log(userInformation);
    cb(err, userInformation);
  });*/
});

// Routes
app.post("/checkname", async (req, res) => {
  const { nickname } = req.body;
  UserInfo.findOne({ nickname }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("fail");
    if (!doc) res.send("success");
  });
});

app.post("/sendemail", async (req, res) => {
  let authNum = Math.random().toString().substr(2, 6);
  let emailTemplete;
  ejs.renderFile(
    appDir + "/template/authMail.ejs",
    { authCode: authNum },
    function (err, data) {
      if (err) {
        console.log(err);
      }
      emailTemplete = data;
    }
  );

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    host: "smtp.gmail.com",
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let mailOptions = new Object({
    from: "헬로",
    to: req.body.email,
    subject: "회원가입을 위한 인증번호입니다.",
    html: emailTemplete,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    console.log("Finish sending email : " + info.response);
    res.send(authNum);
    transporter.close();
  });
});

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

  UserInfo.findOne({ username: email }, async (err, doc) => {
    console.log(email);
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      console.log("go");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserInfo({
        nickname: username,
        username: email,
        password: hashedPassword,
      });
      console.log(newUser);
      await newUser.save();
      res.send("success");
      console.log("success");
    }
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

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
