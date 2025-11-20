/**
 * Main game entry point
 */

let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameIsMuted = false;
let gameState = 'start';
let menuButtons = [];
let isFullscreen = false;
let hoveredButtonIndex = -1;
let winSoundPlayed = false;
let loseSoundPlayed = false;

/**
 * Initializes the game by setting up the canvas, loading sounds, configuring event listeners,
 * and preparing UI elements such as mute and fullscreen buttons. Also handles responsive
 * adjustments and displays the start screen.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvasToContainer(); 
    loadAllSounds();
    setupCanvasListeners();
    setupMobileEvents();
    initMuteButton();
    initFullscreenButton();
    updateIconPositions();
    updateRotateHint();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateRotateHint);
    
    drawStartScreen();
}

/**
 * Handles the window resize event by adjusting the canvas size,
 * updating icon positions, and refreshing the rotate hint.
 */
function handleResize() {
    resizeCanvasToContainer(); 
    updateIconPositions();
    updateRotateHint();
    if (gameState === 'start') {
        drawStartScreen();
    }
}

/**
 * Initializes the game on DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
    init();
    const optionsModal = document.getElementById('options-modal');
    const closeBtn = document.getElementById('options-close-btn');
    if (optionsModal) {
        // Pause beim Öffnen
        const observer = new MutationObserver(() => {
            if (optionsModal.classList.contains('open')) {
                setGamePaused(true);
            } else {
                setGamePaused(false);
            }
        });
        observer.observe(optionsModal, { attributes: true, attributeFilter: ['class'] });
    }
    if (closeBtn && optionsModal) {
        closeBtn.addEventListener('click', () => {
            optionsModal.classList.remove('open');
            setGamePaused(false);
        });
    }
});

/**
 * Initializes and starts the game.
 * - Cleans up any previous game world and resets the canvas.
 * - Enables fullscreen mode if supported and requested.
 * - Hides start screen links on smaller screens.
 * - Creates a new game world and sets the game state to 'playing'.
 * - Handles gameplay sound based on mute state.
 */
function startGame() {
    cleanupOldWorld();
    resetCanvas();
    if (isFullscreen && canvas.requestFullscreen) {
        canvas.requestFullscreen();
        canvas.classList.add('fullscreen');
    }
    const startscreenLinks = document.querySelector('.startscreen-links');
    if (startscreenLinks && (window.innerWidth <= 1024 || window.innerHeight <= 900)) {
        startscreenLinks.style.display = 'none';
    }
    createNewWorld();
    gameState = 'playing';
    if (!gameIsMuted) {
        setTimeout(() => SoundManager.playGameplay(), 100);
    } else {
        SoundManager.pauseGameplay(); 
    }
}

/**
 * Cleans up the current game world by clearing all intervals,
 * stopping the game, and resetting the world reference.
 * Does nothing if no world exists.
 */
function cleanupOldWorld() {
    if (!world) return;
    world.clearAllIntervals();
    world.gameStopped = true;
    world = null;
}

/**
 * Resets the canvas to its default size and clears its contents.
 * Removes the 'fullscreen' class from the canvas element,
 * sets the canvas width to 720 and height to 480,
 * and clears the drawing context.
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    canvas.width = 720; 
    canvas.height = 480;
    canvas.style.width = '720px';     
    canvas.style.height = '480px';    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Initializes a new instance of the World class using the provided canvas and keyboard.
 * Assigns win and lose screen display functions to the world instance.
 * Resets the lose screen state for the character if it exists.
 */
function createNewWorld() {
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    if (world.character) {
        world.character.loseScreenShown = false;
    }
}

/**
 * Draws the start screen of the game by setting the game state,
 * loading the background image, clearing the canvas, drawing the scaled background,
 * and setting up and drawing the start menu buttons.
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
 * Resets the game overlays and returns to the start menu.
 * Hides the win and lose overlays, resets sound flags, 
 * displays the start screen links, and redraws the start screen.
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    const startscreenLinks = document.querySelector('.startscreen-links');
    if (startscreenLinks) startscreenLinks.style.display = 'flex';
    drawStartScreen();
}

/**
 * Initializes the mute button functionality.
 * Loads and applies the current mute state, updates the mute icon,
 * and sets up the click event listener to toggle mute state.
 */
function initMuteButton() {
    loadMuteState();
    applyMuteState();
    updateMuteIcon();
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            toggleMute();
            muteBtn.blur();
        });
    }
}

/**
 * Loads the mute state of the game from localStorage and updates the global `gameIsMuted` variable.
 * If a saved value exists, sets `gameIsMuted` to `true` or `false` based on the stored string.
 */
function loadMuteState() {
    const saved = localStorage.getItem('gameIsMuted');
    if (saved !== null) gameIsMuted = saved === 'true';
}

/**
 * Applies the current mute state to the game's sound manager.
 * Pauses all sounds if the game is muted, otherwise resumes all sounds.
 *
 * @function
 */
function applyMuteState() {
    gameIsMuted ? SoundManager.pauseAll() : SoundManager.resumeAll();
}

/**
 * Toggles the game's mute state, updates localStorage, 
 * applies the new mute state, and updates the mute icon.
 */
function toggleMute() {
    gameIsMuted = !gameIsMuted;
    localStorage.setItem('gameIsMuted', gameIsMuted);
    applyMuteState();
    updateMuteIcon();
}

/**
 * Updates the mute button icon based on the current mute state of the game.
 * Changes the icon to 'mute' if the game is muted, or to 'volume' if unmuted.
 * Assumes there is an element with id 'mute-btn' containing an <img> tag.
 */
function updateMuteIcon() {
    const muteBtn = document.getElementById('mute-btn');
    if (gameIsMuted) {
        muteBtn.querySelector('img').src = 'assets/img/10_button_icons/mute.png';
    } else {
        muteBtn.querySelector('img').src = 'assets/img/10_button_icons/volume.png';
    }
}

/**
 * Pauses or unpauses the game.
 * @param {boolean} paused - True to pause the game, false to unpause.
 */
function setGamePaused(paused) {
    if (world) world.gamePaused = paused;
}

