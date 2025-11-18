/**
 * Game controls module - Handles keyboard and mobile input
 */

/**
 * Initializes mobile button visibility
 */
function setupMobileEvents() {
    initMobileBtnsVisibility();
    setupMobileControls();
}

/**
 * Initializes mobile button visibility listeners
 */
function initMobileBtnsVisibility() {
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);
}

/**
 * Sets up mobile control buttons
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
 * Checks if mobile landscape
 */
function isMobileLandscape() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isSmallScreen = width <= 900; 
    return isLandscape && isSmallScreen;
}

/**
 * Updates mobile button visibility
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
 * Handles keydown events
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, true);
}

/**
 * Handles keyup events
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    setKeyState(event.keyCode, false);
}

/**
 * Sets keyboard state
 */
function setKeyState(keyCode, state) {
    if (keyCode === 37) keyboard.LEFT = state;
    if (keyCode === 39) keyboard.RIGHT = state;
    if (keyCode === 32) keyboard.SPACE = state;
    if (keyCode === 68) keyboard.D = state;
}

/**
 * Pauses the game
 */
function pauseGame() {
    if (!world) {
        console.warn('Cannot pause: world does not exist');
        return;
    }
    world.gamePaused = true;
}

/**
 * Resumes the game
 */
function resumeGame() {
    if (!world) {
        console.warn('Cannot resume: world does not exist');
        return;
    }
    world.gamePaused = false;
}
