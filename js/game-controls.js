/**
 * Game controls module - Handles keyboard and mobile input
 */

/**
 * Initializes mobile event handlers by setting up the visibility of mobile buttons
 * and configuring mobile controls for the game.
 */
function setupMobileEvents() {
    initMobileBtnsVisibility();
    setupMobileControls();
}

/**
 * Initializes the visibility of mobile buttons by updating their state
 * and setting up event listeners to handle window resize and orientation changes.
 * Ensures mobile buttons are shown or hidden appropriately based on device orientation and size.
 */
function initMobileBtnsVisibility() {
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);
}

/**
 * Sets up mobile control listeners for the game by mapping UI elements to game actions.
 * The controls include walking left, walking right, jumping, and throwing.
 * Each control is associated with a specific key and UI element ID.
 */
function setupMobileControls() {
    const controls = [
        { id: 'walk-left', key: 'LEFT' },
        { id: 'walk-right', key: 'RIGHT' },
        { id: 'jump', key: 'SPACE' },
        { id: 'throw', key: 'D' }
    ];
    controls.forEach(control => addMobileControlListener(control));
}

/**
 * Handles touch start event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchStart(event, key) {
    event.preventDefault();
    event.stopPropagation();
    keyboard[key] = true;
}

/**
 * Handles touch end event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchEnd(event, key) {
    event.preventDefault();
    event.stopPropagation();
    keyboard[key] = false;
}

/**
 * Handles touch cancel event
 * @param {Event} event - Touch event
 * @param {string} key - Keyboard key
 */
function handleTouchCancel(event, key) {
    event.preventDefault();
    keyboard[key] = false;
}

/**
 * Adds listener to mobile control
 * @param {Object} control - Control configuration
 */
function addMobileControlListener(control) {
    const btn = document.getElementById(control.id);
    if (!btn) {
        console.warn(`Mobile button #${control.id} not found`);
        return;
    }
    btn.addEventListener('touchstart', (e) => handleTouchStart(e, control.key), { passive: false });
    btn.addEventListener('touchend', (e) => handleTouchEnd(e, control.key), { passive: false });
    btn.addEventListener('touchcancel', (e) => handleTouchCancel(e, control.key), { passive: false });
}

/**
 * Determines if the device is in landscape orientation on a small screen (typically mobile).
 *
 * @returns {boolean} Returns true if the device is in landscape mode and the screen width is 900 pixels or less.
 */
function isMobileLandscape() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isSmallScreen = width <= 900; 
    return isLandscape && isSmallScreen;
}

/**
 * Updates the visibility of the mobile buttons element (#mobile-btns) based on device orientation.
 * If the element is not found, logs an error to the console.
 * The element is shown if the device is in mobile landscape mode, otherwise it is hidden.
 *
 * @function
 */
function updateMobileBtnsVisibility() {
    const mobileBtns = document.getElementById('mobile-btns');
    if (!mobileBtns) {
        console.error('Mobile buttons element (#mobile-btns) not found!');
        return;
    }
    const shouldShow = isMobileLandscape();
    mobileBtns.style.display = shouldShow ? 'block' : 'none';
}

/**
 * Handles keydown events for the game.
 * - Toggles fullscreen mode when the 'Escape' key is pressed.
 * - Updates key state if the game is currently playing.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, true);
}

/**
 * Handles the keyup event during gameplay.
 * Sets the key state to false when a key is released, if the game is currently playing.
 *
 * @param {KeyboardEvent} event - The keyup event object.
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, false);
}

/**
 * Sets the state of a specific key in the keyboard object based on the provided keyCode.
 *
 * @param {number} keyCode - The key code representing the keyboard key (e.g., 37 for left arrow, 39 for right arrow, 32 for space, 68 for 'D').
 * @param {boolean} state - The state to set for the key (true for pressed, false for released).
 */
function setKeyState(keyCode, state) {
    if (keyCode === 37) keyboard.LEFT = state;
    if (keyCode === 39) keyboard.RIGHT = state;
    if (keyCode === 32) keyboard.SPACE = state;
    if (keyCode === 68) keyboard.D = state;
}

/**
 * Displays the options screen by pausing the game and showing the options modal.
 *
 * @function
 */
function drawOptionsScreen() {
    pauseGame();
    showOptionsModal();
}

/**
 * Pauses the game by setting the `gamePaused` property of the `world` object to true.
 * If the `world` object does not exist, logs a warning and does nothing.
 */
function pauseGame() {
    if (!world) {
        console.warn('Cannot pause: world does not exist');
        return;
    }
    world.gamePaused = true;
}

/**
 * Resumes the game by setting the `gamePaused` property of the `world` object to `false`.
 * If the `world` object does not exist, the function does nothing.
 */
function resumeGame() {
    if (!world) {
        return;
    }
    world.gamePaused = false;
}

/**
 * Pauses the game and all sounds.
 *
 * @function
 */
function pauseGameAndSound() {
    if (typeof pauseGame === 'function' && typeof world !== 'undefined' && world) {
        pauseGame();
    }
    if (typeof SoundManager !== 'undefined') {
        SoundManager.pauseAll();
    }
}

/**
 * Resumes the game and all sounds if applicable.
 *
 * @function
 * Checks if the `resumeGame` function exists and the `world` object is defined and truthy,
 * then calls `resumeGame` to resume the game. Also checks if `SoundManager` is defined,
 * and calls `SoundManager.resumeAll()` to resume all sounds.
 */
function resumeGameAndSound() {
    if (typeof resumeGame === 'function' && typeof world !== 'undefined' && world) {
        resumeGame();
    }
    if (typeof SoundManager !== 'undefined') {
        SoundManager.resumeAll();
    }
}