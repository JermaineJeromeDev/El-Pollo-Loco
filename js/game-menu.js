/**
 * Shows the options modal
 */
function showOptionsModal() {
    // Pausiere Spiel UND Sound
    if (typeof pauseGame === 'function' && typeof world !== 'undefined' && world) {
        pauseGame();
    }
    
    if (typeof SoundManager !== 'undefined') {
        SoundManager.pauseAll();
    }
    
    const modal = document.getElementById('options-modal');
    const container = document.querySelector('.container');
    
    if (!modal) {
        console.error('Options modal (#options-modal) not found!');
        return;
    }
    
    // Modal sichtbar machen - JETZT NUR NOCH JAVASCRIPT, KEIN CSS-ATTRIBUT-SELEKTOR
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    }, 10); // Kleine Verzögerung für Transition-Effekt
    
    if (container) {
        container.classList.add('modal-open');
    }
    
    const storyContent = document.getElementById('story-content');
    const controlsContent = document.getElementById('controls-content');
    
    if (storyContent) {
        storyContent.classList.remove('d-none');
        storyContent.style.display = 'block';
    }
    
    if (controlsContent) {
        controlsContent.classList.add('d-none');
    }
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const storyTab = document.getElementById('tab-story');
    if (storyTab) {
        storyTab.classList.add('active');
    }
    
    console.log('Modal opened - Game & Sound paused');
}

/**
 * Hides the options modal
 */
function hideOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.querySelector('.container');
    
    if (!modal) return;
    
    // Transition zurück
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Wartet bis Transition fertig ist
    
    if (container) {
        container.classList.remove('modal-open');
    }
    
    // Resume Game & Sound
    if (typeof resumeGame === 'function' && typeof world !== 'undefined' && world) {
        resumeGame();
    }
    
    if (typeof SoundManager !== 'undefined') {
        SoundManager.resumeAll();
    }
    
    console.log('Modal closed - Game & Sound resumed');
}

/**
 * Initializes the tab system
 */
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn:not(a)');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const tabId = btn.id;
            console.log('Tab clicked:', tabId);
            
            if (tabId === 'tab-back-menu') {
                hideOptionsModal();
                backToMenuFromGame();
                return;
            }
            
            // Alle Tabs deaktivieren
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Alle Contents verstecken
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('d-none');
                content.style.display = 'none';
            });
            
            // Richtigen Content anzeigen
            if (tabId === 'tab-story') {
                const storyContent = document.getElementById('story-content');
                if (storyContent) {
                    storyContent.classList.remove('d-none');
                    storyContent.style.display = 'block';
                }
            } else if (tabId === 'tab-controls') {
                const controlsContent = document.getElementById('controls-content');
                if (controlsContent) {
                    controlsContent.classList.remove('d-none');
                    controlsContent.style.display = 'block';
                }
            }
        });
    });
}

/**
 * Initializes the options modal and its event listeners
 */
function initOptionsModal() {
    const optionsTopBtn = document.getElementById('options-top-btn');
    const optionsCloseBtn = document.getElementById('options-close-btn');
    const tabBackMenu = document.getElementById('tab-back-menu');
    
    if (optionsTopBtn) {
        optionsTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showOptionsModal();
            if (document.activeElement) {
                document.activeElement.blur();
            }
        });
    } else {
        console.warn('Options button (#options-top-btn) not found!');
    }
    
    if (optionsCloseBtn) {
        optionsCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideOptionsModal();
        });
    }
    
    if (tabBackMenu) {
        tabBackMenu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideOptionsModal();
            backToMenuFromGame();
        });
    }
    
    initTabSystem();
    console.log('Options modal initialized');
}

/**
 * Initializes tab button listeners
 */
function initTabButtons() {
    const tabStory = document.getElementById('tab-story');
    const tabControls = document.getElementById('tab-controls');
    const tabBackMenu = document.getElementById('tab-back-menu');
    
    if (tabStory) {
        tabStory.addEventListener('click', () => switchTab('story'));
    }
    
    if (tabControls) {
        tabControls.addEventListener('click', () => switchTab('controls'));
    }
    
    if (tabBackMenu) {
        // NEU: Beendet Spiel und geht zurück zum Menü
        tabBackMenu.addEventListener('click', () => {
            hideOptionsModal();
            backToMenuFromGame();
        });
    }
}

/**
 * Goes back to main menu from game
 */
function backToMenuFromGame() {
    // Stoppe das Spiel
    if (typeof world !== 'undefined' && world) {
        world.clearAllIntervals();
        world.gameStopped = true;
    }
    
    // Stoppe alle Sounds
    if (typeof SoundManager !== 'undefined') {
        SoundManager.stopAll();
    }
    
    // Reset Flags
    if (typeof winSoundPlayed !== 'undefined') winSoundPlayed = false;
    if (typeof loseSoundPlayed !== 'undefined') loseSoundPlayed = false;
    
    // Gehe zum Startscreen
    if (typeof drawStartScreen === 'function') {
        drawStartScreen();
    }
    
    console.log('🏠 Returned to main menu');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptionsModal);
} else {
    initOptionsModal();
}
