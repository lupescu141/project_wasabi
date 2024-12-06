// ORDER MANAGEMENT
// Orders Data and Functions
const orders = [
  { number: 1001, time: "2024-04-25 10:30", progress: "Waiting" },
  { number: 1002, time: "2024-04-25 11:15", progress: "In progress" },
  { number: 1003, time: "2024-04-25 12:45", progress: "Done" },
  { number: 1004, time: "2024-04-25 13:20", progress: "Waiting" },
  { number: 1005, time: "2024-04-25 14:05", progress: "In progress" },
  { number: 1006, time: "2024-04-25 15:30", progress: "Done" },
];

const orderDetails = {
  1001: {
    products: [
      { name: "Sushi Roll", price: 10 },
      { name: "Tempura", price: 8 },
    ],
  },
  1002: {
    products: [
      { name: "Ramen", price: 12 },
      { name: "Gyoza", price: 6 },
    ],
  },
  // Add more order details as needed
};

// Function to create a progress status element
function createProgressStatus(status) {
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("progress-status");

  const circle = document.createElement("div");
  circle.classList.add("status-circle");

  if (status === "Waiting") circle.classList.add("status-waiting");
  else if (status === "In progress") circle.classList.add("status-in-progress");
  else if (status === "Done") circle.classList.add("status-done");

  const statusText = document.createElement("span");
  statusText.textContent = status;

  statusDiv.appendChild(circle);
  statusDiv.appendChild(statusText);

  return statusDiv;
}

// Function to render orders
function renderOrders(orderList) {
  const ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = "";

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

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("column", "order-number");
    numberDiv.innerHTML = `<a href="#" class="order-link">${order.number}</a>`;
    orderDiv.appendChild(numberDiv);

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("column", "order-time");
    timeDiv.textContent = order.time;
    orderDiv.appendChild(timeDiv);

    const progressDiv = document.createElement("div");
    progressDiv.classList.add("column", "order-progress");
    progressDiv.appendChild(createProgressStatus(order.progress));
    orderDiv.appendChild(progressDiv);

    ordersContainer.appendChild(orderDiv);

    // Add event listener to the order link
    numberDiv.querySelector(".order-link").addEventListener("click", (e) => {
      e.preventDefault();
      handleOrderClick(order);
    });
  });
}

// Function to handle order click
function handleOrderClick(order) {
  const modal = document.getElementById("orderDetailsModal");
  const productList = document.getElementById("productList");
  const totalPrice = document.getElementById("totalPrice");

  // Populate Modal
  document.getElementById("modalOrderNumber").textContent = order.number;
  document.getElementById("modalOrderTime").textContent = order.time;
  document.getElementById("modalOrderStatus").value = order.progress;

  const products = orderDetails[order.number]?.products || [];
  productList.innerHTML = "";
  let total = 0;
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - $${product.price}`;
    productList.appendChild(li);
    total += product.price;
  });
  totalPrice.textContent = total;

  // Show modal and set up event listeners for close/save actions
  modal.classList.remove("hidden");
  initializeModalListeners(); // Reinitialize event listeners every time the modal is opened
}

function initializeModalListeners() {
  const modal = document.getElementById("orderDetailsModal");
  const closeModal = document.getElementById("closeModal");
  const saveChanges = document.getElementById("saveChanges");

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  saveChanges.addEventListener("click", () => {
    const orderNumber = parseInt(
      document.getElementById("modalOrderNumber").textContent,
      10
    );
    const newStatus = document.getElementById("modalOrderStatus").value;

    // Update the order's status
    const order = orders.find((order) => order.number === orderNumber);
    if (order) {
      order.progress = newStatus;
    }

    modal.classList.add("hidden");
    renderOrders(orders); // Re-render the orders list
  });
}

// Buffet/Menu Handling
const buffetOrMenu = document.getElementById("buffetOrMenu");
const buffetFields = document.getElementById("buffetFields");
const menuFields = document.getElementById("menuFields");
const addBuffetRowButton = document.getElementById("addBuffetRow");
const nextWeekBuffetForm = document.getElementById("nextWeekBuffetForm");
const modals = document.querySelectorAll(".managementmodal");
const closeButtons = document.querySelectorAll(".managementclose");

// Show modals on button click
document.querySelectorAll("[data-modal-target]").forEach((button) => {
  const targetModal = document.querySelector(button.dataset.modalTarget);
  button.addEventListener("click", () => {
    targetModal.style.display = "block";
  });
});

// Hide modals on close button click
closeButtons.forEach((close, index) => {
  close.addEventListener("click", () => {
    modals[index].style.display = "none";
  });
});

// Hide modals on outside click
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("managementmodal")) {
    e.target.style.display = "none";
  }
});

// Handle Buffet or Menu dropdown change
buffetOrMenu.addEventListener("change", () => {
  const value = buffetOrMenu.value;
  buffetFields.classList.toggle("visible", value === "Buffet");
  menuFields.classList.toggle("visible", value === "Menu");
});

// Add new product-weekday rows in Next Week's Buffet modal
addBuffetRowButton.addEventListener("click", () => {
  const newRow = document.createElement("div");
  newRow.classList.add("form-row");
  newRow.innerHTML = `
    <label>Product</label>
    `;

  const productSelect = document.createElement("select");
  productSelect.classList.add("product-select");
  productSelect.innerHTML = `
      <option value="Sushi">Sushi</option>
      <option value="Tempura">Tempura</option>
    `;

  const newRow2 = document.createElement("div");
  newRow2.classList.add("form-row");
  newRow2.innerHTML = `
    <label>Weekday</label>
    `;

  const weekdaySelect = document.createElement("select");
  weekdaySelect.classList.add("weekday-select");
  weekdaySelect.innerHTML = `
      <option value="Monday">Monday</option>
      <option value="Tuesday">Tuesday</option>
      <option value="Wednesday">Wednesday</option>
    `;

  newRow.appendChild(productSelect);
  newRow.appendChild(weekdaySelect);

  nextWeekBuffetForm.insertBefore(newRow, addBuffetRowButton);
});

// Function to initialize event listeners
function initializeEventListeners() {
  document.getElementById("searchBar").addEventListener("input", handleSearch);

  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
  filterCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", handleSearch)
  );
}

// Function to handle search and apply filters
function handleSearch() {
  const searchTerm = document.getElementById("searchBar").value.toLowerCase();
  const showWaiting = document.getElementById("filterWaiting").checked;
  const showInProgress = document.getElementById("filterInProgress").checked;
  const showDone = document.getElementById("filterDone").checked;

  const allChecked = showWaiting && showInProgress && showDone;
  const noneChecked = !showWaiting && !showInProgress && !showDone;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.number.toString().toLowerCase().includes(searchTerm) ||
      order.time.toLowerCase().includes(searchTerm) ||
      order.progress.toLowerCase().includes(searchTerm);

    if (noneChecked || allChecked) return matchesSearch;

    const matchesStatus =
      (showWaiting && order.progress === "Waiting") ||
      (showInProgress && order.progress === "In progress") ||
      (showDone && order.progress === "Done");

    return matchesSearch && matchesStatus;
  });

  renderOrders(filteredOrders);
}

function sortOrdersByProgress() {
  const priority = { Waiting: 1, "In progress": 2, Done: 3 };
  orders.sort((a, b) => priority[a.progress] - priority[b.progress]);
}

// Initialize the event listeners after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  sortOrdersByProgress();
  renderOrders(orders);
  initializeEventListeners();
});
