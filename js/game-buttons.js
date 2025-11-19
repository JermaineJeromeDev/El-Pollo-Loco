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
    // Add canvas click listener
    canvas.addEventListener('click', handleMenuClick);
    canvas.addEventListener('mousemove', handleMenuHover);
    canvas.addEventListener('touchstart', handleMenuTouch);
    canvas.addEventListener('touchmove', handleTouchMove);
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
 * Checks if a point (x, y) is within the boundaries of a button.
 * 
 * @param {number} mx - The x-coordinate of the point to check.
 * @param {number} my - The y-coordinate of the point to check.
 * @param {Object} btn - The button object containing position and dimensions.
 * @param {number} btn.x - The x-coordinate of the button's top-left corner.
 * @param {number} btn.y - The y-coordinate of the button's top-left corner.
 * @param {number} btn.w - The width of the button.
 * @param {number} btn.h - The height of the button.
 * @returns {boolean} True if the point is within the button boundaries, false otherwise.
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
 * Creates a single "Start Game" button positioned at the top center of the canvas.
 * The button's dimensions are responsive to the canvas size, with a maximum width of 200px
 * and a width of 30% of the canvas width, whichever is smaller.
 * 
 * When clicked, the button:
 * - Changes the game state to 'playing'
 * - Clears the menu buttons array
 * - Initiates the game by calling startGame()
 * 
 * @function setupStartMenuButtons
 * @returns {void}
 * @modifies {menuButtons} - Populates the global menuButtons array with the start button configuration
 * @modifies {gameState} - Sets to 'playing' when the button is clicked
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
 * Initializes the mute button functionality for the game.
 * 
 * Sets up an event listener on the mute button that toggles the game's muted state.
 * When muted, stops gameplay sounds and mutes all audio. When unmuted, restores all
 * audio and resumes gameplay sounds after a 100ms delay.
 * 
 * @function initMuteButton
 * @returns {void}
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

/**
 * Sets up the win/lose screen buttons by creating restart and back to menu buttons.
 * Initializes the menuButtons array with two button objects based on calculated dimensions.
 * 
 * @param {string} type - The type of game state (e.g., 'win' or 'lose')
 * @global {Array} menuButtons - Global array that stores the created button objects
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