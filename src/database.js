import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const get_all_from_table = async (table_name) => {
  try {
    const result = await pool.query(`SELECT * FROM wasabi.${table_name}`);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_row_from_table = async (table_name, colum_name, criteria) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.${table_name} WHERE ${colum_name} = '${criteria}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_userdata = async (user_email) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.users WHERE email = '${user_email}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return "service offline";
  }
};

const get_buffet_weekday = async (weekday) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.weekly_buffet WHERE weekday = '${weekday}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export {
  pool,
  get_all_from_table,
  get_row_from_table,
  get_buffet_weekday,
  get_userdata,
};
