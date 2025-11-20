/**
 * Sets up event listeners for canvas and window interactions.
 * Adds click, touch, mouse, and keyboard event handlers to manage game menu interactions
 * and user input. Canvas listeners are only added once to prevent duplicates.
 * 
 * @function setupCanvasListeners
 * @returns {void}
 */
function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('touchstart', handleMenuTouch, { passive: false });
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas._listenersAdded = true;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}