import { test, expect } from "@playwright/test";

import { get_userdata, get_test_menu } from "../src/database.js";

// Nav test
test.describe("Navigation test", () => {
  test("Navigation functioning corrrectly", async ({ page }) => {
    await page.goto("http://localhost:3000/home");
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Menu"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/menu"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Contact"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/contact"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=About"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/about"); // Check if correct page
    await page.click(".fa-solid"); // Open navlinks in mobile
    await page.click("text=Home"); // Click navlink
    await expect(page).toHaveURL("http://localhost:3000/home"); // Check if correct page
  });
});

//Visual comparison tests
test("Visual comparison of home page in desktop", async ({ page }) => {
  await page.goto("http://localhost:3000/home");
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot("home.png");
});

test("Visual comparison of home page in mobile", async ({ page }) => {
  await page.goto("http://localhost:3000/home");
  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot("mobilehome.png");
});

// Form test (add product)
test("Form submission saves data to database", async ({ page }) => {
  await page.goto("http://localhost:3000/admin/login");
  await page.fill("#email", "admin@wasabi.fi");
  await page.fill("#password", "Itjustworks1");
  await page.click("text=Login");
  await expect(page).toHaveURL("http://localhost:3000/management"); // Check if correct page
  await page.click("#openAddProductModal");
  await page.fill("#productName", "playwright");
  await page.fill("#productDescription", "playwright");
  await page.fill("#productAllergens", "playwright");
  await page.selectOption("#buffetOrMenu", "Menu");
  await page.selectOption("#menuCategory", "maincourse");
  await page.fill("#menuPrice", "1");

  // Verify data in the database
  const [rows] = await get_test_menu("playwright"); // Query the database for the submitted email
  expect(rows[0].product_name).toBe("playwright");
  expect(rows[0].product_description).toBe("playwright");
  expect(rows[0].product_allergens).toBe("playwright");
  expect(rows[0].categorie).toBe("maincourse");
  expect(rows[0].price_text).toBe("1€");
});

// Login test
test.describe("Login test", () => {
  test("User can login", async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto("http://localhost:3000/home");
      await page.click("#login_icon"); // Click login icon
      await page.click("#login_register_option"); // Open login modal
      await page.fill("#loginemail", "test@hotmail.fi");
      await page.fill("#loginpassword", "Playwright1");
      await page.click("#login_button"); // Login
      await expect(page).toHaveURL("http://localhost:3000/home"); // Check if correct page
    } else {
    }
  });
});

// Authentication test
test.describe("Authentication test", () => {
  let page;
  // Login
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000/home");
    await page.click("#login_icon");
    await page.click("#login_register_option");
    await page.fill("#loginemail", "test@hotmail.fi");
    await page.fill("#loginpassword", "Playwright1");
    await page.click("#login_button");
  });
  // Test if user can access protected content
  test("User can view protected content after login", async () => {
    // Try to access protected content
    await page.goto("http://localhost:3000/home");
    await page.click("#login_icon"); // Click login icon
    await page.click("#profile_option"); // Click on the profile option
    await expect(page).toHaveURL("http://localhost:3000/profile"); // Verify correct URL
  });
});
