// Initialize variables
let currentIndex = 0;
const menuDays = document.querySelectorAll(".menu-day");
const totalDays = menuDays.length;

// Function to show the menu for the current index
function showMenu(index) {
  // Hide all menus first
  menuDays.forEach((menu, i) => {
    menu.classList.remove("active"); // Remove active class from all
    menu.style.display = "none"; // Hide all menus
  });

  // Show the current menu and set it active
  menuDays[index].classList.add("active"); // Add active class to the current menu
  menuDays[index].style.display = "block"; // Display the current menu
}

// Function to handle button clicks
function changeMenu(direction) {
  // Update the index based on the direction
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % totalDays; // Loop back to the start
  } else {
    currentIndex = (currentIndex - 1 + totalDays) % totalDays; // Loop to the end
  }
  showMenu(currentIndex); // Show the updated menu
}

// Set up button event listeners
document
  .getElementById("prev-button")
  .addEventListener("click", () => changeMenu("prev"));
document
  .getElementById("next-button")
  .addEventListener("click", () => changeMenu("next"));

// Show the first menu on page load
showMenu(currentIndex);
