document.getElementById("generateInputs").addEventListener("click", function () {
    // Input validation
    const types = document.getElementById("types").value;
    const pipeLength = document.getElementById("pipeLength").value;
    if (isNaN(types) || types <= 0) {
      alert("Please enter a valid number of piece types");
      return;
    }
    if (isNaN(pipeLength) || pipeLength <= 0) {
      alert("Please enter a valid pipe length");
      return;
    }
  const pieceInputs = document.getElementById("pieceInputs");
  pieceInputs.innerHTML = "";

  for (let i = 0; i < types; i++) {
    pieceInputs.innerHTML += `
      <label for="length${i}">Length of Pieces for Type ${i + 1} (in feet.inches, e.g., 6.08 for 6 feet 8 inches):</label>
      <input type="number" step="0.01" id="length${i}" required><br>
      <label for="count${i}">Number of Pieces for Type ${i + 1}:</label>
      <input type="number" id="count${i}" required><br><br>
    `;
  }
});

document.getElementById("pipeForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const pipeLength = convertToFeet(
    parseFloat(document.getElementById("pipeLength").value)
  );
  const types = parseInt(document.getElementById("types").value);
  let pieces = [];

  // Add input validation
  for (let i = 0; i < types; i++) {
    const lengthValue = document.getElementById(`length${i}`).value;
    const countValue = document.getElementById(`count${i}`).value;
    
    if (isNaN(lengthValue) || lengthValue <= 0) {
      alert(`Please enter a valid length for Type ${i + 1}`);
      return;
    }
    if (isNaN(countValue) || countValue <= 0) {
      alert(`Please enter a valid count for Type ${i + 1}`);
      return;
    }

    const length = convertToFeet(parseFloat(lengthValue));
    const count = parseInt(countValue);
    
    if (length > pipeLength) {
      alert(`Piece length for Type ${i + 1} cannot be longer than pipe length`);
      return;
    }
    
    pieces.push({ length, count });
  }

  // Sort pieces in descending order
  pieces.sort((a, b) => b.length - a.length);

  let remainingLengths = [];
  let piecesInPipes = [];

  // Logic for distributing pieces into pipes
  pieces.forEach(piece => {
    while (piece.count > 0) {
      let placed = false;

      for (let i = 0; i < remainingLengths.length; i++) {
        if (remainingLengths[i] >= piece.length) {
          remainingLengths[i] -= piece.length;
          piecesInPipes[i].push(piece.length);
          piece.count--;
          placed = true;
          break;
        }
      }

      if (!placed) {
        remainingLengths.push(pipeLength - piece.length);
        piecesInPipes.push([piece.length]);
        piece.count--;
      }
    }
  });

  // Display results
  const output = document.getElementById("output");
  output.innerHTML = `<h2>Total Full Pipes Used: ${remainingLengths.length}</h2>`;

  piecesInPipes.forEach((pipe, index) => {
    output.innerHTML += `
      <p>Pipe ${index + 1} contains pieces: ${pipe
        .map(p => convertToFeetInches(p))
        .join(", ")} (Remaining length: ${convertToFeetInches(remainingLengths[index])})</p>
    `;
  });
});

// Helper function to convert feet.inches to pure feet
function convertToFeet(value) {
  const feet = Math.floor(value);
  const inches = (value - feet) * 100;
  return feet + inches / 12;
}

// Helper function to convert pure feet back to feet.inches
function convertToFeetInches(value) {
  const feet = Math.floor(value);
  const inches = Math.round((value - feet) * 12);
  return `${feet}.${inches.toString().padStart(2, "0")}`;
}