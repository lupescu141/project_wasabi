// Crypt password function
async function cryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// pool = DATABASE

// Registration
app.post("/api/users/register", async (req, res) => {
  const { name, surname, email, phone, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const cryptedPassword = await cryptPassword(password);
    pool.push({
      name,
      surname,
      email,
      phone,
      password: cryptedPassword,
    });

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
