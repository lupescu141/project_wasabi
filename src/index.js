import {
  pool,
  get_all_from_table,
  get_row_from_table,
  get_buffet_weekday,
  get_userdata,
} from "./database.js";

import express from "express";
const app = express();
//folder pathing settings
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//crypting
import bcrypt from "bcryptjs";
import { cryptPassword } from "./crypting.js";
//body parser
import bodyParser from "body-parser";
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

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
  { path: "/register", file: "/registerprofile.html" },
];

pagelist.forEach((element) => {
  app.get(element.path, (req, res) => {
    res.sendFile(path.join(__dirname, `/public${element.file}`));
  });
});

app.get("api/get/user", async (req, res) => {
  const query = req.query;
  const result = await get_userdata(query.email);
  console.log(result);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Registration
app.post("/api/users/register", async (req, res) => {
  const { name, surname, email, phone, password, confirmPassword } = req.body;
  const db_user = await get_userdata(email);

  try {
    if (email == db_user[0][0].email) {
      return res
        .status(400)
        .json({ message: "User already exists with current email!" });
    }
  } catch (err) {}

  try {
    const cryptedPassword = await cryptPassword(password);

    await pool.query(
      `INSERT INTO wasabi.users (email, name, surname, password, phonenumber) VALUES ('${email}', '${name}', '${surname}', '${cryptedPassword}', '${phone}')`
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify login
    const user = pool.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
