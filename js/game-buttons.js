/**
 * Button management module
 */

/**
 * Sets up event listeners for canvas and window interactions.
 * Adds click, touch, mouse, and keyboard event handlers to manage game menu interactions
 * and user input. Canvas listeners are only added once to prevent duplicates.
 * 
 * @function setupCanvasListeners
 * @returns {void}
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
 * Handles menu button clicks
 * @param {MouseEvent} event - Mouse event
 */
function handleMenuClick(event) {
    const { x, y } = getScaledMousePosition(event);
    menuButtons.forEach((btn) => {
        if (isPointInButton(x, y, btn)) {
            btn.onClick();
        }
    });
}

/**
 * Gets mouse position with proper scaling
 * @param {MouseEvent} event - Mouse event
 * @returns {Object} Scaled coordinates {x, y}
 */
function getScaledMousePosition(event) {
    let { x, y } = getMousePos(event);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
}

/**
 * Handles mouse hover events over menu buttons.
 * Updates the hovered button index and redraws the menu screen if the game is in a menu state.
 * Only processes hover events when the game state is 'start', 'win', or 'lose'.
 * 
 * @param {MouseEvent} event - The mouse event containing cursor position information
 * @returns {void}
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
 * Calculates the mouse position relative to the canvas element.
 * 
 * @param {MouseEvent} event - The mouse event object containing client coordinates.
 * @returns {{x: number, y: number}} An object containing the x and y coordinates relative to the canvas.
 */
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Checks if a point is inside a button.
 *
 * @param {number} mx - X-coordinate of the point.
 * @param {number} my - Y-coordinate of the point.
 * @param {{x: number, y: number, w: number, h: number}} btn - Button position and size.
 * @returns {boolean} True if the point is inside the button.
 */
function isPointInButton(mx, my, btn) {
    return mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h;
}

/**
 * Gets touch coordinates
 * @param {Touch} touch - Touch object
 * @param {DOMRect} rect - Canvas bounding rect
 * @returns {Object} Coordinates {x, y}
 */
function getTouchCoordinates(touch, rect) {
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
}

/**
 * Handles touch events on the menu canvas and delegates to button touch handler.
 * Prevents default touch behavior and event propagation, then calculates touch
 * coordinates relative to the canvas and processes button interactions.
 * 
 * @param {TouchEvent} event - The touch event triggered on the canvas
 * @returns {void}
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
 * Handles button click from touch
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function handleButtonTouch(x, y) {
    menuButtons.forEach(btn => {
        const isInside = isPointInButton(x, y, btn);
        if (isInside) {
            btn.onClick();
        }
    });
}

/**
 * Handles touch move events on the canvas during menu screens.
 * Updates the hovered button state based on touch position and redraws the menu.
 * 
 * @param {TouchEvent} event - The touch move event object
 * @returns {void}
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
 * Sets up the start menu buttons for the game.
 * Creates a "Start Game" button centered on the canvas and assigns its click handler.
 * Updates the global `menuButtons` array with the button configuration.
 *
 * @function
 * @global
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
 * Draws all menu buttons by iterating through the menuButtons array.
 * Calls drawButton for each button with its corresponding index.
 * 
 * @function drawMenuButtons
 * @returns {void}
 */
function drawMenuButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Draws a button on the canvas with styling based on hover state.
 * 
 * @param {Object} btn - The button object to draw.
 * @param {string} btn.text - The text to display on the button.
 * @param {number} btn.x - The x-coordinate of the button's top-left corner.
 * @param {number} btn.y - The y-coordinate of the button's top-left corner.
 * @param {number} btn.w - The width of the button.
 * @param {number} btn.h - The height of the button.
 * @param {number} idx - The index of the button in the buttons array.
 * @returns {void}
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
 * Initializes the fullscreen button by adding a click event listener.
 * When clicked, toggles fullscreen mode and removes focus from the active element.
 * If the fullscreen button element is not found, the function returns early.
 * 
 * @function initFullscreenButton
 * @returns {void}
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
 * Initializes the mute button by attaching a click event listener
 * that toggles the mute state and updates the button icon.
 * Also ensures the button loses focus after being clicked.
 * If the mute button is not found in the DOM, the function exits early.
 */
function initMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;
    const muteImg = muteBtn.querySelector('img');
    muteBtn.addEventListener('click', () => {
        toggleMute(muteBtn, muteImg);
        muteBtn.blur();
    });
    updateMuteIcon(muteImg);
}

