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
  { path: "/ordermanagement", file: "/ordermanagement" },
  { path: "/employeecontacts", file: "/employeecontacts" },
];

pagelist.forEach((element) => {
  app.get(element.path, function (req, res) {
    res.render(path.join(__dirname, element.file));
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
