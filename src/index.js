const express = require("express");
const app = express();
const { dirname } = require("path");
const path = require("path");

//Port for page.
const port = process.env.PORT || 3000;
const router = express.Router();

//File locations.
app.use(express.static(__dirname + "/public"));

//Getting html files.
app.get("/home", function (req, res) {
  res.render(path.join(__dirname, "/index.html"));
});

app.get("/menu", function (req, res) {
  res.render(__dirname + "/menu.html");
});

app.get("/contact", function (req, res) {
  res.render(__dirname + "/contact.html");
});

app.get("/editprofile", function (req, res) {
  res.render(__dirname + "/editprofile.html");
});

app.get("/ordermanagement", function (req, res) {
  res.render(__dirname + "/ordermanagement.html");
});

app.get("/employeecontacts", function (req, res) {
  res.render(__dirname + "/employeecontacts.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
