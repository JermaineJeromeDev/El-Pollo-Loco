# El Pollo Loco 🐔🌶️

[🇬🇧 English](#english) | [🇩🇪 Deutsch](#deutsch)

---

## English

A classic jump'n'run game developed with **HTML5 Canvas** and **Vanilla JavaScript**.

### 📖 Game Description

In a world full of feathers and chaos, a true hero rises against the chicken army! Pepe must fight through dangerous enemies, collect coins, and defeat the mighty endboss.

#### Story
Three enemy types stand in your way:
- **Small Chicks** - Fast and agile
- **Normal Chickens** - Sturdy and dangerous
- **The Endboss** - A mighty enemy with enormous strength

Trample the small and normal enemies with precise jumps from above. But the endboss is different – only targeted bottle throws can break his power!

⚠️ **Important:** Use your resources wisely – those who waste everything will have no chance in the final battle.

---

### 🎮 Game Mechanics

#### Desktop Controls
- **← →** - Move left/right
- **Spacebar** - Jump
- **D** - Throw bottle

#### Mobile Controls
- **Touch Buttons** - Left, Right, Jump, Throw
- **Auto-Fullscreen** on mobile devices

#### Game Objective
1. Collect **coins** and **bottles**
2. Defeat enemies by **jumping from above**
3. Defeat the **endboss** with **bottle throws**
4. Survive until the end!

---

### 🏗️ Technical Details

#### Architecture

**Class Hierarchy:**
```
DrawableObject (Base for drawable objects)
└── MovableObject (Base for movable objects)
    ├── Character (Player)
    ├── Chicken (Normal Chicken)
    ├── ChickenSmall (Small Chicken)
    ├── Endboss (Boss Enemy)
    ├── ThrowableObject (Thrown Bottle)
    ├── Cloud (Clouds)
    ├── Coin (Coins)
    └── Bottle (Collectible Bottles)

StatusBar Variants:
├── StatusBarHealth (Health Energy)
├── StatusBarCoins (Coins)
├── StatusBarBottles (Bottles)
└── StatusBarEndboss (Endboss Health)
```

#### Technology Stack
- **HTML5 Canvas** - Rendering
- **Vanilla JavaScript (ES6)** - Game Logic
- **CSS3** - Responsive Design
- **JSDoc** - Code Documentation

#### Features
✅ **Object-Oriented Programming** - Clean Code with Classes  
✅ **Responsive Design** - Optimized for Desktop & Mobile  
✅ **Sound System** - SoundManager with Mute Function  
✅ **Pause Function** - Pause game via Options Modal  
✅ **Fullscreen Mode** - Immersive Gaming Experience  
✅ **Collision Detection** - Precise Hitboxes with Offsets  
✅ **Animation System** - Frame-based Animations  
✅ **Status Bars** - Real-time Display of Health, Coins, Bottles  

---

### 📂 Project Structure

```
El Pollo Loco/
├── assets/               # Images, Sounds, Fonts
│   ├── img/
│   ├── audio/
│   └── fonts/
├── classes/              # JavaScript Classes
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── endboss.class.js
│   ├── world.class.js
│   └── ...
├── js/                   # JavaScript Modules
│   ├── game.js          # Main Game Logic
│   ├── sounds.js        # Sound Manager
│   ├── game-menu.js     # Menu System
│   └── game-ui.js       # UI Functions
├── levels/               # Level Definitions
│   └── level1.js
├── styles/               # CSS Modules
│   ├── base.css
│   ├── ui-components.css
│   └── ...
├── index.html            # Main HTML
├── style.css             # CSS Import
├── jsdoc.json            # JSDoc Configuration
└── README.md             # This File
```

---

### 🚀 Installation & Execution

#### 1. Clone Repository
```bash
git clone <repository-url>
cd "El Pollo Loco"
```

#### 2. Start Live Server

**Option A - VS Code Live Server:**
1. Right-click on `index.html`
2. Select "Open with Live Server"

**Option B - Python HTTP Server:**
```bash
python -m http.server 8000
# Open: http://localhost:8000
```

#### 3. Open Game in Browser
```
http://127.0.0.1:5500/index.html
```

---

### 📚 Generate Documentation

#### Install JSDoc
```bash
npm install -g jsdoc
```

#### Create Documentation
```bash
jsdoc -c jsdoc.json
```

#### Open Documentation
```bash
# Windows
start docs/index.html

# Mac/Linux
open docs/index.html
```

The generated documentation contains:
- All classes with descriptions
- Methods with parameters and return values
- Class hierarchy
- Code examples

---

### 🎨 Features in Detail

#### Sound System
```javascript
SoundManager.load('jump', [{ src: 'path/to/jump.mp3', type: 'audio/mpeg' }]);
SoundManager.play('jump', 0.5, true); // name, volume, allowOverlap
SoundManager.pauseAll(); // Pauses all sounds
```

#### Collision Detection
```javascript
character.isColliding(enemy); // Checks collision with offset
```

#### Animation System
```javascript
character.playAnimation(IMAGES_WALKING); // Frame-based
```

---

### 🐛 Known Issues & Solutions

#### Issue: Sounds not working
**Solution:** Browser autoplay policy - user must interact once

#### Issue: Mobile buttons not visible
**Solution:** Only in landscape mode on devices ≤ 1200px

#### Issue: Fullscreen not working
**Solution:** User interaction required (button click)

---

### 📝 Code Guidelines

#### Clean Code Principles
✅ Each function max. **14 lines**  
✅ One function = **one task**  
✅ **Meaningful names** for variables & functions  
✅ **JSDoc comments** for all public methods  
✅ **DRY principle** - Don't Repeat Yourself  

#### Example
```javascript
/**
 * Handles chicken hit by bottle
 * @param {Chicken} enemy - Chicken enemy
 * @param {number} enemyIndex - Index in enemies array
 */
handleChickenHitByBottle(enemy, enemyIndex) {
    enemy.energy = 0;
    enemy.die && enemy.die();
    setTimeout(() => {
        this.level.enemies.splice(enemyIndex, 1);
    }, 1000);
}
```

---

### 👨‍💻 Autor

Entwickelt mit ❤️ als Lernprojekt für objektorientiertes JavaScript und Game Development.

---

### 📄 Lizenz

Dieses Projekt ist ein Lernprojekt und steht unter der MIT-Lizenz.

---

### 🙏 Credits

- **Grafiken & Assets** - Developer Akademie
- **Sounds** - Freesound.org
- **Fonts** - Luckiest Guy, Fredoka (Google Fonts)

---

### 🔗 Links

- [Impressum](impressum.html)
- [Datenschutz](datenschutz.html)
- [JSDoc Dokumentation](docs/index.html)

---

## Deutsch

<details>
<summary>Klicke hier für die deutsche Anleitung</summary>

Ein klassisches Jump'n'Run-Spiel entwickelt mit **HTML5 Canvas** und **Vanilla JavaScript**.

### 📖 Spielbeschreibung

In einer Welt voller Federn und Chaos erhebt sich ein wahrer Held gegen die Hühnerarmee! Pepe muss sich durch gefährliche Gegner kämpfen, Münzen sammeln und den mächtigen Endboss besiegen.

#### Story
Drei Gegnerarten stellen sich dir in den Weg:
- **Kleine Küken** - Schnell und wendig
- **Normale Hühner** - Standhaft und gefährlich  
- **Der Endboss** - Ein gewaltiger Gegner mit enormer Stärke

Zertrample die kleinen und normalen Gegner mit präzisen Sprüngen von oben. Doch der Endboss ist anders – nur gezielte Flaschenwürfe können seine Macht brechen!

⚠️ **Wichtig:** Setze deine Ressourcen mit Bedacht ein – wer alles verschleudert, wird im finalen Kampf keine Chance haben.

---

### 🎮 Spielmechanik

#### Steuerung Desktop
- **← →** - Bewegung links/rechts
- **Leertaste** - Springen
- **D** - Flasche werfen

#### Steuerung Mobile
- **Touch-Buttons** - Links, Rechts, Springen, Werfen
- **Auto-Fullscreen** auf mobilen Geräten

#### Spielziel
1. Sammle **Münzen** und **Flaschen**
2. Besiege Gegner durch **Sprünge von oben**
3. Besiege den **Endboss** mit **Flaschenwürfen**
4. Überlebe bis zum Ende!

---

### 🏗️ Technische Details

#### Architektur

**Klassen-Hierarchie:**
```
DrawableObject (Basis für zeichenbare Objekte)
└── MovableObject (Basis für bewegbare Objekte)
    ├── Character (Spieler)
    ├── Chicken (Normales Huhn)
    ├── ChickenSmall (Kleines Huhn)
    ├── Endboss (Boss-Gegner)
    ├── ThrowableObject (Geworfene Flasche)
    ├── Cloud (Wolken)
    ├── Coin (Münzen)
    └── Bottle (Sammelbare Flaschen)

StatusBar-Varianten:
├── StatusBarHealth (Lebensenergie)
├── StatusBarCoins (Münzen)
├── StatusBarBottles (Flaschen)
└── StatusBarEndboss (Endboss-Leben)
```

#### Technologie-Stack
- **HTML5 Canvas** - Rendering
- **Vanilla JavaScript (ES6)** - Spiellogik
- **CSS3** - Responsive Design
- **JSDoc** - Code-Dokumentation

#### Features
✅ **Object-Oriented Programming** - Clean Code mit Klassen  
✅ **Responsive Design** - Desktop & Mobile optimiert  
✅ **Sound-System** - SoundManager mit Mute-Funktion  
✅ **Pause-Funktion** - Spiel anhalten über Options-Modal  
✅ **Fullscreen-Modus** - Immersives Spielerlebnis  
✅ **Collision Detection** - Präzise Hitboxen mit Offsets  
✅ **Animation System** - Frame-basierte Animationen  
✅ **Status Bars** - Echtzeit-Anzeige von Leben, Coins, Flaschen  

---

### 📂 Projektstruktur

```
El Pollo Loco/
├── assets/               # Bilder, Sounds, Fonts
│   ├── img/
│   ├── audio/
│   └── fonts/
├── classes/              # JavaScript-Klassen
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── endboss.class.js
│   ├── world.class.js
│   └── ...
├── js/                   # JavaScript-Module
│   ├── game.js          # Hauptspiel-Logik
│   ├── sounds.js        # Sound-Manager
│   ├── game-menu.js     # Menü-System
│   └── game-ui.js       # UI-Funktionen
├── levels/               # Level-Definitionen
│   └── level1.js
├── styles/               # CSS-Module
│   ├── base.css
│   ├── ui-components.css
│   └── ...
├── index.html            # Haupt-HTML
├── style.css             # CSS-Import
├── jsdoc.json            # JSDoc-Konfiguration
└── README.md             # Diese Datei
```

---

### 🚀 Installation & Ausführung

#### 1. Repository klonen
```bash
git clone <repository-url>
cd "El Pollo Loco"
```

#### 2. Live Server starten

**Option A - VS Code Live Server:**
1. Rechtsklick auf `index.html`
2. "Open with Live Server" wählen

**Option B - Python HTTP Server:**
```bash
python -m http.server 8000
# Öffne: http://localhost:8000
```

#### 3. Spiel im Browser öffnen
```
http://127.0.0.1:5500/index.html
```

---

### 📚 Dokumentation generieren

#### JSDoc installieren
```bash
npm install -g jsdoc
```

#### Dokumentation erstellen
```bash
jsdoc -c jsdoc.json
```

#### Dokumentation öffnen
```bash
# Windows
start docs/index.html

# Mac/Linux
open docs/index.html
```

Die generierte Dokumentation enthält:
- Alle Klassen mit Beschreibungen
- Methoden mit Parametern und Rückgabewerten
- Klassen-Hierarchie
- Code-Beispiele

---

### 🎨 Features im Detail

#### Sound-System
```javascript
SoundManager.load('jump', [{ src: 'path/to/jump.mp3', type: 'audio/mpeg' }]);
SoundManager.play('jump', 0.5, true); // name, volume, allowOverlap
SoundManager.pauseAll(); // Pausiert alle Sounds
```

#### Collision Detection
```javascript
character.isColliding(enemy); // Prüft Kollision mit Offset
```

#### Animation System
```javascript
character.playAnimation(IMAGES_WALKING); // Frame-basiert
```

---

### 🐛 Bekannte Probleme & Lösungen

#### Problem: Sounds funktionieren nicht
**Lösung:** Browser-Autoplay-Policy - User muss einmal interagieren

#### Problem: Mobile Buttons nicht sichtbar
**Lösung:** Nur in Landscape-Modus auf Geräten ≤ 1200px

#### Problem: Fullscreen funktioniert nicht
**Lösung:** User-Interaktion erforderlich (Button-Klick)

---

### 📝 Code-Richtlinien

#### Clean Code Principles
✅ Jede Funktion max. **14 Zeilen**  
✅ Eine Funktion = **eine Aufgabe**  
✅ **Sprechende Namen** für Variablen & Funktionen  
✅ **JSDoc-Kommentare** für alle öffentlichen Methoden  
✅ **DRY-Prinzip** - Don't Repeat Yourself  

#### Beispiel
```javascript
/**
 * Handles chicken hit by bottle
 * @param {Chicken} enemy - Chicken enemy
 * @param {number} enemyIndex - Index in enemies array
 */
handleChickenHitByBottle(enemy, enemyIndex) {
    enemy.energy = 0;
    enemy.die && enemy.die();
    setTimeout(() => {
        this.level.enemies.splice(enemyIndex, 1);
    }, 1000);
}
```

---

### 👨‍💻 Autor

Entwickelt mit ❤️ als Lernprojekt für objektorientiertes JavaScript und Game Development.

---

### 📄 Lizenz

Dieses Projekt ist ein Lernprojekt und steht unter der MIT-Lizenz.

---

### 🙏 Credits

- **Grafiken & Assets** - Developer Akademie
- **Sounds** - Freesound.org
- **Fonts** - Luckiest Guy, Fredoka (Google Fonts)

---

### 🔗 Links

- [Impressum](impressum.html)
- [Datenschutz](datenschutz.html)
- [JSDoc Dokumentation](docs/index.html)

---