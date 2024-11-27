// Dropdown menu display
document.getElementById("login_icon").addEventListener("click", function () {
  console.log("Login icon clicked!"); // Add this log to see if the event is triggered
  const dropdown = document.getElementById("dropdown_menu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

// Show the login modal when clicking 'Login/Register'
document
  .getElementById("login_register_option")
  .addEventListener("click", function () {
    document.getElementById("login_modal").style.display = "block";
  });

// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target === document.getElementById("login_modal")) {
    document.getElementById("login_modal").style.display = "none";
  }
};

// Handle login logic
document.getElementById("login_button").addEventListener("click", function () {
  const email = document.getElementById("loginemail").value;
  const password = document.getElementById("loginpassword").value;

  // Send request to check if user exists (backend call)
  fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Redirect or update UI to show user is logged in
        window.location.href = "/profile"; // Replace with actual redirect
      } else {
        // Show error message
        document.getElementById("error_message").style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
    });
});
