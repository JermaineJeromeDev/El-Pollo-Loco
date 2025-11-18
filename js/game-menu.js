/**
 * Shows the options modal
 */
function showOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.querySelector('.container');
    
    if (!modal) {
        console.error('Options modal (#options-modal) not found!');
        return;
    }
    
    // Modal sichtbar machen
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    // ENTFERNT: aria-hidden auf Modal - verursacht Warnung wegen fokussiertem Button
    
    // Container-Backdrop
    if (container) {
        container.classList.add('modal-open');
    }
    
    // WICHTIG: Zuerst Story-Content sichtbar machen
    const storyContent = document.getElementById('story-content');
    const controlsContent = document.getElementById('controls-content');
    
    if (storyContent) {
        storyContent.classList.remove('d-none');
        storyContent.style.display = 'block';
    }
    
    if (controlsContent) {
        controlsContent.classList.add('d-none');
    }
    
    // Story-Tab aktivieren
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const storyTab = document.getElementById('tab-story');
    if (storyTab) {
        storyTab.classList.add('active');
    }
    
    console.log('Modal opened:', {
        modalDisplay: modal.style.display,
        modalVisibility: modal.style.visibility,
        storyContentVisible: storyContent ? !storyContent.classList.contains('d-none') : 'NOT FOUND',
        storyContentDisplay: storyContent ? storyContent.style.display : 'NOT FOUND'
    });
}

/**
 * Hides the options modal
 */
function hideOptionsModal() {
    const modal = document.getElementById('options-modal');
    const container = document.querySelector('.container');
    
    if (!modal) return;
    
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    // ENTFERNT: aria-hidden wird nicht mehr gesetzt
    
    if (container) {
        container.classList.remove('modal-open');
    }
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
                if (typeof gameState !== 'undefined' && gameState === 'playing') {
                    if (typeof drawStartScreen === 'function') {
                        drawStartScreen();
                    }
                }
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
            if (typeof gameState !== 'undefined' && gameState === 'playing') {
                if (typeof drawStartScreen === 'function') {
                    drawStartScreen();
                }
            }
        });
    }
    
    initTabSystem();
    console.log('Options modal initialized');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptionsModal);
} else {
    initOptionsModal();
}
