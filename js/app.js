//"use strict";

// Variables
// TILE_WIDTH and TILE_HEIGHT are based on the engine.js
// method provided for creating the grid
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
//var LIFE_NUMBER = 3;

/************************************************************************/
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
        this.x = Math.round(this.x + (this.speed * dt));
    } else {
        this.x = -100;
    }
    //console.log("inside Enemy Update, dt = " + dt + " x: " +this.x + "y: " + this.y);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/************************************************************************/
// Create Player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = (TILE_WIDTH/2) * 4; // Start game with player in center of lower row
    this.y = TILE_HEIGHT*5;
};

// Update Player's position
Player.prototype.update = function() {
    // Send player back to start if it reaches the water
    if (this.y <= 0) {
        //this.y = TILE_HEIGHT * 5; // reset to grass
        this.playerWins += 1;
        console.log ('Reached water!!!');
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handleInput is the method for moving player on board
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > TILE_WIDTH/2) {
        this.x -= TILE_WIDTH;
    } else if (key === 'right' && this.x < 395) {
        this.x += TILE_WIDTH;
    } else if (key === 'up' && this.y > TILE_HEIGHT/2) {
        this.y -= TILE_HEIGHT;
    } else if (key === 'down' && this.y < TILE_HEIGHT*5) {
        this.y += TILE_HEIGHT;
    // Toggle Pause
    } else if (key === 'pause' && game.pause) {
        game.pause = false;
    } else if (key === 'pause' && !game.pause) {
        game.pause = true;
    }
    //console.log('PLAYER: location x:' + this.x + ', y:' + this.y);
};

// Create Game class (template definition of object's properties and methods)
// This class requires play(), pause(), advanceLevel(), and gameOver() methods
var Game = function() {
    this.pause = false,
    this.gameLives = 3,
    this.gameLevel = 1,
    this.gamePoints = 300,
    this.collision = false;
    this.init();
    this.displayStatus();
};

// Initialize new game
Game.prototype.init = function () {
    this.player = new Player();
    this.allEnemies = [
        new Enemy(-100, 60, getRandomIntInclusive(100, 200)),
        new Enemy(-100, 60+TILE_HEIGHT, getRandomIntInclusive(200, 400)),
        new Enemy(-100, 60+(2*TILE_HEIGHT), getRandomIntInclusive(100, 300))
        ];
};

// Display Game Status
Game.prototype.displayStatus = function () {
    document.getElementById("score").innerHTML = '# of Lives: ' + this.gameLives + '   Game Level: ' + this.gameLevel + '   Game Points: ' + this.gamePoints;
    //document.getElementById("announce").innerHTML = "To win, move buddy to the water without bug collision.";
};

// Check for collisions
 Game.prototype.checkCollisions = function() {
    for (var i = 0; i < this.allEnemies.length; i++) {
         // Difference between Enemy and Player y locations is 23
         // Difference between Enemy and Player x locations must be calculated with enemy - player, due to enemies start at x = -100
        //console.log('PLAYER: location x:' + this.player.x + ', y:' + this.player.y); // TEST
        //console.log('ENEMY ' + i + ': location x:' + this.allEnemies[i].x + ', y:' + this.allEnemies[i].y); // TEST
        //console.log("X COLLISION Calc = " + Math.abs(this.allEnemies[i].x - this.player.x)); // TEST
        //console.log("Y COLLISION Calc = " + Math.abs(this.allEnemies[i].y - this.player.y)); // TEST
        if ((Math.abs(this.allEnemies[i].y - this.player.y) <= 23) && (Math.abs(this.allEnemies[i].x - this.player.x) < TILE_WIDTH)) {
            //console.log("COLLISION with bug at y: " + this.allEnemies[i].y ); // TEST
            //game.pause = true;
            // display notice

            //this.gameLives = this.gameLives - 1;
            game.displayStatus();
            this.collision = true;
            return;
        }
    }

 };

// Reset the game after ???
Game.prototype.resetGame = function() {
    // this.pause = false,
    // this.gameLives = 3,
    // this.gameLevel = 1,
    // this.gamePoints = 300,
    // this.init();
    // this.displayStatus();
    // document.getElementById("announce").innerHTML = "Highest score:  ?? !!";
};

// If player wins round by reaching water safely, add points, update stats, and return to home base
Game.prototype.update = function () {
    // Player Reached Water
     if (this.player.y <= 0) {
        this.pause = true;
        this.gamePoints += 50;
        game.displayStatus();
        setTimeout(function() {
        document.getElementById("announce").innerHTML = "You Reached Water Safely:  Extra 50 Points!!";
        this.player.x = (TILE_WIDTH/2) * 4; // Return to start place
        this.player.y = TILE_HEIGHT*5;
        this.pause = false;
        }.bind(this), 1000);
        document.getElementById("announce").innerHTML = "500 points advances to next level";
     }
     // Player crashed into bug
     console.log("this.collision = " + this.collision);
     if (this.collision === true) {
        this.pause = true;
        this.gamePoints = this.gamePoints - 50;
        game.displayStatus();
        setTimeout(function() {
        document.getElementById("announce").innerHTML = "BUG CRASH:  Try again!!";
        this.player.x = (TILE_WIDTH/2) * 4; // Return to start place
        this.player.y = TILE_HEIGHT*5;
        this.pause = false;
        }.bind(this), 1000);
        this.collision = false;
     }

     // Update Lives
     if (this.gamePoints < 50) {
        this.gameLives = 0;
     }
     if ( (this.gamePoints >= 100)  && (this.gamePoints < 200) ) {
        this.gameLives = 1;
     }
     if ( (this.gamePoints >= 200) && (this.gamePoints < 300) ) {
        this.gameLives = 2;
     }
     if ( (this.gamePoints >= 300) && (this.gamePoints < 400) ) {
        this.gameLives = 3;
     }
     if (this.gamePoints >= 400) {
        this.gameLives = 4;
        this.gameLevel = 2;
        document.getElementById("announce").innerHTML = "Good Job! New Game Level!!";
     }
     game.displayStatus();

    // Player used up all lifes
    if (this.gameLives === 0) {
        //console.log("gameLives = "+ this.gameLives);
        setTimeout(function() {
        document.getElementById("announce").innerHTML = "All Lives Expended:  GAME OVER!!";
        this.player.x = (TILE_WIDTH/2) * 4; // Return to start place
        this.player.y = TILE_HEIGHT*5;
        this.pause = false;
        }.bind(this), 1000);
    }

     // Player advanced to next level

};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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