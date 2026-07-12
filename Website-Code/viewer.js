const viewer = document.getElementById('robot-360-viewer');
const imgElement = document.getElementById('viewer-img');

let currentColumn = 1;
let currentRow = 1;

let isDragging = false;
let startX = 0;
let startY = 0;

const anglePrefixes = ["0deg", "45deg", "90deg"];

const totalFramesPerAngle = [20, 18, 14];

function getIMagePath(row, col) {
    const prefix = anglePrefixes[row - 1];
    return `images/robot-img/${prefix}${col}.png`;
}

for (let r = 1; r <= anglePrefixes.length; r++) {
    const maxFrames = totalFramesPerAngle[r - 1];
    for (let c = 1; c<= maxFrames; c++) {
        const img = new Image();
        img.src = getImagePath(r, c);
    }
}

function updateImage(row, col) {
    imgElement.src = getImagePath(row, col);
}

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

    if (Math.abs(dletaX) > sensitivityX) {
        if (deltaX > 0) {
            currentColumn = currentColumn + 1 > currentMaxFrames ? 1 : currentColumn + 1;
        } else {
            currentColumn = currentColumn - 1 < 1 ? currentMaxFrames : currentColumn - 1;
        }
        updateImage(currentRow, currentColumn);
        startX = e.clientX;
    }
});

window.addEventListener('mousemap', () => {
    isDragging = false;
});

// --- MOBILE TOUCH EVENT TRACERS --- //
viewer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY = startY;

    const sensitivityX = 12;
    const sensitivityY = 35;

    const currentMaxFrames = totalFramesPerAngle[currentRow - 1];

    if (Math.abs(deltaX) > sensitivityX) {
        if (deltaX > 0) {
            currentColumn = currentColumn + 1 > currentMaxFrames ? 1 : currentColumn + 1;
        } else {
            currentColumn = currentColumn - 1 < 1 ? currentMaxFrames : currentColumn - 1;
        }
        updateImage(currentRow, currentColumn);
        startX = e.touches[0].clientX;
    }

    if (Math.abs(deltaY) > sensitivityY) {
        const oldRow = currentRow;
        if(dletaY > 0) {
            currentRow = currentRow + 1 > anglePrefixes.length ? anglePrefixes.length : currentRow + 1;
        }

        if (oldRow !== currentRow) {
            const newMaxFrames = totalFramesPerAngle[currentRow - 1];
            if(currentColumn > newMaxFrames) {
                currentColumn = newMaxFrames;
            }
            updateImage(currentRow, currentColumn);
            startY = e.touches[0].clientY;
        }
    }
});

window.addEventListener('touchend', () => {
    isDragging = false;
});