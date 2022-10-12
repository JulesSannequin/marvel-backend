require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const API_KEY = process.env.API_KEY;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost/exo-marvel");

const userRoutes = require("./routes/users");
app.use(userRoutes);

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

// app.get("/characters/:id", async (req, res) => {
//   try {
//     const response = await axios.get(
//       `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.id}?apiKey=${API_KEY}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.json(error.message);
//   }
// });

app.all("*", function (req, res) {
  res.json({ message: "Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("server has started");
});
