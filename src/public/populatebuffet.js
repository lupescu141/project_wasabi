// Fetch buffet items based on type and weekday
const fetchBuffetItems = async (type, weekday) => {
  try {
    const response = await fetch(
      `/api/weekly_buffet?type=${type}&weekday=${weekday}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching buffet items:", error);
    return [];
  }
};

// Populate the menu for a specific day
const populateMenu = async (weekday) => {
  const types = ["carbohydrates", "maincourses", "soups"];
  for (const type of types) {
    const items = await fetchBuffetItems(type, weekday);

    const listElement = document.getElementById(`${weekday}_${type}`);
    listElement.innerHTML = ""; // Clear existing items
    items.forEach((item) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
          <strong>${item.product_name}</strong><br>
          <p>${item.product_description}</p>
          <p><strong>Allergens:</strong> ${item.product_allergens}</p>
        `;

      listElement.appendChild(listItem);
    });
  }
};

// Populate all days of the week
const populateBuffetForWeek = () => {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  daysOfWeek.forEach((day) => {
    populateMenu(day); // Populate each day of the week
  });
};

populateBuffetForWeek();
