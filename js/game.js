let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameIsMuted = false;
let gameState = 'start';
let menuButtons = [];
let isFullscreen = false;
let hoveredButtonIndex = -1;

let winSoundPlayed = false;
let loseSoundPlayed = false;

// ====================== INIT ======================
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Sounds laden
    SoundManager.load('jump', [{ src: 'audio/1_character/jump.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('throw', [{ src: 'audio/4_bottle/throw.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('break', [{ src: 'audio/4_bottle/break.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('hurt', [{ src: 'audio/1_character/hurt.mp3', type: 'audio/mpeg' }]);
    SoundManager.load('lose', [{ src: 'audio/5_win_lose/lose.wav', type: 'audio/wav' }]);
    SoundManager.load('win', [{ src: 'audio/5_win_lose/win.wav', type: 'audio/wav' }]);
    SoundManager.load('gameplay', [{ src: 'audio/0_gameplay/gamesound.wav', type: 'audio/mpeg' }]);
    SoundManager.load('coin', [{ src: 'audio/3_coin/collect.wav', type: 'audio/wav' }]);

    // Event-Listener für Menü
    setupCanvasListeners();

    // Mobile Buttons prüfen
    updateMobileBtnsVisibility();
    window.addEventListener('resize', updateMobileBtnsVisibility);
    window.addEventListener('orientationchange', updateMobileBtnsVisibility);

    // Startscreen anzeigen
    drawStartScreen();
}

// ====================== CANVAS LISTENERS ======================
function setupCanvasListeners() {
    if (!canvas._listenersAdded) {
        canvas.addEventListener('click', handleMenuClick);
        canvas.addEventListener('mousemove', handleMenuHover);
        canvas._listenersAdded = true;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function handleMenuClick(event) {
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    menuButtons.forEach(btn => {
        if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
            btn.onClick();
        }
    });
}

function handleMenuHover(event) {
    if (!['start', 'options', 'win', 'lose'].includes(gameState)) return;
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    hoveredButtonIndex = -1;
    menuButtons.forEach((btn, idx) => {
        if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
            hoveredButtonIndex = idx;
        }
    });

    if (gameState === 'start') drawStartScreen();
    if (gameState === 'options') drawOptionsScreen();
    if (gameState === 'win') showWinScreen();
    if (gameState === 'lose') showLoseScreen();
}

// ====================== KEYBOARD HANDLING ======================
function handleKeyDown(event) {
    if (event.key === 'Escape') toggleFullscreen();
    if (gameState !== 'playing') return;

    if (event.keyCode === 37) keyboard.LEFT = true;
    if (event.keyCode === 38) keyboard.UP = true;
    if (event.keyCode === 39) keyboard.RIGHT = true;
    if (event.keyCode === 40) keyboard.DOWN = true;
    if (event.keyCode === 32) keyboard.SPACE = true;
    if (event.keyCode === 68) keyboard.D = true; 
}

function handleKeyUp(event) {
    if (gameState !== 'playing') return;

    if (event.keyCode === 37) keyboard.LEFT = false;
    if (event.keyCode === 38) keyboard.UP = false;
    if (event.keyCode === 39) keyboard.RIGHT = false;
    if (event.keyCode === 40) keyboard.DOWN = false;
    if (event.keyCode === 32) keyboard.SPACE = false;
    if (event.keyCode === 68) keyboard.D = false; 
}


// ====================== SCREENS ======================
function drawStartScreen() {
    gameState = 'start';
    let bg = new Image();
    bg.src = 'assets/img/9_intro_outro_screens/start/startscreen_2.png';
    bg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        setupStartMenuButtons();
        drawMenuButtons();
    };
}

function setupStartMenuButtons() {
    let buttonWidth = 160, buttonHeight = 50, gap = 30;
    let totalWidth = buttonWidth * 3 + gap * 2;
    let startX = (canvas.width - totalWidth) / 2;
    let y = canvas.height - 120;

    menuButtons = [
        { text: 'Start', x: startX, y: y, w: buttonWidth, h: buttonHeight, onClick: () => { gameState='playing'; menuButtons=[]; startGame(); }},
        { text: 'Optionen', x: startX+buttonWidth+gap, y:y, w:buttonWidth, h:buttonHeight, onClick: drawOptionsScreen},
        { text: gameIsMuted ? 'Unmute':'Mute', x:startX+2*(buttonWidth+gap), y:y, w:buttonWidth, h:buttonHeight, onClick:()=>{gameIsMuted=!gameIsMuted; drawStartScreen();}},
        { text: isFullscreen?'Kleiner Screen':'Fullscreen', x: canvas.width-170, y:20, w:150, h:40, onClick: toggleFullscreen }
    ];
}

function drawOptionsScreen() {
    gameState='options';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#222"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#fff"; ctx.font="bold 36px Arial"; ctx.textAlign="center";
    ctx.fillText("Optionen", canvas.width/2,100);
    ctx.font="20px Arial"; ctx.fillText("Hier könnten Optionen stehen.", canvas.width/2,180);

    menuButtons=[{text:"Zurück", x:canvas.width/2-90, y:canvas.height-100, w:180, h:60, onClick: drawStartScreen}];
    drawMenuButtons();
}

function showWinScreen() {
    gameState='win';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    SoundManager.stopGameplay();
    if(!gameIsMuted && !winSoundPlayed) { SoundManager.playWin(); winSoundPlayed = true; }

    let img=new Image();
    img.src='assets/img/You won, you lost/You Win A.png';
    img.onload = ()=>{
        ctx.drawImage(img, (canvas.width-img.width*0.6)/2, (canvas.height-img.height*0.6)/2, img.width*0.6, img.height*0.6);
        drawWinLoseButtons();
    };

    menuButtons=[
        {text:'Nochmal spielen', x:canvas.width/2-180, y:canvas.height-100, w:160, h:50, onClick:()=>{winSoundPlayed=false; drawStartScreen();}},
        {text:isFullscreen?'Kleiner Screen':'Fullscreen', x:canvas.width/2+20, y:canvas.height-100, w:160, h:50, onClick:toggleFullscreen}
    ];
}

function showLoseScreen() {
    gameState='lose';
    ctx.clearRect(0,0,canvas.width,canvas.height);

    SoundManager.stopGameplay();
    if(!gameIsMuted && !loseSoundPlayed) { SoundManager.playLose(); loseSoundPlayed = true; }

    let img=new Image();
    img.src='assets/img/9_intro_outro_screens/game_over/oh no you lost!.png';
    img.onload = ()=>{
        ctx.drawImage(img, (canvas.width-img.width*0.6)/2, (canvas.height-img.height*0.6)/2, img.width*0.6, img.height*0.6);
        drawWinLoseButtons();
    };

    menuButtons=[
        {text:'Nochmal spielen', x:canvas.width/2-180, y:canvas.height-100, w:160, h:50, onClick:()=>{loseSoundPlayed=false; startGame();}},
        {text:isFullscreen?'Kleiner Screen':'Fullscreen', x:canvas.width/2+20, y:canvas.height-100, w:160, h:50, onClick:toggleFullscreen}
    ];
}

// ====================== MENU DRAWING ======================
function drawMenuButtons() {
    menuButtons.forEach((btn, idx)=>{
        ctx.save();
        ctx.fillStyle=(idx===hoveredButtonIndex)?"#388e3c":"#43cea2";
        ctx.strokeStyle="#fff"; ctx.lineWidth=3;
        ctx.beginPath(); ctx.roundRect?ctx.roundRect(btn.x,btn.y,btn.w,btn.h,14):ctx.rect(btn.x,btn.y,btn.w,btn.h);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle="#fff"; ctx.font="bold 24px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(btn.text, btn.x+btn.w/2, btn.y+btn.h/2);
        ctx.restore();
    });
}

function drawWinLoseButtons() {
    menuButtons.forEach(btn=>{
        ctx.save();
        ctx.fillStyle="#4caf50"; ctx.strokeStyle="#fff"; ctx.lineWidth=2;
        ctx.fillRect(btn.x,btn.y,btn.w,btn.h); ctx.strokeRect(btn.x,btn.y,btn.w,btn.h);
        ctx.fillStyle="#fff"; ctx.font="bold 22px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(btn.text, btn.x+btn.w/2, btn.y+btn.h/2);
        ctx.restore();
    });
}

// ====================== GAME START ======================
function startGame() {
    canvas.classList.remove('fullscreen');
    canvas.width = 720; canvas.height = 480;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    world = new World(canvas, keyboard);
    world.showWinScreen = showWinScreen;
    world.showLoseScreen = showLoseScreen;
    if(world.character) world.character.loseScreenShown = false;
    gameState = 'playing';
    if(!gameIsMuted) SoundManager.playGameplay(); // starte Gameplay-Sound
}


// ====================== FULLSCREEN ======================
function toggleFullscreen() {
    isFullscreen=!isFullscreen;
    if(isFullscreen){ canvas.classList.add('fullscreen'); canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    else{ canvas.classList.remove('fullscreen'); canvas.width=720; canvas.height=480; }

    if(gameState==='start') drawStartScreen();
    if(gameState==='win') showWinScreen();
    if(gameState==='lose') showLoseScreen();
}

// ====================== MOBILE CHECK ======================
function isMobileLandscape() { return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && window.innerWidth>window.innerHeight; }
function updateMobileBtnsVisibility() {
    const mobileBtns=document.getElementById('mobile-btns');
    if(mobileBtns){ mobileBtns.style.display=isMobileLandscape()?'block':'none'; }
}

// ====================== START THE GAME ======================
window.addEventListener('DOMContentLoaded', init);

