const mongoose = require("mongoose");

const userInfo = new mongoose.Schema({
  nickname: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  githubId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
});

module.exports = mongoose.model("UserInfo", userInfo);
