document.addEventListener("DOMContentLoaded", function () {
  // Načtení počítadla
  loadCounter();

  // Načtení názorů
  loadOpinions();

  // Manipulace s tlačítkem pro hlasování
  const voteButton = document.getElementById("voteButton");
  if (voteButton) {
    voteButton.addEventListener("click", async function () {
      if (voteButton.disabled) return; // Prevent multiple clicks
      voteButton.disabled = true; // Disable the button
      try {
        await incrementCounter();
      } catch (error) {
        console.error("Error incrementing counter:", error);
      } finally {
        voteButton.disabled = false; // Re-enable the button
      }
    });
  } else {
    console.error('Element with id "voteButton" not found.');
  }

  // Manipulace s tlačítkem pro přidání názoru
  const opinionsBtn = document.getElementById("opinionsBtn");
  if (opinionsBtn) {
    opinionsBtn.addEventListener("click", async function () {
      if (opinionsBtn.disabled) return; // Prevent multiple clicks
      opinionsBtn.disabled = true; // Disable the button
      try {
        await addOpinion();
      } catch (error) {
        console.error("Error adding opinion:", error);
      } finally {
        opinionsBtn.disabled = false; // Re-enable the button
      }
    });
  } else {
    console.error('Element with id "opinionsBtn" not found.');
  }
});

async function loadCounter() {
  try {
    const response = await fetch("https://miroslavzeleny.cz/counter.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Counter data received:", data);
    updateCounterDisplay(data.counter);
  } catch (error) {
    console.error("Error fetching counter data:", error);
  }
}

function updateCounterDisplay(value) {
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = `Counter: ${value}`;
  } else {
    console.error('Element with id "counter" not found.');
  }
}

async function incrementCounter() {
  const response = await fetch("https://miroslavzeleny.cz/counter.php", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Counter data after increment:", data);
  updateCounterDisplay(data.counter);
}

async function loadOpinions() {
  try {
    const response = await fetch("https://miroslavzeleny.cz/opinions.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Opinions data received:", data);
    displayOpinions(data);
  } catch (error) {
    console.error("Error loading opinions:", error);
  }
}

function displayOpinions(opinions) {
  const opinionsList = document.getElementById("opinionsList");
  if (opinionsList) {
    opinionsList.innerHTML = ""; // Vyčištění seznamu názorů
    opinions.forEach((opinion) => {
      const li = document.createElement("li");
      li.textContent = opinion.text;
      opinionsList.appendChild(li);
    });
  } else {
    console.error('Element with id "opinionsList" not found.');
  }
}

async function addOpinion() {
  const opinionText = prompt("Zadejte svůj názor:");
  if (opinionText) {
    const response = await fetch("https://miroslavzeleny.cz/opinions.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: opinionText }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Opinion added:", data);
    await loadOpinions(); // Reload opinions after adding
  }
}
