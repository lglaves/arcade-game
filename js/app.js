// Variables
// BLOCK_WIDTH and BLOCK_HEIGHT are based on the engine.js
// method provided for creating the grid
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if (this.x < 505) {
        this.x = this.x + (this.speed * dt);
    } else {
        this.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create Player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = BLOCK_WIDTH/20;
    this.y = BLOCK_HEIGHT*5;
};

// Update Player's position
Player.prototype.update = function() {
    // Send player back to start if it reaches the water
    if (this.y <= 0) {
        this.y = BLOCK_HEIGHT * 5;
        console.log ('Reached water');
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //console.log('location' + this.x + ',' + this.y);
};

// lbg
// handleInput is the method for moving player on board
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > BLOCK_WIDTH/2) {
        this.x -= BLOCK_WIDTH;
    } else if (key === 'right' && this.x < 395) {
        this.x += BLOCK_WIDTH;
    } else if (key === 'up' && this.y > BLOCK_HEIGHT/2) {
        this.y -= BLOCK_HEIGHT;
    } else if (key === 'down' && this.y < BLOCK_HEIGHT*5) {
        this.y += BLOCK_HEIGHT;
    // Toggle Pause
    } else if (key === 'pause' && game.pause) {
        console.log('game.pause = ' + game.pause);
        console.log('now changing to false');
        game.pause = false;
    } else if (key === 'pause' && !game.pause) {
        console.log('game.pause = ' + game.pause);
        console.log('now changing to true');
        game.pause = true;
     }
     console.log('Player key='+ key);
     console.log('game = ' + game)
};

// Check for collisions
// Player.prototype.checkCollisions = function() {
//         //check collision with enemies
//         var enemies=allEnemies.length;
//         for (var i = 0; i < enemies;  i++) {
//             if (this.x < allEnemies[i].x + 50 && this.x + 50 > allEnemies[i].x &&
//                 this.y < allEnemies[i].y + 50 && this.y + 50 > allEnemies[i].y) {
//                 console.log('enemy hit');
//                 this.lifeOver();
//                 this.reset();
//             }
//         }

// }

// Enemy hit results in player death
// Player.prototype.lifeOver = function() {

// }

// Create Game class (template definition of object's properties and methods)
// This class requires play(), pause(), advanceLevel(), and gameOver() methods
var Game = function() {
    this.pause = false,
    this.gameLevel = 1,
    this.gameScore = 0,
    this.init();
};

// Initialize new game
Game.prototype.init = function () {
    this.player = new Player();
    this.allEnemies = [
        new Enemy(-100, 60, getRandomIntInclusive(200, 400)),
        new Enemy(-100, 180, getRandomIntInclusive(400, 700)),
        new Enemy(-100, 240, getRandomIntInclusive(700, 800)),
        new Enemy(-100, 120, getRandomIntInclusive(100, 800))
        ];
};


// If player wins round by reaching water safely, advance level
Game.prototype.update = function () {
     if (this.player.getsHome === true) {
         console.log ('Reached water');
     }

};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// handleInput is the method for moving player on board
// Game.prototype.handleInput = function(key) {
//     if (key === 'left' && this.player.x > BLOCK_WIDTH/2) {
//         this.player.x -= BLOCK_WIDTH;
//     } else if (key === 'right' && this.player.x < 395) {
//         this.player.x += BLOCK_WIDTH;
//     } else if (key === 'up' && this.player.y > BLOCK_HEIGHT/2) {
//         this.player.y -= BLOCK_HEIGHT;
//     } else if (key === 'down' && this.player.y < BLOCK_HEIGHT*5) {
//         this.player.y += BLOCK_HEIGHT;
//     // Toggle Pause
//     } else if (key === 'pause') {
//         console.log('key === SPACE');
//     } else if (key === 'pause' && this.pause === true) {
//         console.log('this.pause=' +this.pause+ 'now changing to false');
//         this.pause = false;
//     } else if (key === 'pause' && this.pause === false) {
//         console.log('this.pause=' +this.pause+ 'now changing to true');
//         this.pause = true;
//      }
//      console.log('Game key = ' + key);
// };


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'pause' // space key to pause play
    };
// lbg
    game.player.handleInput(allowedKeys[e.keyCode]);
});

// -----------------------------------------------
// Game constructor
// -----------------------------------------------
var game = new Game();