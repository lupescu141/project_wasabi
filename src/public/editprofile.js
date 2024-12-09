const fill_profile_form = async () => {
  try {
    const response = await fetch(`api/profileinfo`, {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Response:", result);
    document.getElementById("phone").value = result.phone;
    document.getElementById("name").value = result.name;
    document.getElementById("surname").value = result.surname;
  } catch (error) {
    console.error("Error:", error);
  }
};

fill_profile_form();
