require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const API_KEY = process.env.API_KEY;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/comics", (req, res) => {
  axios
    .get("https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=" + API_KEY)
    .then((response) => {
      let validData = response.data;
      res.json({ validData });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.get("/characters", (req, res) => {
  axios
    .get(
      "https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=" + API_KEY
    )
    .then((response) => {
      let validData = response.data;
      res.json({ validData });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.all("*", function (req, res) {
  res.json({ message: "Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("server has started");
});
