/**
 * Game initialization module
 */

/**
 * Loads all required game sounds into the SoundManager.
 * Each sound is identified by a unique name and its corresponding audio file path.
 * The audio type is determined by the file extension (.mp3 or .wav).
 *
 * @function
 */
function loadAllSounds() {
    const sounds = [
        { name: 'jump', src: 'assets/audio/1_character/jump.mp3' },
        { name: 'throw', src: 'assets/audio/4_bottle/throw.mp3' },
        { name: 'break', src: 'assets/audio/4_bottle/break.mp3' },
        { name: 'hurt', src: 'assets/audio/1_character/hurt.mp3' },
        { name: 'lose', src: 'assets/audio/5_win_lose/lose.wav' },
        { name: 'win', src: 'assets/audio/5_win_lose/win.wav' },
        { name: 'gameplay', src: 'assets/audio/0_gameplay/gamesound.wav' },
        { name: 'coin', src: 'assets/audio/3_coin/collect.wav' }
    ];
    sounds.forEach(sound => {
        const type = sound.src.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';
        SoundManager.load(sound.name, [{ src: sound.src, type }]);
    });
}

/**
 * Initializes and starts the game by cleaning up the previous world, resetting the canvas,
 * creating a new world, and setting the game state to 'playing'. If the game is not muted,
 * it plays the gameplay sound after a short delay.
 */
function startGame() {
    cleanupOldWorld();
    resetCanvas();
    createNewWorld();
    gameState = 'playing';
    if (!gameIsMuted) {
        setTimeout(() => SoundManager.playGameplay(), 100);
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
 * Resets the canvas to its default state by removing the fullscreen class,
 * resizing the canvas to fit its container, and clearing its contents.
 */
function resetCanvas() {
    canvas.classList.remove('fullscreen');
    resizeCanvasToContainer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Resizes the canvas element to fit its parent container.
 * Sets the canvas's internal width and height to fixed values (720x480),
 * and updates its CSS width and height to match the container's dimensions.
 *
 * Assumes `canvas` is a global variable referencing the canvas element.
 */
function resizeCanvasToContainer() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = 720;
    canvas.height = 480;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
}

/**
 * Initializes a new instance of the World and sets up win/lose screen handlers.
 * Resets the lose screen flag for the character if it exists.
 *
 * @function
 * @global
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
 * Restarts the game by hiding win and lose overlays, 
 * resetting sound flags, and starting a new game session.
 */
function restartGame() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    startGame();
}

/**
 * Resets the game overlays and sound states, then redraws the start screen.
 * Hides both the win and lose overlays, resets sound flags, and displays the start screen.
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}

/**
 * Stops the game world by clearing all active intervals and setting the gameStopped flag.
 * Checks if the global `world` object exists before performing actions.
 */
function stopGameWorld() {
    if (typeof world !== 'undefined' && world) {
        world.clearAllIntervals();
        world.gameStopped = true;
    }
}

/**
 * Navigates to the start screen by invoking the `drawStartScreen` function if it exists.
 * Checks if `drawStartScreen` is defined and is a function before calling it.
 */
function navigateToStartScreen() {
    if (typeof drawStartScreen === 'function') {
        drawStartScreen();
    }
}

/**
 * Handles the transition from the game back to the main menu.
 * Stops the game world, halts all game sounds, resets sound flags, and navigates to the start screen.
 */
function backToMenuFromGame() {
    stopGameWorld();
    stopAllGameSounds();
    resetSoundFlags();
    navigateToStartScreen();
}

/**
 * Resets the sound flags for win and lose events to false.
 * Checks if the global variables `winSoundPlayed` and `loseSoundPlayed` are defined,
 * and sets them to false if they exist.
 */
function resetSoundFlags() {
    if (typeof winSoundPlayed !== 'undefined') winSoundPlayed = false;
    if (typeof loseSoundPlayed !== 'undefined') loseSoundPlayed = false;
}