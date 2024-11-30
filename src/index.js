import {
  pool,
  get_all_from_table,
  get_row_from_table,
  get_buffet_weekday,
  get_userdata,
} from "./database.js";

import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  app.get(element.path, (req, res) => {
    res.sendFile(path.join(__dirname, `/public${element.file}`));
  });
});

app.get("/user", async (req, res) => {
  const query = req.query;
  const result = await get_userdata(query.email);
  console.log(result);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
