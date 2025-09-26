let canvas;
let ctx;  // ctx Standardmäßige Abkürzung für Context
let character = new Character();
let enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken()
]


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    console.log('My Character is', character);
    
}