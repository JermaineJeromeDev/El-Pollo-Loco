/**
 * Updates the position of the top controls icon relative to the canvas within the container.
 * Calculates the top and right offsets based on the bounding rectangles of the canvas and container,
 * and applies them to the top-controls element's style.
 * If either the container or top-controls element is not found, the function exits early.
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
 * Updates the visibility of the rotate screen hint based on the device's orientation and screen size.
 * Shows the hint if the device is in portrait mode and has a small screen (width ≤ 768px),
 * otherwise hides the hint.
 *
 * @function
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
 * Shows the rotation hint
 * @param {HTMLElement} rotateHint - The rotate hint element
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
 * Hides the rotation hint
 * @param {HTMLElement} rotateHint - The rotate hint element
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
 * Prevents scroll events
 * @param {Event} e - Touch event
 */
function preventScroll(event
) {
    event.preventDefault();
}
