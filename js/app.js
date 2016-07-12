"use strict";

// Variables
// There will be 3 levels of game play, beginner, intermediate, expert
var level = "beginner";

// There will be 2 states of the game play: start and done
var state = "start";

// blockWidth and blockHeight are based on the engine.js
// method provided for creating the grid
var blockWidth = 101;
var blockHeight = 83;
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

// ToDo:  Generate Gems (Blue, Green, and Orange) and Heart and Star
//          Have these display in the grass for random time periods
//          and assign points that can be gained if collision of player
//          occurs

// Now write your own player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = blockWidth/20;
    this.y = blockHeight*5;
    //this.speed = 10;
};

// Update Player's position
Player.prototype.update = function() {
    // Send player back to start if it reaches the water
    if (this.y <= 0) {
        this.y = blockHeight * 5;
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log('location' + this.x + ',' + this.y);
};

// handleInput is the method for moving player on board
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > blockWidth/2) {
        this.x -= blockWidth;
    } else if (key === 'right' && this.x < 395) {
        this.x += blockWidth;
    } else if (key === 'up' && this.y > blockHeight/2) {
        this.y -= blockHeight;
    } else if (key === 'down' && this.y < blockHeight*5) {
        this.y += blockHeight;
    }
};


// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var enemy1 = new Enemy(-100, 60, getRandomIntInclusive(200, 400));
var enemy2 = new Enemy(-100, 180, getRandomIntInclusive(400, 700));
var enemy3 = new Enemy(-100, 240, getRandomIntInclusive(700, 800));
var enemy4 = new Enemy(-100, 120, getRandomIntInclusive(100, 800));
var allEnemies = [enemy1, enemy2, enemy3, enemy4];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
