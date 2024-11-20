// Set the initial index of the menu day
let currentIndex = 0;

// Get all the menu day elements, navigation buttons, and carousel wrapper
const days = document.querySelectorAll(".menu-day");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const carouselWrapper = document.querySelector(".carousel-wrapper");

// Function to change the active menu day
function changeDay(newIndex) {
  // Remove the active class from the current day
  days[currentIndex].classList.remove("active");

  // Calculate the new index and wrap around if necessary
  currentIndex = newIndex;
  if (currentIndex < 0) currentIndex = days.length - 1; // If the new index is less than 0, go to the last day
  if (currentIndex >= days.length) currentIndex = 0; // If the new index is more than the last day, go to the first day

  // Add the active class to the new day
  days[currentIndex].classList.add("active");

  // Apply the sliding effect by moving the carousel wrapper
  carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Event listener for the previous button
prevButton.addEventListener("click", function () {
  changeDay(currentIndex - 1); // Go to the previous day
});

// Event listener for the next button
nextButton.addEventListener("click", function () {
  changeDay(currentIndex + 1); // Go to the next day
});

// Initialize the first day as active
days[currentIndex].classList.add("active");
carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`; // Position the carousel to show the first day

// Optionally, if you want to automatically rotate between days, you can use setInterval
// setInterval(function() {
//   changeDay(currentIndex + 1);
// }, 5000); // Change the menu every 5 seconds (for example)
