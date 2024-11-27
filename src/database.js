import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Mahry4!11?",
    database: "wasabi",
  })
  .promise();

const result = await pool.query("SELECT * FROM wasabi.weekly_buffet");
console.log(result);
