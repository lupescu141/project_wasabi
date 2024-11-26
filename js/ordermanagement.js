// Sample Orders Data
const orders = [
  { number: 1001, time: "2024-04-25 10:30", progress: "Waiting" },
  { number: 1002, time: "2024-04-25 11:15", progress: "In progress" },
  { number: 1003, time: "2024-04-25 12:45", progress: "Done" },
  { number: 1004, time: "2024-04-25 13:20", progress: "Waiting" },
  { number: 1005, time: "2024-04-25 14:05", progress: "In progress" },
  { number: 1006, time: "2024-04-25 15:30", progress: "Done" },
  // Add more orders as needed
];

// Function to create a progress status element
function createProgressStatus(status) {
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("progress-status");

  const circle = document.createElement("div");
  circle.classList.add("status-circle");

  // Assign color based on status
  if (status === "Waiting") {
    circle.classList.add("status-waiting");
  } else if (status === "In progress") {
    circle.classList.add("status-in-progress");
  } else if (status === "Done") {
    circle.classList.add("status-done");
  }

  const statusText = document.createElement("span");
  statusText.textContent = status;

  statusDiv.appendChild(circle);
  statusDiv.appendChild(statusText);

  return statusDiv;
}

// Function to render orders
function renderOrders(orderList) {
  const ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = ""; // Clear existing orders

  if (orderList.length === 0) {
    const noResult = document.createElement("div");
    noResult.classList.add("order-item");
    noResult.textContent = "No orders found.";
    ordersContainer.appendChild(noResult);
    return;
  }

  orderList.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-item");

    // Order Number
    const numberDiv = document.createElement("div");
    numberDiv.classList.add("column", "order-number");
    numberDiv.textContent = order.number;
    orderDiv.appendChild(numberDiv);

    // Order Time
    const timeDiv = document.createElement("div");
    timeDiv.classList.add("column", "order-time");
    timeDiv.textContent = order.time;
    orderDiv.appendChild(timeDiv);

    // Order Progress
    const progressDiv = document.createElement("div");
    progressDiv.classList.add("column", "order-progress");
    progressDiv.appendChild(createProgressStatus(order.progress));
    orderDiv.appendChild(progressDiv);

    ordersContainer.appendChild(orderDiv);
  });
}

// Function to sort orders by progress status
function sortOrdersByProgress() {
  const priority = {
    Waiting: 1, // Red (highest priority)
    "In progress": 2, // Yellow (medium priority)
    Done: 3, // Green (lowest priority)
  };

  orders.sort((a, b) => priority[a.progress] - priority[b.progress]);
  renderOrders(orders); // Re-render the sorted orders
}

// Initialize the page with sorting by progress
document.addEventListener("DOMContentLoaded", () => {
  sortOrdersByProgress(); // Sort orders on page load
  renderOrders(orders);

  // Add event listener to search bar
  document.getElementById("searchBar").addEventListener("input", handleSearch);
});

// Function to filter orders based on selected statuses
function filterOrders() {
  const showWaiting = document.getElementById("filterWaiting").checked;
  const showInProgress = document.getElementById("filterInProgress").checked;
  const showDone = document.getElementById("filterDone").checked;

  // If all are checked or none are checked, show all orders
  if (
    (showWaiting && showInProgress && showDone) ||
    (!showWaiting && !showInProgress && !showDone)
  ) {
    renderOrders(orders);
    return;
  }

  // Filter orders based on the selected statuses
  const filteredOrders = orders.filter((order) => {
    if (showWaiting && order.progress === "Waiting") return true;
    if (showInProgress && order.progress === "In progress") return true;
    if (showDone && order.progress === "Done") return true;
    return false;
  });

  renderOrders(filteredOrders);
}

// Add event listeners to filter checkboxes
document.addEventListener("DOMContentLoaded", () => {
  sortOrdersByProgress(); // Sort orders on page load
  renderOrders(orders);

  document.getElementById("searchBar").addEventListener("input", handleSearch);

  // Add listeners to checkboxes for filtering
  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterOrders);
  });
});

// Function to handle search
function handleSearch() {
  const query = document.getElementById("searchBar").value.trim();
  if (query === "") {
    renderOrders(orders);
  } else {
    const filteredOrders = orders.filter((order) =>
      order.number.toString().includes(query)
    );
    renderOrders(filteredOrders);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  renderOrders(orders);

  // Add event listener to search bar
  document.getElementById("searchBar").addEventListener("input", handleSearch);
});
