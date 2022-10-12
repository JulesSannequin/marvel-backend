const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username) {
      const user = await User.findOne({ email: email });
      if (user === null) {
        const token = uid2(64);
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);

        const newUser = new User({
          email: email,
          account: {
            username: username,
          },
          token: token,
          salt: salt,
          hash: hash,
        });

        await newUser.save();
        res.json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.status(409).json({ error: "Email already have an account" });
      }
    } else {
      res.status(400).json({ error: "Username is missing" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (newHash === user.hash) {
        res.json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
