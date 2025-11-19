/**
 * Canvas drawing and screen management module
 */

/**
 * Draws the start screen
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
 * Shows the win screen
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
 * Shows the lose screen
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
 * Redraws menu screen
 */
function redrawMenuScreen() {
    if (gameState === 'start') drawStartScreen();
}

/**
 * Adds fullscreen class to elements
 */
function addFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.add('fullscreen');
    canvas.classList.add('fullscreen');
}

/**
 * Removes fullscreen class from elements
 */
function removeFullscreenClasses(containerEl) {
    if (containerEl) containerEl.classList.remove('fullscreen');
    canvas.classList.remove('fullscreen');
}

/**
 * Resets canvas to default size
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    resizeCanvasToContainer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Resizes canvas to match container size
 */
function resizeCanvasToContainer() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = 720;
    canvas.height = 480;
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.objectFit = 'cover';
    } else {
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.style.objectFit = 'contain';
    }
}

/**
 * Updates canvas dimensions
 */
function updateCanvasDimensions() {
    resizeCanvasToContainer();
}

/**
 * Redraws screen after fullscreen toggle
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
 * Toggles fullscreen mode
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
