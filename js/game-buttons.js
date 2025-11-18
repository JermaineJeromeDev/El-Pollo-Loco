/**
 * Button management module
 */

/**
 * Sets up canvas listeners
 */
function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('touchstart', handleMenuTouch, { passive: false });
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas._listenersAdded = true;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

/**
 * Handles menu clicks
 */
function handleMenuClick(event) {
    event.preventDefault();
    event.stopPropagation();
    let { x, y } = getMousePos(event);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x = x * scaleX;
    y = y * scaleY;
    menuButtons.forEach((btn) => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

/**
 * Handles menu hover
 */
function handleMenuHover(event) {
    if (!['start', 'win', 'lose'].includes(gameState)) return;
    let { x, y } = getMousePos(event);
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

/**
 * Gets mouse position
 */
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Checks if point is inside button
 */
function isPointInButton(mx, my, btn) {
    return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
}

/**
 * Gets touch coordinates
 */
function getTouchCoordinates(touch, rect) {
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
}

/**
 * Handles button touch
 */
function handleButtonTouch(x, y) {
    menuButtons.forEach(btn => {
        if (isPointInButton(x, y, btn)) btn.onClick();
    });
}

/**
 * Handles menu touch
 */
function handleMenuTouch(event) {
    event.preventDefault();
    event.stopPropagation();
    let touch = event.touches[0];
    if (!touch) return;
    let rect = canvas.getBoundingClientRect();
    const { x, y } = getTouchCoordinates(touch, rect);
    handleButtonTouch(x, y);
}

/**
 * Handles touch move
 */
function handleTouchMove(event) {
    if (!['start', 'win', 'lose'].includes(gameState)) return;
    event.preventDefault();
    let touch = event.touches[0];
    if (!touch) return;
    let rect = canvas.getBoundingClientRect();
    const { x, y } = getTouchCoordinates(touch, rect);
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (isPointInButton(x, y, btn)) hoveredButtonIndex = idx;
    });
    redrawMenuScreen();
}

/**
 * Sets up start menu buttons
 */
function setupStartMenuButtons() {
    const w = Math.min(200, canvas.width * 0.3);
    const h = 60;
    const x = (canvas.width - w) / 2;
    const y = Math.max(60, canvas.height * 0.125);
    menuButtons = [{
        text: 'Start Game',
        x, y, w, h,
        onClick: () => {
            gameState = 'playing';
            menuButtons = [];
            startGame();
        }
    }];
}

/**
 * Draws menu buttons
 */
function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Draws single button
 */
function drawButton(btn, idx) {
    ctx.save();
    ctx.fillStyle = (idx === hoveredButtonIndex) ? "#FFD700" : "#FFA500";
    let fontSize = Math.min(38, Math.max(24, canvas.width / 20));
    ctx.font = `bold ${fontSize}px 'Luckiest Guy', cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
    ctx.restore();
}

/**
 * Initializes fullscreen button
 */
function initFullscreenButton() {
    const fsBtn = document.getElementById('fullscreen-btn');
    if (!fsBtn) return;
    fsBtn.addEventListener('click', () => {
        toggleFullscreen();
        if (document.activeElement) document.activeElement.blur();
    });
}

/**
 * Initializes mute button
 */
function initMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;
    muteBtn.addEventListener('click', () => {
        gameIsMuted = !gameIsMuted;
        muteBtn.classList.toggle('muted', gameIsMuted);
        if (gameIsMuted) {
            SoundManager.stopGameplay();
            SoundManager.muteAll();
        } else {
            SoundManager.unmuteAll();
            setTimeout(() => SoundManager.playGameplay(), 100);
        }
    });
}
