// Set the initial index of the menu day
let currentIndex = 0;

// Get all the menu day elements, navigation buttons, and carousel wrapper
const days = document.querySelectorAll(".menu-day");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const carouselWrapper = document.querySelector(".carousel-wrapper");

// Function to get today's date in Finnish timezone
function getLocalDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" })
  );
}

// Function to get a formatted date string (e.g., "Friday, December 6, 2024")
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Helsinki",
  });
}

// Function to update the menu day headers with the correct dates
function updateMenuDates() {
  const today = getLocalDate();

  days.forEach((dayElement, index) => {
    const menuDate = new Date(today);
    menuDate.setDate(today.getDate() + index);

    const formattedDate = formatDate(menuDate);

    const h2 = dayElement.querySelector("h2");
    // Directly replace the content of h2 with the formatted date
    h2.textContent = formattedDate;
  });
}

function moveFirstOptionToLast() {
  const firstOption = carouselWrapper.firstElementChild;

  const newDate = getLocalDate();
  newDate.setDate(newDate.getDate() + 7);

  const dayName = firstOption.querySelector("h2").textContent.split(" ")[0];

  const formattedDate = formatDate(newDate);

  firstOption.querySelector("h2").textContent = `${dayName} ${formattedDate}`;

  carouselWrapper.appendChild(firstOption);
}

function setupMidnightUpdate() {
  const now = getLocalDate();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const timeUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    moveFirstOptionToLast();
    setupMidnightUpdate();
  }, timeUntilMidnight);
}

function changeDay(newIndex) {
  days[currentIndex].classList.remove("active");

  currentIndex = newIndex;

  if (currentIndex < 0) currentIndex = days.length - 1;
  if (currentIndex >= days.length) currentIndex = 0;

  days[currentIndex].classList.add("active");
  carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevButton.addEventListener("click", () => changeDay(currentIndex - 1));
nextButton.addEventListener("click", () => changeDay(currentIndex + 1));

days[currentIndex].classList.add("active");
carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

updateMenuDates();
setupMidnightUpdate();
