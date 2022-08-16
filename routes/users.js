const express = require("express");
const router = express.router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    if (req.body.username === undefined) {
      res.status(400).json({ message: "il te manque des paramètres" });
    } else {
      const isEmailAlreadyinDb = await User.findOne({ email: req.body.email });

      if (isEmailAlreadyinDb !== null) {
        res.json({ message: "ton email a deja un compte" });
      } else {
        const salt = uid2(16);
        const hash = SHA256(req.body.password + salt).toString(encBase64);
        const token = uid2(32);
        console.log("salt===>", salt);
        console.log("hash===>", hash);
        const newUser = new User({
          email: req.body.email,
          account: {
            username: req.body.username,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        res.json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const userToCheck = await User.FindOne({ email: req.body.email });
    if (userToCheck === null) {
      res.status(401).json({ message: "pas autorisé" });
    } else {
      const newHash = SHA256(req.body.password + userToCheck.salt).toString(
        encBase64
      );
      console.log("newHash ==>", newhash);
      console.log("Hash présent en bdd ==>", userToCheck.hash);

      if (newHash === userToCheck.hash) {
        res.json({
          _id: userToCheck._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
