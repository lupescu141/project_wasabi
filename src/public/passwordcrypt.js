const bcrypt = require("bcryptjs");

// Function to crypt a password
async function cryptPassword(Password) {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const cryptedPassword = await bcrypt.hash(Password, salt); // Crypt the password
    return cryptedPassword;
  } catch (error) {
    console.error("Error crypting password:", error);
    throw error;
  }
}

//Example usage
cryptPassword("Password123")
  .then((cryptedPassword) => {
    console.log("Crypted Password: ", cryptedPassword);
  })
  .catch((error) => {
    console.error(error);
  });

// TEST IF PASSWORD HAS BEEN CYPTED CORRECTLY:
async function verifyPassword(Password, cryptedPassword) {
  try {
    const isMatch = await bcrypt.compare(Password, cryptedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

// Get storedCryptedPassword from database. Compare to user's password input in loginmodal
const storedCryptedPassword =
  "$2a$10$XK1GxFxjGriM1nOZZYjPNeM/NNmdH6iVxhqNGr06qI6CZuhTC7b3O";
verifyPassword("Password123", storedCryptedPassword)
  .then((isMatch) => {
    if (isMatch) {
      console.log("Password is correct!");
    } else {
      console.log("Password is incorrect.");
    }
  })
  .catch((error) => {
    console.error(error);
  });
