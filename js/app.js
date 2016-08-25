//"use strict";
// Todo run through html checker, and javascript, and css checkers
// Todo review game metrics and make sure all are met

// Variables
// TILE_WIDTH and TILE_HEIGHT are based on the engine.js
// method provided for creating the grid
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var INIT_GAME = true;
var END_GAME = false;
/************************************************************************/
 // Create Enemies our player must avoid
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
// Create Player
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = (TILE_WIDTH/2) * 4; // Start game with player in center of lower row
    this.y = TILE_HEIGHT*5;

    this.audio = {
        muted: false,
        bug: new Audio('audio/bug.wav'),
        gem: new Audio('audio/gem.wav'),
        heart: new Audio('audio/heart.wav'),
        water: new Audio('audio/water.wav'),
        gameOver: new Audio('audio/gameOver.wav')
    };
};

// Update Player's position
// Player.prototype.update = function() {
//     // Send player back to start if it reaches the water
//     if (this.y <= 0) {
//         //this.y = TILE_HEIGHT * 5; // reset to grass
//         this.playerWins += 1;
//         console.log ('Reached water!!!');
//     }
// };

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

// Play sound depends on what action player engaged in
// Todo add sound for level2 advance, gameOver, gameWin, level2 gameOver
Player.prototype.playSound = function(sound) {
    if (!this.audio.muted) {
        switch (sound) {
            case 'bug':
                this.audio.bug.play();
                break;
            case 'water':
                this.audio.water.play();
                break;
            case 'gem':
                this.audio.gem.play();
                break;
            case 'heart':
                this.audio.heart.play();
                break;
            case 'gameOver':
                this.audio.gameOver.play();
                break;
        }
    }
};
/************************************************************************/
// Create Game (template definition of object's properties and methods)
var Game = function() {
    this.pause = false,
    this.gameLives = 3,
    this.gameLevel = 1,
    this.gamePoints = 300,
    this.collision = false,
    this.init();
    this.displayStatus();
};

// Initialize new game with player and enemies
Game.prototype.init = function () {
    this.player = new Player();
    this.allEnemies = [
        new Enemy(-100, 60, getRandomIntInclusive(100, 200)),
        new Enemy(-100, 60+TILE_HEIGHT, getRandomIntInclusive(200, 400)),
        new Enemy(-100, 60+(2*TILE_HEIGHT), getRandomIntInclusive(100, 300)),
        new Enemy(-100, 60+(3*TILE_HEIGHT), getRandomIntInclusive(200, 400))
        ];
};

// Display Game Status
Game.prototype.displayStatus = function () {
    document.getElementById("score").innerHTML = '# of Lives: ' + this.gameLives + '   Game Level: ' + this.gameLevel + '   Game Points: ' + this.gamePoints;
    //document.getElementById("announce").innerHTML = "To win, move buddy to the water without bug collision.";
};

// Todo collisions must be fixed, they are not precise enough
// Check for collisions
Game.prototype.checkCollisions = function() {
    // Check for enemy collision
    for (var i = 0; i < this.allEnemies.length; i++) {
         // Difference between Enemy and Player y locations is 23
         // Difference between Enemy and Player x locations must be calculated with enemy - player, due to enemies start at x = -100
        //console.log('PLAYER: location x:' + this.player.x + ', y:' + this.player.y); // TEST
        //console.log('ENEMY ' + i + ': location x:' + this.allEnemies[i].x + ', y:' + this.allEnemies[i].y); // TEST
        //console.log("X COLLISION Calc = " + Math.abs(this.allEnemies[i].x - this.player.x)); // TEST
        //console.log("Y COLLISION Calc = " + Math.abs(this.allEnemies[i].y - this.player.y)); // TEST
        if ((Math.abs(this.allEnemies[i].y - this.player.y) <= 23) && (Math.abs(this.allEnemies[i].x - this.player.x) < TILE_WIDTH)) {
            //console.log("COLLISION with bug at y: " + this.allEnemies[i].y ); // TEST
            game.displayStatus();
            this.collision = true;
            return;
        }
    }

    // Todo make level 2 for game
    // Check for collision with other item


 };

// Update player lives, points and game level
// Changes occur when player reached water, collided with bug, or used up all lives
Game.prototype.update = function () {
    // Player Reached Water - Win Points
     if (this.player.y <= 0) {
         this.player.playSound('water');
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

     // Player crashed into bug - Lose Points
     if (this.collision === true) {
         this.player.playSound('bug');
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

     // Update Lives and Points
     if (this.gamePoints < 50) {
        this.gameLives = 0;
     }
     else if ( (this.gamePoints >= 100)  && (this.gamePoints < 200) ) {
        this.gameLives = 1;
     }
     else if ( (this.gamePoints >= 200) && (this.gamePoints < 300) ) {
        this.gameLives = 2;
     }
     else if ( (this.gamePoints >= 300) && (this.gamePoints < 400) ) {
        this.gameLives = 3;
     }

     // ToDo add second level play
     // Player advanced to next level
     if (this.gamePoints >= 400) {
        this.gameLives = 4;
        this.gameLevel = 2;
        document.getElementById("announce").innerHTML = "Good Job! New Game Level!!";
     }

     // Update Score Display
     game.displayStatus();

    // Game End - Player used up all lives
    if (this.gameLives === 0 || this.gamePoints === 0) {
        //alert("game over");
        this.player.playSound('gameOver');
        document.getElementById("announce").innerHTML = "All Lives Expended:  GAME OVER!!";
        END_GAME = true;  // This triggers black screen
        // Wait 10 sec, then rest player and allow play again
        // setTimeout(function() {
        //     // var INIT_GAME = true;
        //     // var END_GAME = false;
        //     alert("Start Game Over");
        //     game = new Game();
        //     // this.player.x = (TILE_WIDTH/2) * 4; // Return to start place
        //     // this.player.y = TILE_HEIGHT*5;
        //     // INIT_GAME = true;
        // }.bind(this), 500);
    }
};

// Start Game on button click
function startGame() {
    // Disable the button while playing
    document.getElementById("startButton").disabled = true;
    game.pause = false;  // Release paused initial game screen
    INIT_GAME = false;  // This tells the engine to begin playing game
}

function endGame() {
    // Enable the Play Game button
    document.getElementById("startButton").disabled = false;
    alert("is play game enabled?");
    game.pause = true;
    INIT_GAME = true;

}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            32: 'pause' // space key to pause play
        };
        game.player.handleInput(allowedKeys[e.keyCode]);
    });

// -----------------------------------------------
// Game constructor
// -----------------------------------------------
var game = new Game();
