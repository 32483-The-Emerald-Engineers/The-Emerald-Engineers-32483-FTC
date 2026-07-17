const viewer = document.getElementById('robot-360-viewer');
const imgElement = document.getElementById('viewer-img');

let currentColumn = 1; 
let currentRow = 1;    // Row 1 = 0deg, Row 2 = 45deg, Row 3 = 90deg

let isDragging = false;
let startX = 0;
let startY = 0;

const anglePrefixes = ["0deg", "45deg", "90deg"];

// Update these to match the exact total image count in each folder
const totalFramesPerAngle = [24, 24, 24]; 

function getImagePath(row, col) {
  const prefix = anglePrefixes[row - 1];
  return `${prefix}/${col}.png`; // Looks directly into 0deg/1.png, 45deg/1.png, etc.
}

function updateImage(row, col) {
  if (imgElement) {
    imgElement.src = getImagePath(row, col);
  }
}

// --- Mouse Drag Controls ---
viewer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  
  const sensitivityX = 15; 
  const sensitivityY = 40; 

  const currentMaxFrames = totalFramesPerAngle[currentRow - 1];

  // Horizontal Drag (Spin)
  if (Math.abs(deltaX) > sensitivityX) {
    if (deltaX > 0) {
      currentColumn = currentColumn + 1 > currentMaxFrames ? 1 : currentColumn + 1;
    } else {
      currentColumn = currentColumn - 1 < 1 ? currentMaxFrames : currentColumn - 1;
    }
    updateImage(currentRow, currentColumn);
    startX = e.clientX; 
  }

  // Vertical Drag (Angle Shift)
  if (Math.abs(deltaY) > sensitivityY) {
    const oldRow = currentRow;
    if (deltaY > 0) {
      currentRow = currentRow + 1 > anglePrefixes.length ? anglePrefixes.length : currentRow + 1;
    } else {
      currentRow = currentRow - 1 < 1 ? 1 : currentRow - 1;
    }

    if (oldRow !== currentRow) {
      const newMaxFrames = totalFramesPerAngle[currentRow - 1];
      if (currentColumn > newMaxFrames) {
        currentColumn = newMaxFrames;
      }
      updateImage(currentRow, currentColumn);
      startY = e.clientY; 
    }
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});