import {
  pool,
  get_all_from_table,
  get_row_from_table,
  get_buffet_weekday,
  get_userdata,
  get_buffet_item,
  get_buffet_item_next_week,
  get_menu,
  get_admindata,
  get_database_session,
  get_buffet_nextweek,
  delete_from_weeklybuffet,
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
// Multer (For file uploads)
import multer from "multer";
//crypting
import bcrypt from "bcryptjs";
import { cryptPassword } from "./crypting.js";
//universally unique identifiers
//import { v4 as uuidv4 } from "uuid";
//cookie parser
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
    secret: process.env.SECRET,
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
  { path: "/admin/login", file: "/adminlogin.html" },
];

pagelist.forEach((element) => {
  app.get(element.path, (req, res) => {
    res.sendFile(path.join(__dirname, `/public${element.file}`));
  });
});

app.get("/profile", async (req, res) => {
  const [[db_session]] = await get_database_session(req.signedCookies["keyin"]);
  //console.log(db_session.session_id);
  //console.log(JSON.parse(db_session.data).userinfo);
  //console.log("id:", req.session.userinfo);
  //console.log(req.signedCookies["keyin"]);
  //console.log(req?.session.userinfo.user_id);

  if (
    req?.signedCookies["keyin"] == db_session?.session_id &&
    req?.session.userinfo.user_id ==
      JSON.parse(db_session?.data)?.userinfo.user_id
  ) {
    res.sendFile(path.join(__dirname, `/public/editprofile.html`));
  } else {
    return res.status(401).send("Invalid session");
  }
});

app.get("/management", async (req, res) => {
  const [[db_session]] = await get_database_session(req.signedCookies["keyin"]);
  const admindata = await get_admindata(req?.session?.userinfo?.user_email);
  //console.log(db_session.session_id);
  //console.log(JSON.parse(db_session.data).userinfo);
  //console.log("id:", req.session.userinfo);
  //console.log(req.signedCookies["keyin"]);
  //console.log(req?.session.userinfo.user_id);

  if (
    req?.signedCookies["keyin"] == db_session?.session_id &&
    req?.session?.userinfo?.user_id ==
      JSON.parse(db_session?.data)?.userinfo.user_id &&
    admindata[0][0]?.email == req?.session.userinfo.user_email
  ) {
    res.sendFile(path.join(__dirname, `/public/management.html`));
  } else {
    return res.status(401).send("Invalid session");
  }
});

app.get("api/get/user", async (req, res) => {
  const query = req.query;
  const result = await get_userdata(query.email);
  //console.log(result);
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
    req.session.userinfo = {
      user_id: db_user[0][0].id,
      user_email: db_user[0][0].email,
    };
    //sessions[sessionid] = { email, user_id };
    //res.set("Set-Cookie", `session=${sessionid}`);
    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/weekly_buffet", async (req, res) => {
  const { type, weekday } = req.query;
  //console.log(type, weekday);
  try {
    const [rows] = await get_buffet_item(type, weekday);
    //console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

app.post("/api/weekly_buffet_next", async (req, res) => {
  const { type, weekday } = req.query;
  //console.log(type, weekday);
  try {
    const [rows] = await get_buffet_item_next_week(type, weekday);
    //console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

app.post("/api/weekly_buffet_nextweek", async (req, res) => {
  //console.log(type, weekday);
  try {
    const [rows] = await get_buffet_nextweek();
    //console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

app.post("/api/menu", async (req, res) => {
  const { categorie } = req.query;
  //console.log(type, weekday);
  try {
    const [rows] = await get_menu(categorie);
    //console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const db_user = await get_admindata(email);

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
    //const user_id = db_user[0][0].id;
    req.session.userinfo = {
      user_id: db_user[0][0].id,
      user_email: db_user[0][0].email,
    };
    //sessions[sessionid] = { email, user_id };
    //res.set("Set-Cookie", `session=${sessionid}`);
    return res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/delete_weeklybuffet_next", async (req, res) => {
  const { id } = req.query;
  //console.log(id);
  try {
    const result = await delete_from_weeklybuffet(id);
    //console.log(result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

app.post("/api/delete_from_products", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const result = await delete_from_products(id);
    console.log(result);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products items." });
  }
});

app.post("/api/products", async (req, res) => {
  //console.log(type, weekday);
  try {
    const [rows] = await get_all_from_table(products);
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch buffet items." });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public")); // Ensure directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original file name
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

app.post("/api/addproduct", upload.single("menuImage"), async (req, res) => {
  const {
    productName,
    productDescription,
    productAllergens,
    buffetOrMenu,
    buffetType,
    menuCategory,
    menuPrice,
  } = req.body;

  let fileName = null;
  if (req.file) {
    fileName = req.file.originalname; // Save the original file name
  }

  try {
    //console.log(buffetOrMenu);
    //console.log(menuCategory);
    if (buffetOrMenu == "Buffet") {
      //console.log("buffet triggered");
      await pool.query(
        `INSERT INTO wasabi.products (product_name, product_description, product_allergens, type, categorie) VALUES ('${productName}', '${productDescription}', '${productAllergens}', '${buffetType}', 'buffet')`
      );
    } else if (buffetOrMenu == "Menu") {
      //console.log("menu triggered");
      await pool.query(
        `INSERT INTO wasabi.products (product_name, product_description, product_allergens, categorie, price, image_src) VALUES ('${productName}', '${productDescription}', '${productAllergens}', '${menuCategory}', '${menuPrice}', '${fileName}')`
      );
    }

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
});

app.get("/api/getbuffetproducts", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM wasabi.products WHERE categorie = 'buffet'"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

app.post("/api/addbuffetproduct", async (req, res) => {
  const { productName, productDescription, productAllergens, type, weekday } =
    req.body;

  try {
    /*console.log(
      productName,
      productDescription,
      productAllergens,
      type,
      weekday
    );*/
    await pool.query(
      `INSERT INTO wasabi.weekly_buffet_next_week (product_name, product_description, product_allergens, type, weekday) VALUES ('${productName}', '${productDescription}', '${productAllergens}', '${type}', '${weekday}')`
    );
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
});
