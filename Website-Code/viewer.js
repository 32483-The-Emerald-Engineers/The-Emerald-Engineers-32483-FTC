document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById('robot-360-viewer');
  const imgElement = document.getElementById('arc-viewer-img');

  if (!viewer || !imgElement) {
    console.error("Initialization Failed: Check your HTML IDs. Elements not found.");
    return;
  }

  console.log("360 Viewer successfully initialized!");

  let currentColumn = 1; 
  let currentRow = 1;    
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  
  let dragDirection = null; 

  const anglePrefixes = ["0deg", "45deg", "90deg"];
  const totalFramesPerAngle = [20, 18, 14]; 

  function getImagePath(row, col) {
    const prefix = anglePrefixes[row - 1];
    return `${prefix}/${col}.jpg`; 
  }

  // --- Preload Images ---
  function preloadAllImages() {
    for (let r = 1; r <= anglePrefixes.length; r++) {
      const maxFrames = totalFramesPerAngle[r - 1];
      for (let c = 1; c <= maxFrames; c++) {
        const img = new Image();
        img.src = getImagePath(r, c);
      }
    }
  }
  preloadAllImages();

  function updateImage(row, col) {
    const newPath = getImagePath(row, col);
    imgElement.src = newPath;
  }

  // --- Start Dragging ---
  function startDrag(clientX, clientY) {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    dragDirection = null; 
    viewer.style.cursor = 'grabbing';
  }

  // --- Track Dragging Movement ---
  function dragMove(clientX, clientY) {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    
    const sensitivityX = 15; 
    const sensitivityY = 80; 
    
    const currentMaxFrames = totalFramesPerAngle[currentRow - 1];

    // Lock axis strictly based on the primary vector of movement
    if (!dragDirection) {
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        dragDirection = 'horizontal';
      } else if (Math.abs(deltaY) > 15 && Math.abs(deltaY) > Math.abs(deltaX)) { // Fixed calculation here
        dragDirection = 'vertical';
      }
    }

    // Horizontal Movement (Spin)
    if (dragDirection === 'horizontal' && Math.abs(deltaX) > sensitivityX) {
      if (deltaX > 0) {
        currentColumn--;
        if (currentColumn < 1) {
          currentColumn = currentMaxFrames; 
        }
      } else {
        currentColumn++;
        if (currentColumn > currentMaxFrames) {
          currentColumn = 1; 
        }
      }
      
      updateImage(currentRow, currentColumn);
      startX = clientX; 
    }

    // Vertical Movement (Angles)
    if (dragDirection === 'vertical' && Math.abs(deltaY) > sensitivityY) {
      const oldRow = currentRow;
      if (deltaY > 0) {
        currentRow = currentRow + 1;
        if (currentRow > anglePrefixes.length) {
          currentRow = anglePrefixes.length;
        }
      } else {
        currentRow = currentRow - 1;
        if (currentRow < 1) {
          currentRow = 1;
        }
      }

      if (oldRow !== currentRow) {
        const newMaxFrames = totalFramesPerAngle[currentRow - 1];
        if (currentColumn > newMaxFrames) {
          currentColumn = newMaxFrames;
        }
        updateImage(currentRow, currentColumn);
        startY = clientY; 
      }
    }
  }

  // --- End Dragging ---
  function stopDrag() {
    isDragging = false;
    dragDirection = null; 
    viewer.style.cursor = 'grab';
  }

  // Mouse Listeners
  viewer.addEventListener('mousedown', (e) => {
    e.preventDefault(); 
    startDrag(e.clientX, e.clientY);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) e.preventDefault();
    dragMove(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', stopDrag);

  // Touch Listeners for Mobile devices
  viewer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      e.preventDefault(); 
      dragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });
  window.addEventListener('touchend', stopDrag);
});