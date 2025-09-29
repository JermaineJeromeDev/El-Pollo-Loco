let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    

    console.log('My Character is', world.character);
    
}


window.addEventListener('keydown', (e) => {
    if(e.key == 39) {
        keyboard.RIGHT = true;
    }

    if(e.key == 37) {
        keyboard.LEFT = true;
    }

    if(e.key == 38) {
        keyboard.UP = true;
    }

    if(e.key == 40) {
        keyboard.DOWN = true;
    }

    if(e.key == 32) {
        keyboard.SPACE = true;
    }
    console.log(e);
});


window.addEventListener('keyup', (e) => {
    if(e.key == 39) {
        keyboard.RIGHT = false;
    }

    if(e.key == 37) {
        keyboard.LEFT = false;
    }

    if(e.key == 38) {
        keyboard.UP = false;
    }

    if(e.key == 40) {
        keyboard.DOWN = false;
    }

    if(e.key == 32) {
        keyboard.SPACE = false;
    }
    console.log(e);
});