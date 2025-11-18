/**
 * Pauses game and sound
 */
function pauseGameAndSound() {
    if (typeof pauseGame === 'function' && typeof world !== 'undefined' && world) {
        pauseGame();
    }
    if (typeof SoundManager !== 'undefined') {
        SoundManager.pauseAll();
    }
}

/**
 * Shows modal with transition
 * @param {HTMLElement} modal - Modal element
 */
function showModalWithTransition(modal) {
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    }, 10);
}

/**
 * Sets container modal state
 * @param {HTMLElement} container - Container element
 */
function setContainerModalState(container) {
    if (container) {
        container.classList.add('modal-open');
    }
}

/**
 * Shows default tab content (story)
 */
function showDefaultTabContent() {
    const storyContent = document.getElementById('story-content');
    const controlsContent = document.getElementById('controls-content');
    if (storyContent) {
        storyContent.classList.remove('d-none');
        storyContent.style.display = 'block';
    }
    if (controlsContent) {
        controlsContent.classList.add('d-none');
    }
}

/**
 * Sets active tab to story
 */
function setActiveTabToStory() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const storyTab = document.getElementById('tab-story');
    if (storyTab) {
        storyTab.classList.add('active');
    }
}

/**
 * Shows the options modal
 */
function showOptionsModal() {
    pauseGameAndSound();
    const modal = document.getElementById('options-modal');
    if (!modal) {
        console.error('Options modal (#options-modal) not found!');
        return;
    }
    const container = document.querySelector('.container');
    showModalWithTransition(modal);
    setContainerModalState(container);
    showDefaultTabContent();
    setActiveTabToStory();
    console.log('Modal opened - Game & Sound paused');
}

/**
 * Hides modal (CSS handles transition)
 * @param {HTMLElement} modal - Modal element
 */
function hideModalWithTransition(modal) {
    modal.classList.add('modal-closing');
    setTimeout(() => {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }, 300);
}

/**
 * Removes container modal state
 * @param {HTMLElement} container - Container element
 */
function removeContainerModalState(container) {
    if (container) {
        container.classList.remove('modal-open');
    }
}

/**
 * Resumes game and sound
 */
function resumeGameAndSound() {
    if (typeof resumeGame === 'function' && typeof world !== 'undefined' && world) {
        resumeGame();
    }
    if (typeof SoundManager !== 'undefined') {
        SoundManager.resumeAll();
    }
}

/**
 * Hides the options modal
 */
function hideOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.querySelector('.container');
    if (!modal) return;
    
    hideModalWithTransition(modal);
    removeContainerModalState(container);
    resumeGameAndSound();
    
    console.log('Modal closed - Game & Sound resumed');
}

/**
 * Handles back to menu tab action
 */
function handleBackToMenuTab() {
    hideOptionsModal();
    backToMenuFromGame();
}

/**
 * Deactivates all tab buttons
 * @param {NodeList} tabButtons - All tab buttons
 */
function deactivateAllTabs(tabButtons) {
    tabButtons.forEach(b => b.classList.remove('active'));
}

/**
 * Hides all tab contents
 */
function hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('d-none');
        content.style.display = 'none';
    });
}

/**
 * Shows specific tab content
 * @param {string} tabId - Tab ID
 */
function showTabContent(tabId) {
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
}

/**
 * Handles options button click
 * @param {MouseEvent} clickEvent - Click event
 */
function handleOptionsButtonClick(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    showOptionsModal();
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

/**
 * Handles close button click
 * @param {MouseEvent} clickEvent - Click event
 */
function handleCloseButtonClick(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    hideOptionsModal();
}

/**
 * Handles back to menu button click
 * @param {MouseEvent} clickEvent - Click event
 */
function handleBackMenuButtonClick(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    hideOptionsModal();
    backToMenuFromGame();
}

/**
 * Attaches options button listener
 */
function attachOptionsButtonListener() {
    const optionsTopBtn = document.getElementById('options-top-btn');
    if (optionsTopBtn) {
        optionsTopBtn.addEventListener('click', handleOptionsButtonClick);
    } else {
        console.warn('Options button (#options-top-btn) not found!');
    }
}

/**
 * Attaches close button listener
 */
function attachCloseButtonListener() {
    const optionsCloseBtn = document.getElementById('options-close-btn');
    if (optionsCloseBtn) {
        optionsCloseBtn.addEventListener('click', handleCloseButtonClick);
    }
}

/**
 * Attaches back to menu button listener
 */
function attachBackMenuButtonListener() {
    const tabBackMenu = document.getElementById('tab-back-menu');
    if (tabBackMenu) {
        tabBackMenu.addEventListener('click', handleBackMenuButtonClick);
    }
}

/**
 * Attaches all modal event listeners
 */
function attachModalEventListeners() {
    attachOptionsButtonListener();
    attachCloseButtonListener();
    attachBackMenuButtonListener();
}

/**
 * Initializes the options modal and its event listeners
 */
function initOptionsModal() {
    attachModalEventListeners();
    initTabSystem();
}

/**
 * Handles tab click event
 * @param {MouseEvent} clickEvent - Click event
 * @param {HTMLElement} button - Button element
 * @param {NodeList} allTabButtons - All tab buttons
 */
function handleTabClick(clickEvent, button, allTabButtons) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    const tabId = button.id;
    if (tabId === 'tab-back-menu') {
        handleBackToMenuTab();
        return;
    }
    deactivateAllTabs(allTabButtons);
    button.classList.add('active');
    hideAllTabContents();
    showTabContent(tabId);
}

/**
 * Initializes the tab system
 */
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn:not(a)');
    tabButtons.forEach(button => {
        button.addEventListener('click', (clickEvent) => handleTabClick(clickEvent, button, tabButtons));
    });
}

/**
 * Stops the running game world
 */
function stopGameWorld() {
    if (typeof world !== 'undefined' && world) {
        world.clearAllIntervals();
        world.gameStopped = true;
    }
}

/**
 * Stops all game sounds
 */
function stopAllGameSounds() {
    if (typeof SoundManager !== 'undefined') {
        SoundManager.stopAll();
    }
}

/**
 * Resets win/lose sound flags
 */
function resetSoundFlags() {
    if (typeof winSoundPlayed !== 'undefined') winSoundPlayed = false;
    if (typeof loseSoundPlayed !== 'undefined') loseSoundPlayed = false;
}

/**
 * Navigates to start screen
 */
function navigateToStartScreen() {
    if (typeof drawStartScreen === 'function') {
        drawStartScreen();
    }
}

/**
 * Goes back to main menu from game
 */
function backToMenuFromGame() {
    stopGameWorld();
    stopAllGameSounds();
    resetSoundFlags();
    navigateToStartScreen();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptionsModal);
} else {
    initOptionsModal();
}
