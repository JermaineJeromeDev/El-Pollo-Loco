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
 * Displays the default tab content by showing the story section and hiding the controls section.
 * Removes the 'd-none' class and sets display to 'block' for the story content element,
 * and adds the 'd-none' class to the controls content element.
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
 * Sets the "Story" tab as the active tab in the game menu.
 * Removes the "active" class from all tab buttons and adds it to the "Story" tab.
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
 * Displays the options modal, pauses the game and sound, and initializes modal state.
 * - Pauses the game and sound.
 * - Shows the options modal with a transition.
 * - Sets the container to modal state.
 * - Displays the default tab content.
 * - Sets the active tab to "Story".
 * - Logs modal opening to the console.
 *
 * @function
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
 * Hides the options modal with a transition, removes modal state from the container,
 * and resumes the game and sound. Logs the action to the console.
 *
 * @function hideOptionsModal
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
 * Handles the action of returning to the main menu tab.
 * Hides the options modal and navigates back to the menu from the game.
 */
function handleBackToMenuTab() {
    hideOptionsModal();
    backToMenuFromGame();
}

/**
 * Hides all elements with the class 'tab-content' by adding the 'd-none' class
 * and setting their display style to 'none'.
 */
function hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('d-none');
        content.style.display = 'none';
    });
}

/**
 * Returns the content element associated with a given tab ID.
 *
 * @param {string} tabId - The ID of the tab for which to retrieve the content element.
 * @returns {HTMLElement|null} The corresponding content element, or null if not found.
 */
function getContentElement(tabId) {
    const mapping = {
        'tab-story': 'story-content',
        'tab-controls': 'controls-content'
    };
    const contentId = mapping[tabId];
    return contentId ? document.getElementById(contentId) : null;
}

/**
 * Displays the specified HTML element by removing the 'd-none' class and setting its display style to 'block'.
 *
 * @param {HTMLElement} element - The DOM element to show. If null or undefined, the function does nothing.
 */
function showContent(element) {
    if (!element) return;
    element.classList.remove('d-none');
    element.style.display = 'block';
}

/**
 * Displays the content associated with the specified tab.
 *
 * @param {string} tabId - The identifier of the tab whose content should be shown.
 */
function showTabContent(tabId) {
    const content = getContentElement(tabId);
    showContent(content);
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
 * Attaches a click event listener to the options button at the top of the page.
 * When the button is clicked, the `handleOptionsButtonClick` function is invoked.
 * 
 * @function
 */
function attachOptionsButtonListener() {
    const optionsTopBtn = document.getElementById('options-top-btn');
    if (optionsTopBtn) {
        optionsTopBtn.addEventListener('click', handleOptionsButtonClick);
    }
}

/**
 * Attaches a click event listener to the options close button.
 * When the button with ID 'options-close-btn' is clicked, the handleCloseButtonClick function is invoked.
 */
function attachCloseButtonListener() {
    const optionsCloseBtn = document.getElementById('options-close-btn');
    if (optionsCloseBtn) {
        optionsCloseBtn.addEventListener('click', handleCloseButtonClick);
    }
}

/**
 * Attaches a click event listener to the back menu tab element.
 * When the element with ID 'tab-back-menu' is clicked, the handleBackMenuButtonClick function is invoked.
 */
function attachBackMenuButtonListener() {
    const tabBackMenu = document.getElementById('tab-back-menu');
    if (tabBackMenu) {
        tabBackMenu.addEventListener('click', handleBackMenuButtonClick);
    }
}

/**
 * Attaches event listeners to modal-related buttons, including options, close, and back menu buttons.
 * Ensures that the modal UI responds to user interactions appropriately.
 */
function attachModalEventListeners() {
    attachOptionsButtonListener();
    attachCloseButtonListener();
    attachBackMenuButtonListener();
}

/**
 * Initializes the options modal by attaching event listeners and setting up the tab system.
 * Should be called when the options modal needs to be prepared for user interaction.
 */
function initOptionsModal() {
    attachModalEventListeners();
    initTabSystem();
}

/**
 * Retrieves all elements with the class 'tab-btn' from the document.
 *
 * @returns {NodeListOf<Element>} A NodeList containing all tab button elements.
 */
function getAllTabs() {
    return document.querySelectorAll('.tab-btn');
}

/**
 * Determines whether a tab click should be ignored based on the tab's tag name.
 * Ignores the click if the tab is an anchor element ('A').
 *
 * @param {HTMLElement} tab - The tab element to check.
 * @returns {boolean} True if the tab click should be ignored; otherwise, false.
 */
function shouldIgnoreTabClick(tab) {
    return tab.tagName === 'A';
}

/**
 * Checks if the given tab element is the "back menu" tab.
 *
 * @param {Object} tab - The tab object to check.
 * @param {string} tab.id - The ID of the tab.
 * @returns {boolean} Returns true if the tab's ID is 'tab-back-menu', otherwise false.
 */
function isBackMenuTab(tab) {
    return tab.id === 'tab-back-menu';
}

/**
 * Registers a click event listener on the given tab element.
 * Handles tab click events, including ignoring certain tabs,
 * navigating back to the menu, and handling regular tab clicks.
 *
 * @param {HTMLElement} tab - The tab element to register the click event for.
 */
function registerTabClick(tab) {
    tab.addEventListener('click', (event) => {
        if (shouldIgnoreTabClick(tab)) return;
        event.preventDefault();
        if (isBackMenuTab(tab)) {
            handleBackToMenuTab();
            return;
        }
        handleTabClick(tab);
    });
}

/**
 * Initializes the tab system by retrieving all tabs and registering click events for each tab.
 * This function sets up the necessary event listeners to enable tab navigation.
 */
function initTabSystem() {
    const tabs = getAllTabs();
    tabs.forEach(registerTabClick);
}

/**
 * Deactivates all tabs by removing the 'active' class and setting 'aria-selected' to 'false'.
 *
 * @param {HTMLElement[]} tabs - An array of tab elements to deactivate.
 */
function deactivateAllTabs(tabs) {
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
}

/**
 * Hides all provided DOM elements by adding the 'd-none' CSS class to each.
 *
 * @param {HTMLElement[]} contents - An array of DOM elements to hide.
 */
function hideAllContents(contents) {
    contents.forEach(content => content.classList.add('d-none'));
}

/**
 * Activates a tab element by adding the 'active' class, setting its 'aria-selected' attribute to true,
 * and displaying the associated content element by removing the 'd-none' class.
 *
 * @param {HTMLElement} tab - The tab element to activate.
 */
function activateTab(tab) {
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const targetId = tab.id.replace('tab-', '') + '-content';
    const targetContent = document.getElementById(targetId);
    if (targetContent) targetContent.classList.remove('d-none');
}

/**
 * Handles the click event for a tab button.
 * Deactivates all tabs, hides all tab contents, and activates the clicked tab.
 *
 * @param {HTMLElement} clickedTab - The tab button element that was clicked.
 */
function handleTabClick(clickedTab) {
    const allTabs = document.querySelectorAll('.tab-btn');
    const allContents = document.querySelectorAll('.tab-content');
    deactivateAllTabs(allTabs);
    hideAllContents(allContents);
    activateTab(clickedTab);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptionsModal);
} else {
    initOptionsModal();
}