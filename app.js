const seedGrid = document.getElementById("seed-grid");

for (let i = 1; i <= 25; i++) {

    const input = document.createElement("input");

    if (i === 25) {
        input.placeholder = "25 Optional";
    } else {
        input.placeholder = i.toString().padStart(2, "0");
    }

    seedGrid.appendChild(input);
}