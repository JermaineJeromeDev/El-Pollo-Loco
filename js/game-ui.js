/**
 * Aktualisiert Icon-Positionen relativ zum Canvas
 */
function updateIconPositions() {
    const containerEl = document.querySelector('.container');
    const topControls = document.querySelector('.top-controls');
    if (!containerEl || !topControls) return;

    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const topOffset = canvasRect.top - containerRect.top + 8;
    const rightOffset = containerRect.right - canvasRect.right + 8;
    
    topControls.style.top = `${topOffset}px`;
    topControls.style.right = `${rightOffset}px`;
}

/**
 * Zeigt Rotations-Hinweis oder versteckt ihn
 */
function updateRotateHint() {
    const rotateHint = document.getElementById('rotate-screen-hint');
    if (!rotateHint) return;

    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallScreen = window.innerWidth <= 768;

    if (isPortrait && isSmallScreen) {
        showRotateHint(rotateHint);
    } else {
        hideRotateHint(rotateHint);
    }
}

/**
 * Zeigt den Rotations-Hinweis an
 * @param {HTMLElement} rotateHint - Das Rotate-Hint Element
 */
function showRotateHint(rotateHint) {
    rotateHint.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    window.scrollTo(0, 0);
    document.addEventListener('touchmove', preventScroll, { passive: false });
}

/**
 * Versteckt den Rotations-Hinweis
 * @param {HTMLElement} rotateHint - Das Rotate-Hint Element
 */
function hideRotateHint(rotateHint) {
    rotateHint.style.display = 'none';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.removeEventListener('touchmove', preventScroll);
}

/**
 * Verhindert Scroll-Events
 * @param {Event} e - Touch-Event
 */
function preventScroll(e) {
    e.preventDefault();
}

/**
 * Initialisiert Mute-Button mit Event-Listener
 */
function initMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;
    
    updateMuteIcon(muteBtn);
    muteBtn.addEventListener('click', toggleMute);
}

/**
 * Aktualisiert Mute-Icon basierend auf gameIsMuted
 * @param {HTMLElement} btn - Mute-Button Element
 */
function updateMuteIcon(btn) {
    const img = btn.querySelector('img');
    if (!img) return;
    img.src = gameIsMuted ? 
        'assets/img/10_button_icons/mute.png' : 
        'assets/img/10_button_icons/volume.png';
}

/**
 * Togglet Mute-Status
 */
function toggleMute() {
    gameIsMuted = !gameIsMuted;
    
    if (gameIsMuted) {
        SoundManager.stopAll();
    } else if (gameState === 'playing') {
        SoundManager.playGameplay();
    }
    
    updateAllMuteIcons();
}

/**
 * Aktualisiert alle Mute-Icons im UI
 */
function updateAllMuteIcons() {
    const muteBtnImg = document.querySelector('#mute-btn img');
    const ingameAudioImg = document.querySelector('#audio-btn img');
    
    if (muteBtnImg) {
        muteBtnImg.src = gameIsMuted ? 
            'assets/img/10_button_icons/mute.png' : 
            'assets/img/10_button_icons/volume.png';
    }
    if (ingameAudioImg) {
        ingameAudioImg.src = gameIsMuted ? 
            'assets/img/10_button_icons/mute.png' : 
            'assets/img/10_button_icons/volume.png';
    }
}
