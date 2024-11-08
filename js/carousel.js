// Store IDs of menu items for easy access
const menuOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
let activeIndex = 0; // Track the active menu day index

// Show the initial active menu
document.getElementById(menuOrder[activeIndex]).classList.add("visible");

function updateMenuDisplay(direction) {
  const currentMenu = document.getElementById(menuOrder[activeIndex]);
  let nextIndex;

  if (direction === "next") {
    nextIndex = (activeIndex + 1) % menuOrder.length;
    currentMenu.classList.add("slide-out-left");

    // Set up the new menu to slide in from the right, and hide it initially
    const nextMenu = document.getElementById(menuOrder[nextIndex]);
    nextMenu.classList.add("slide-in-right");
    nextMenu.classList.remove("visible"); // Hide it first

    // Trigger reflow for transition setup
    void nextMenu.offsetWidth;

    // Make visible to start slide-in animation
    nextMenu.classList.add("visible");
  } else {
    nextIndex = (activeIndex - 1 + menuOrder.length) % menuOrder.length;
    currentMenu.classList.add("slide-out-right");

    // Set up the new menu to slide in from the left, and hide it initially
    const nextMenu = document.getElementById(menuOrder[nextIndex]);
    nextMenu.classList.add("slide-in-left");
    nextMenu.classList.remove("visible"); // Hide it first

    // Trigger reflow for transition setup
    void nextMenu.offsetWidth;

    // Make visible to start slide-in animation
    nextMenu.classList.add("visible");
  }

  // Remove transition classes after the animation completes
  currentMenu.addEventListener("transitionend", function handleTransitionEnd() {
    currentMenu.classList.remove(
      "visible",
      "slide-out-left",
      "slide-out-right"
    );
    nextMenu.classList.remove("slide-in-left", "slide-in-right");
    currentMenu.removeEventListener("transitionend", handleTransitionEnd);
  });

  // Update activeIndex to the new menu
  activeIndex = nextIndex;
}

// Button event listeners
document
  .getElementById("next-button")
  .addEventListener("click", () => updateMenuDisplay("next"));
document
  .getElementById("prev-button")
  .addEventListener("click", () => updateMenuDisplay("prev"));
