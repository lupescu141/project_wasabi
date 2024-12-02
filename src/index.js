import {
  pool,
  get_all_from_table,
  get_row_from_table,
  get_buffet_weekday,
  get_userdata,
} from "./database.js";
import dotenv from "dotenv";
dotenv.config();

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
//universally unique identifiers
import { v4 as uuidv4 } from "uuid";
//cookie perser
import cookieParser from "cookie-parser";
app.use(cookieParser(process.env.SECRET));
//body parser
import bodyParser from "body-parser";
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// Session

import session from "express-session";
import expressMySqlSession from "express-mysql-session";
const MySQLStore = expressMySqlSession(session);

const sessionStore = new MySQLStore(
  {
    expiration: 60000,
    createDatabaseTable: true,
    schema: {
      tableName: "session",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  pool
);

app.use(
  session({
    key: "keyin",
    secret: "my sercret",
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
  })
);

//Port for page.
const port = process.env.PORT || 3000;
const router = express.Router();

//Media files for express app in /puclic folder.
app.use(express.static(__dirname + "/public"));

//Getting public html files.
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

app.get("/profile", async (req, res) => {
  if (req.session.userinfo) {
    res.sendFile(path.join(__dirname, `/public/editprofile.html`));
  } else {
    return res.status(401).send("Invalid session");
  }
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

app.use("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send("logout");
    }
  });
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  const db_user = await get_userdata(email);

  //Verify email
  try {
    if (db_user[0][0]?.email !== email) {
      return res
        .status(400)
        .json({ message: "User with email does not exist!" });
    }
    // Verify login
    if ((await bcrypt.compare(password, db_user[0][0].password)) == false) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    //const sessionid = uuidv4();
    const user_id = db_user[0][0].id;
    req.session.userinfo = user_id;
    //sessions[sessionid] = { email, user_id };
    //res.set("Set-Cookie", `session=${sessionid}`);
    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/weekly_buffet", async (req, res) => {
  const { type, weekday } = req.query;

  try {
    const [rows] = await get_buffet_item(type, weekday);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});
