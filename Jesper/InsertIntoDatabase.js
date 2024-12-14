// database.js
const migrate_today_data = async () => {
  try {
    // Get today's weekday
    const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    console.log(`Today's weekday is: ${today}`);

    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    console.log(weekdays[today]);

    // Step 1: Delete today's data from weekly_buffet
    await pool.query(
      `DELETE FROM wasabi.weekly_buffet WHERE weekday = '${day}'`
    );
    console.log("Deleted existing data for today from weekly_buffet.");

    // Step 2: Migrate today's data from weekly_buffet_next to weekly_buffet
    const [rows] = await get_buffet_item_next_week(day);

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

export { migrate_today_data };
