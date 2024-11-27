const express = require("express");
const app = express();
const { dirname } = require("path");
const path = require("path");

//Port for page.
const port = process.env.PORT || 3000;
const router = express.Router();

//Media files for express app in /puclic folder.
app.use(express.static(__dirname + "/public"));

//Getting html files.
const pagelist = [
  { path: "/home", file: "/index.html" },
  { path: "/menu", file: "/menu.html" },
  { path: "/contact", file: "/contact.html" },
  { path: "/editprofile", file: "/editprofile.html" },
  { path: "/ordermanagement", file: "/ordermanagement.html" },
  { path: "/employeecontacts", file: "/employeecontacts.html" },
  { path: "/about", file: "/about.html" },
];

pagelist.forEach((element) => {
  app.get(element.path, function (req, res) {
    res.sendFile(path.join(__dirname, `/public${element.file}`));
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