/**
 * Toggles the mute state of the game, updates the mute button's appearance,
 * manages game sounds, and updates the mute icon.
 *
 * @param {HTMLElement} muteBtn - The button element used to toggle mute.
 * @param {HTMLImageElement} muteImg - The image element representing the mute icon.
 */
function toggleMute(muteBtn, muteImg) {
    gameIsMuted = !gameIsMuted;
    muteBtn.classList.toggle('muted', gameIsMuted);
    if (gameIsMuted) {
        SoundManager.stopGameplay();
        SoundManager.muteAll();
    } else {
        SoundManager.unmuteAll();
        setTimeout(() => SoundManager.playGameplay(), 100);
    }
    updateMuteIcon(muteImg);
}

/**
 * Updates the mute icon image source based on the game's mute state.
 *
 * @param {HTMLImageElement} muteImg - The image element representing the mute/volume icon.
 */
function updateMuteIcon(muteImg) {
    if (!muteImg) return;
    muteImg.src = gameIsMuted
        ? 'assets/img/10_button_icons/mute.png'
        : 'assets/img/10_button_icons/volume.png';
}

/**
 * @type {Array}
 * @name menuButtons
 * Global array that stores the created button objects
 */
function setupWinLoseButtons(type) {
    const { w, h, spacing } = calculateButtonDimensions();
    menuButtons = [
        createRestartButton(w, h, spacing),
        createBackToMenuButton(w, h, spacing)
    ];
}

/**
 * Draws all win/lose menu buttons by iterating through the menuButtons array.
 * Calls drawButton for each button with its corresponding index.
 * 
 * @returns {void}
 */
function drawWinLoseButtons() {
    menuButtons.forEach((btn, idx) => drawButton(btn, idx));
}

/**
 * Creates back to menu button configuration
 * @param {number} w - Button width
 * @param {number} h - Button height
 * @param {number} spacing - Button spacing
 * @returns {Object} Button configuration
 */
function createBackToMenuButton(w, h, spacing) {
    return { 
        text: 'Back to Menu', 
        x: spacing + w + spacing, 
        y: Math.max(75, canvas.height * 0.15), 
        w, 
        h, 
        onClick: () => {
            winSoundPlayed = false;
            loseSoundPlayed = false;
            endScreenImage = null;
            drawStartScreen();
        }
    };
}

/**
 * Creates restart button configuration
 * @param {number} w - Button width
 * @param {number} h - Button height
 * @param {number} spacing - Button spacing
 * @returns {Object} Button configuration
 */
function createRestartButton(w, h, spacing) {
    return { 
        text: 'Restart', 
        x: spacing, 
        y: Math.max(75, canvas.height * 0.15), 
        w, 
        h, 
        onClick: () => { 
            winSoundPlayed = false; 
            loseSoundPlayed = false; 
            endScreenImage = null;
            startGame(); 
        } 
    };
}

/**
 * Calculates button dimensions
 * @returns {Object} Button dimensions {w, h, spacing}
 */
function calculateButtonDimensions() {
    const w = Math.min(200, canvas.width * 0.25);
    const h = 60;
    const spacing = (canvas.width - (w * 2)) / 3;
    return { w, h, spacing };
}

/**
 * Handles keydown events during gameplay.
 * Sets corresponding properties on the `keyboard` object to `true` based on the pressed key.
 * Only processes events if the game state is 'playing'.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeyDown(event) {
    if (gameState !== 'playing') return;
    if (event.code === 'ArrowLeft') keyboard.LEFT = true;
    if (event.code === 'ArrowRight') keyboard.RIGHT = true;
    if (event.code === 'Space') keyboard.SPACE = true;
    if (event.code === 'KeyD') keyboard.D = true;
}

/**
 * Handles keyup events
 */
/**
 * Handles the keyup event for game controls.
 * Updates the keyboard state by setting the corresponding key property to false
 * when the user releases a control key, but only if the game is currently playing.
 *
 * @param {KeyboardEvent} event - The keyup event object.
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    if (event.code === 'ArrowLeft') keyboard.LEFT = false;
    if (event.code === 'ArrowRight') keyboard.RIGHT = false;
    if (event.code === 'Space') keyboard.SPACE = false;
    if (event.code === 'KeyD') keyboard.D = false;
}