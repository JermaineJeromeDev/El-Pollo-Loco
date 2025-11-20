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
window.addEventListener('DOMContentLoaded', init);

/**
 * Initializes and starts a new game session.
 * - Cleans up any existing game world.
 * - Resets the game canvas.
 * - Creates a new game world.
 * - Sets the game state to 'playing'.
 * - Plays gameplay sound if the game is not muted.
 * - Bleibt im Fullscreen, wenn aktiviert.
 */
function startGame() {
    cleanupOldWorld();
    resetCanvas();
    if (isFullscreen && canvas.requestFullscreen) {
        canvas.requestFullscreen();
        canvas.classList.add('fullscreen');
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
 * Resets the game overlays and sound flags, then redraws the start screen.
 * Hides both win and lose overlays, resets sound played flags, and displays the start menu.
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}

/**
 * Initializes the mute button functionality.
 * Loads the current mute state, applies it to the game,
 * updates the mute icon, and sets up the click event listener
 * to toggle mute on user interaction.
 */
function initMuteButton() {
    loadMuteState();
    applyMuteState();
    updateMuteIcon();
    document.getElementById('mute-btn')?.addEventListener('click', toggleMute);
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
 * Changes the icon to a mute or volume image depending on the value of `gameIsMuted`.
 *
 * Assumes there is an element with the ID 'mute-btn' containing an <img> tag.
 */
function updateMuteIcon() {
    const muteBtn = document.getElementById('mute-btn');
    if (gameIsMuted) {
        muteBtn.querySelector('img').src = 'assets/img/10_button_icons/mute.png';
    } else {
        muteBtn.querySelector('img').src = 'assets/img/10_button_icons/volume.png';
    }
}

