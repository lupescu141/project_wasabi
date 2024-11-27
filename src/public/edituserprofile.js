document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const form = document.getElementById("profile-form");

  // Fetch user data and populate fields
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      nameInput.value = data.name;
      surnameInput.value = data.surname;
      emailInput.value = data.email;
      phoneInput.value = data.phone;
      passwordInput.value = data.password;
      confirmPasswordInput.value = data.password;
    })
    .catch((error) => console.error("Error fetching user data:", error));

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("Passwords do not match!");
      return;
    }

    const updatedUser = {
      name: nameInput.value,
      surname: surnameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      password: passwordInput.value,
    };

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Profile updated successfully!");
        window.location.href = "index.html"; // Redirect to index.html
        console.log(data);
      })
      .catch((error) => console.error("Error updating user data:", error));
  });
});
