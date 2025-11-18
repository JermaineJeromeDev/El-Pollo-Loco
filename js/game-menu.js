/**
 * Initializes options button in top area
 */
function initOptionsTopButton() {
    const optBtn = document.getElementById('options-top-btn');
    if (!optBtn) return;
    
    setOptionsIcon(optBtn);
    addOptionsClickListener(optBtn);
}

/**
 * Sets options icon
 * @param {HTMLElement} btn - Options button
 */
function setOptionsIcon(btn) {
    const img = btn.querySelector('img');
    if (img) img.src = 'assets/img/10_button_icons/options.png';
}

/**
 * Adds click listener to options button
 * @param {HTMLElement} btn - Options button
 */
function addOptionsClickListener(btn) {
    btn.addEventListener('click', () => {
        if (gameState === 'playing' && world) {
            optionsOrigin = 'playing';
            openOptionsFromGameplay();
        } else {
            optionsOrigin = 'start';
            showOptionsModal();
        }
    });
}

/**
 * Initializes close button in modal
 */
function initOptionsCloseButton() {
    const closeBtn = document.getElementById('options-close-btn');
    if (!closeBtn) return;
    
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeOptions();
    });
}

/**
 * Initializes tab logic for options modal
 */
function initOptionsTabs() {
    const tabs = getTabsConfiguration();
    tabs.forEach(t => setupTabListener(t));
}

/**
 * Gets tabs configuration
 * @returns {Array} Tabs configuration
 */
function getTabsConfiguration() {
    return [
        { btnId: 'tab-story', paneId: 'story-content' },
        { btnId: 'tab-controls', paneId: 'controls-content' },
        { btnId: 'tab-back-menu', action: 'backToMenu' },
        { btnId: 'tab-imprint', paneId: 'imprint-content' },
        { btnId: 'tab-privacy', paneId: 'privacy-content' }
    ];
}

/**
 * Sets up listener for single tab
 * @param {Object} tabConfig - Tab configuration
 */
function setupTabListener(tabConfig) {
    const btn = document.getElementById(tabConfig.btnId);
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        handleTabClick(e, btn, tabConfig);
    });
}

/**
 * Handles tab click
 * @param {Event} e - Click event
 * @param {HTMLElement} btn - Tab button
 * @param {Object} config - Tab configuration
 */
function handleTabClick(e, btn, config) {
    if (isExternalLink(btn)) {
        deactivateAllTabs();
        return;
    }
    
    if (config.action === 'backToMenu') {
        e.preventDefault();
        handleBackToMenu();
        return;
    }
    
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    switchOptionsTab(config.btnId, config.paneId);
}

/**
 * Checks if button is external link
 * @param {HTMLElement} btn - Button element
 * @returns {boolean}
 */
function isExternalLink(btn) {
    return btn.tagName === 'A' && btn.getAttribute('target') === '_blank';
}

/**
 * Deactivates all tabs
 */
function deactivateAllTabs() {
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
}

/**
 * Handles "Back to Menu" action
 */
function handleBackToMenu() {
    closeModal();
    stopCurrentGame();
    resetGameState();
    drawStartScreen();
}

/**
 * Closes options modal
 */
function closeModal() {
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.classList.add('d-none');
        modal.classList.remove('fredoka-ui');
    }
    
    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.remove('modal-open');
}

/**
 * Stops current game
 */
function stopCurrentGame() {
    if (world) {
        world.clearAllIntervals();
        world.gameStopped = true;
        world = null;
    }
    SoundManager.stopAll();
}

/**
 * Resets game state variables
 */
function resetGameState() {
    gameState = 'start';
    optionsOrigin = null;
    winSoundPlayed = false;
    loseSoundPlayed = false;
    endScreenImage = null;
}

/**
 * Switches tab
 * @param {string} activeBtnId - Active button ID
 * @param {string} activePaneId - Active pane ID
 */
function switchOptionsTab(activeBtnId, activePaneId) {
    updateTabButtons(activeBtnId);
    updateTabPanes(activePaneId);
}

/**
 * Updates tab buttons
 * @param {string} activeBtnId - Active button ID
 */
function updateTabButtons(activeBtnId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        if (b.id === activeBtnId) {
            b.classList.add('active');
            b.setAttribute('aria-selected', 'true');
        } else {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        }
    });
}

/**
 * Updates tab panes
 * @param {string} activePaneId - Active pane ID
 */
function updateTabPanes(activePaneId) {
    document.querySelectorAll('.tab-content').forEach(p => {
        if (p.id === activePaneId) p.classList.remove('d-none');
        else p.classList.add('d-none');
    });
}

/**
 * Shows options modal
 */
function showOptionsModal() {
    gameState = 'options';
    const modal = document.getElementById('options-modal');
    if (!modal) return;

    showModal(modal);
    ensureDefaultTab();
}

/**
 * Shows modal element
 * @param {HTMLElement} modal - Modal element
 */
function showModal(modal) {
    modal.classList.remove('d-none');
    modal.classList.add('fredoka-ui');
    
    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.add('modal-open');
}

/**
 * Ensures default tab is visible
 */
function ensureDefaultTab() {
    const anyVisible = Array.from(document.querySelectorAll('.tab-content'))
        .some(p => !p.classList.contains('d-none'));
    
    if (!anyVisible) switchOptionsTab('tab-story', 'story-content');
}

/**
 * Opens options from gameplay
 */
function openOptionsFromGameplay() {
    if (!world) { 
        showOptionsModal(); 
        return; 
    }
    
    pauseGame();
    showOptionsModal();
}

/**
 * Pauses the game
 */
function pauseGame() {
    try { world.clearAllIntervals(); } catch(e) {}
    world.gameStopped = true;
    SoundManager.stopGameplay();
}

/**
 * Closes options and restores game
 */
function closeOptions() {
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.classList.add('d-none');
        modal.classList.remove('fredoka-ui');
    }

    const containerEl = document.querySelector('.container');
    if (containerEl) containerEl.classList.remove('modal-open');

    restoreGameState();
}

/**
 * Restores game state after closing options
 */
function restoreGameState() {
    if (optionsOrigin === 'playing' && world) {
        resumeGame();
    } else {
        drawStartScreen();
    }
    optionsOrigin = null;
}

/**
 * Resumes the game
 */
function resumeGame() {
    world.gameStopped = false;
    if (typeof world.run === 'function') world.run();
    if (typeof world.draw === 'function') world.draw();
    gameState = 'playing';
    if (!gameIsMuted) SoundManager.playGameplay();
}
