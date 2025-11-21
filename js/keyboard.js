/**
 * keyboard.js
 *
 * Handles player keyboard input during gameplay.
 * - Tracks keydown and keyup events for movement and actions.
 * - Updates the `keyboard` object with current key states.
 * - Only processes input when the game state is 'playing'.
 */

/**
 * Handles keydown events during gameplay.
 * Sets corresponding properties on the `keyboard` object to `true` based on the pressed key.
 * Only processes events if the game state is 'playing'.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeyDown(event) {
    if (gameState !== 'playing') return;
    if (event.code === 'ArrowLeft') keyboard.LEFT = true;
    if (event.code === 'ArrowRight') keyboard.RIGHT = true;
    if (event.code === 'Space') keyboard.SPACE = true;
    if (event.code === 'KeyD') keyboard.D = true;
}

/**
 * Handles keyup events
 */
/**
 * Handles the keyup event for game controls.
 * Updates the keyboard state by setting the corresponding key property to false
 * when the user releases a control key, but only if the game is currently playing.
 *
 * @param {KeyboardEvent} event - The keyup event object.
 */
function handleKeyUp(event) {
    if (gameState !== 'playing') return;
    if (event.code === 'ArrowLeft') keyboard.LEFT = false;
    if (event.code === 'ArrowRight') keyboard.RIGHT = false;
    if (event.code === 'Space') keyboard.SPACE = false;
    if (event.code === 'KeyD') keyboard.D = false;
}