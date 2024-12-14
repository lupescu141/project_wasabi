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

const get_row_from_table = async (table_name, column_name, criteria) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.${table_name} WHERE ${column_name} = '${criteria}'`
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

const get_buffet_item = async (type, weekday) => {
  try {
    const result = await pool.query(
      `SELECT product_name, weekday, product_description, type, product_allergens FROM wasabi.weekly_buffet WHERE type = '${type}' AND weekday = '${weekday}' `
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_buffet_item_next_week = async (weekday) => {
  try {
    const result = await pool.query(
      `SELECT product_name, weekday, product_description, type, product_allergens FROM wasabi.weekly_buffet_next_week WHERE weekday = '${weekday}' `
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_buffet_nextweek = async (weekday) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.weekly_buffet_next_week`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_menu = async (categorie) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.products WHERE categorie = '${categorie}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_admindata = async (email) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.workers WHERE email = '${email}'`
    );
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return "service offline";
  }
};

const get_database_session = async (keyin) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wasabi.session WHERE session_id = '${keyin}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const delete_from_weeklybuffet = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM wasabi.weekly_buffet_next_week WHERE id = '${id}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const delete_from_products = async (id) => {
  try {
    const result = await pool.query(
      `DELETE FROM wasabi.products WHERE id = '${id}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const get_profile_information = async (id) => {
  try {
    const result = await pool.query(
      `SELECT name, surname, phonenumber FROM wasabi.users WHERE id = '${id}'`
    );
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const migrate_today_data = async () => {
  try {
    // Get today's weekday
    const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    console.log(`Today's weekday is: ${today}`);

    // Step 1: Delete today's data from weekly_buffet
    await pool.query(
      `DELETE FROM wasabi.weekly_buffet WHERE weekday = '${today}'`
    );
    console.log("Deleted existing data for today from weekly_buffet.");

    // Step 2: Migrate today's data from weekly_buffet_next to weekly_buffet
    const [rows] = await get_buffet_item_next_week(today);

    if (rows.length > 0) {
      for (const item of rows) {
        const {
          weekday,
          product_name,
          product_description,
          type,
          product_allergens,
        } = item;

        await pool.query(
          `INSERT INTO wasabi.weekly_buffet (weekday, type, product_name, product_description, product_allergens)
             VALUES ('${weekday}', '${type}', '${product_name}', '${product_description}', '${product_allergens}')`
        );
      }
      console.log("Migration completed successfully.");
    }
  } catch (err) {
    console.error("Migration Error:", err);
  }
};

export {
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
  delete_from_products,
};
