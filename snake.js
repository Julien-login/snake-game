const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Färbe das Canvas rot, um zu testen, ob das Skript funktioniert
ctx.fillStyle = "red";
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log("Test: Das Skript wurde geladen und das Canvas wurde rot gefärbt.");
