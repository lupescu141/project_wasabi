import cron from "node-cron";
import { migrate_today_data } from "./database.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Cron running migration...");
  await migrate_today_data();
});
