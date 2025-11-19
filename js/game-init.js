/**
 * Game initialization module
 */

/**
 * Loads all sound files
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
 * Starts a new game
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
 * Cleans up old world instance
 */
function cleanupOldWorld() {
    if (!world) return;
    world.clearAllIntervals();
    world.gameStopped = true;
    world = null;
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
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
}

/**
 * Creates new world instance
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
 * Restarts the game from win/lose screen
 */
function restartGame() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    startGame();
}

/**
 * Returns to main menu from win/lose screen
 */
function backToMenu() {
    document.getElementById('win-overlay').classList.add('d-none');
    document.getElementById('lose-overlay').classList.add('d-none');
    winSoundPlayed = false;
    loseSoundPlayed = false;
    drawStartScreen();
}
