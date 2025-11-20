/**
 * Canvas drawing and screen management module
 */

/**
 * Draws the start screen of the game by setting the game state,
 * loading the background image, clearing the canvas, drawing the scaled background,
 * and rendering the start menu buttons.
 *
 * @function
 */
function drawStartScreen() {
    gameState = 'start';
    const bg = new Image();
    bg.src = 'assets/img/9_intro_outro_screens/start/startscreen_2.png';
    bg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScaledBackground(bg);
        setupStartMenuButtons();
        drawMenuButtons();
    };
}

/**
 * Draws background image scaled
 * @param {Image} img - The image to draw
 */
function drawScaledBackground(img) {
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    const dimensions = calculateBackgroundDimensions(imgAspect, canvasAspect);
    ctx.drawImage(img, dimensions.offsetX, dimensions.offsetY, dimensions.drawWidth, dimensions.drawHeight);
}

/**
 * Calculates background dimensions for proper scaling
 * @param {number} imgAspect - Image aspect ratio
 * @param {number} canvasAspect - Canvas aspect ratio
 * @returns {Object} Dimensions
 */
function calculateBackgroundDimensions(imgAspect, canvasAspect) {
    let drawWidth, drawHeight, offsetX, offsetY;
    if (canvasAspect > imgAspect) {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }
    return { drawWidth, drawHeight, offsetX, offsetY };
}

/**
 * Displays the win screen overlay and handles win state logic.
 * - Sets the game state to 'win'.
 * - Stops gameplay sounds.
 * - Plays the win sound if not muted and not already played.
 * - Shows the win overlay element.
 */
function showWinScreen() {
    gameState = 'win';
    SoundManager.stopGameplay();
    if (!gameIsMuted && !winSoundPlayed) { 
        SoundManager.playWin(); 
        winSoundPlayed = true; 
    }
    const winOverlay = document.getElementById('win-overlay');
    winOverlay.classList.remove('d-none');
}

/**
 * Displays the lose screen overlay and handles related game state changes.
 * - Sets the game state to 'lose'.
 * - Stops gameplay sounds.
 * - Plays the lose sound if not muted and not already played.
 * - Shows the lose overlay by removing the 'd-none' class.
 */
function showLoseScreen() {
    gameState = 'lose';
    SoundManager.stopGameplay();
    if (!gameIsMuted && !loseSoundPlayed) { 
        SoundManager.playLose(); 
        loseSoundPlayed = true; 
    }
    const loseOverlay = document.getElementById('lose-overlay');
    loseOverlay.classList.remove('d-none');
}

/**
 * Redraws the menu screen based on the current game state.
 * If the game state is 'start', it draws the start screen.
 */
function redrawMenuScreen() {
    if (gameState === 'start') drawStartScreen();
}

/**
 * Adds the 'fullscreen' CSS class to the specified container element and the global canvas element.
 *
 * @param {HTMLElement} containerEl - The container element to which the 'fullscreen' class will be added. If null or undefined, only the canvas will be affected.
 */
function addFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.add('fullscreen');
    canvas.classList.add('fullscreen');
}

/**
 * Removes the 'fullscreen' CSS class from the specified container element and the global canvas element.
 *
 * @param {HTMLElement} containerEl - The container element from which to remove the 'fullscreen' class.
 */
function removeFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.remove('fullscreen');
    canvas.classList.remove('fullscreen');
}

/**
 * Resets the game canvas to its default state by:
 * - Removing the 'fullscreen' class from the canvas element.
 * - Resizing the canvas to fit its container.
 * - Clearing all drawings from the canvas context.
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    resizeCanvasToContainer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Adjusts the visible size of the canvas to match the current window size,
 * while keeping the internal resolution at 720x480 for game logic.
 *
 * Typically called on initialization or when entering/exiting fullscreen.
 */
function resizeCanvasToContainer() {
    canvas.width = 720;
    canvas.height = 480;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

/**
 * Updates the dimensions of the game canvas by resizing it to fit its container.
 * Calls the `resizeCanvasToContainer` function to perform the resizing.
 */
function updateCanvasDimensions() {
    resizeCanvasToContainer();
}

/**
 * Redraws the game canvas after toggling fullscreen mode.
 * Updates icon positions and redraws the appropriate screen based on the current game state.
 * - If the game is at the start screen, redraws the start screen after a short delay.
 * - If the game world exists, requests an animation frame to redraw the world.
 */
function redrawAfterFullscreen() {
    updateIconPositions();
    if (gameState === 'start') {
        setTimeout(() => drawStartScreen(), 100);
    } else if (world && world.draw) {
        requestAnimationFrame(() => world.draw());
    }
}

/**
 * Toggles the fullscreen mode for the game container.
 * Adds or removes fullscreen-related CSS classes and updates the canvas dimensions accordingly.
 * Also triggers a redraw of the canvas after toggling fullscreen.
 *
 * @function
 */
function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const containerEl = document.querySelector('.container');
    if (isFullscreen) {
        addFullscreenClasses(containerEl);
    } else {
        removeFullscreenClasses(containerEl);
    }
    updateCanvasDimensions();
    redrawAfterFullscreen();
}

document.addEventListener('fullscreenchange', () => {
    setTimeout(resizeCanvasToContainer, 50);
});
