"use strict";
// TODO: run through html checker, and javascript, and css checkers
// TODO: review game metrics and make sure all are met

// Variables
// TILE_WIDTH and TILE_HEIGHT are based on the engine.js method provided for creating the grid
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var initializeGame = true;  // When true, setup and display start screen (when false go ahead and run game engine)
var endGame = false;
var winGame = false;
var nextLevel = false;
var advanceLevel = false;
var timeOver = false;
var bestScore = 0;
var gameWinsCount = 0;
var gameCount = 0;
/************************************************************************/
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
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/************************************************************************/
// Create Other Game Items
var Item = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/' + sprite + '.png';
};

Item.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/************************************************************************/
// Create Player
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = (TILE_WIDTH/2) * 4; // Start game with player in center of lower row
    this.y = TILE_HEIGHT*5;
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
};

/************************************************************************/
// Create Game (template definition of object's properties and methods)
var Game = function() {
    //this.numberOfWins = 0;
    this.pause = false;
    this.collision = false;
    this.capture = false;
    this.setupGame();
    console.log('just after this.setupGame() inside Game function');
    //this.displayStatus();
    //this.saveScore();
    this.audio = {
        muted: false,
        bug: new Audio('audio/bug3.wav'),
        itemFound: new Audio('audio/itemFound.wav'),
        heart: new Audio('audio/heart.wav'),
        water: new Audio('audio/water.wav'),
        gameOver: new Audio('audio/game-over03.wav'),
        nextLevel: new Audio('audio/level-up.wav'),
        win: new Audio('audio/game-win.wav')
    };
    console.log('at end of Game function, this.gameLevel: ' + this.gameLevel);
    console.log('at end of Game function, this')
    localStorage.setItem('gameWins', 0);
};

/************************************************************************/
// Set Up new game display with player and enemies
Game.prototype.setupGame = function () {
    gameCount = gameCount +1;

    // Check whether local storage is supported
    // function supportsLocalStorage() {
    //     return typeof(Storage)!== 'undefined';
    // }
    // // Save score to localStorage if it is available
    // if (!supportsLocalStorage()) {
    //     alert("No localStorage Support; this game will not keep score and will not advance levels, but you can still play.");
    // }
    // else {
    //     alert ("Good to go on local storage in this browser!");
    // }


    //   if (this.gameLevel === null || this.gameLevel === undefined) {
    this.gameLevel = 2;  // todo for testing
    //   }

    console.log('inside setupGame, this.gameLevel: ' + this.gameLevel + ' nextLevel: ' + nextLevel);

    if (this.gameLevel === 1) {
        this.gamePoints = 350;
        this.gameLives = 1;
        //this.numberOfWins = localStorage.getItem('gameWins');
        this.player = new Player();
        this.allEnemies = [
            new Enemy(-100, 60, this.getRandomIntInclusive(100, 200)),
            new Enemy(-100, 60 + TILE_HEIGHT, this.getRandomIntInclusive(200, 400)),
            new Enemy(-100, 60 + (2 * TILE_HEIGHT), this.getRandomIntInclusive(100, 300)),
            new Enemy(-100, 60 + (3 * TILE_HEIGHT), this.getRandomIntInclusive(200, 400))
        ];
    }

    if (this.gameLevel === 2) {
        this.gamePoints = 750;
        this.gameLives = 4;
        //localStorage.setItem('gameWins', this.numberOfWins);
        this.player = new Player();
        this.allEnemies = [
            new Enemy(-100, 60, this.getRandomIntInclusive(100, 200)),
            new Enemy(-60, 60, this.getRandomIntInclusive(100, 200)),
            new Enemy(-100, 60 + TILE_HEIGHT, this.getRandomIntInclusive(200, 400)),
            new Enemy(-60, 60 + TILE_HEIGHT, this.getRandomIntInclusive(200, 400)),
            new Enemy(-100, 60 + (2 * TILE_HEIGHT), this.getRandomIntInclusive(100, 300)),
            new Enemy(-60, 60 + (2 * TILE_HEIGHT), this.getRandomIntInclusive(100, 300)),
            new Enemy(-100, 60 + (3 * TILE_HEIGHT), this.getRandomIntInclusive(200, 400)),
            new Enemy(-60, 60 + (3 * TILE_HEIGHT), this.getRandomIntInclusive(200, 400))
        ];
        this.allItems = [
            new Item(this.getRandomIntInclusive(0, 4)*TILE_WIDTH, 60, 'Heart'),
            new Item(this.getRandomIntInclusive(0, 4)*TILE_WIDTH, 60 + TILE_HEIGHT, 'GemBlue'),
            new Item(this.getRandomIntInclusive(0, 4)*TILE_WIDTH, 60 + (2 * TILE_HEIGHT), 'GemGreen'),
            new Item(this.getRandomIntInclusive(0, 4)*TILE_WIDTH, 60 + (3 * TILE_HEIGHT), 'GemOrange')


        ];
    }
    // console.log('inside setupGame, this.allEnemies.length = ' + this.allEnemies.length);
    // if (this.gameLevel === 2) {
    //     console.log('inside setupGame, this.allItems.length = ' + this.allItems.length);
    // }

};

// Play sound depends on what just happened
// TODO: add sound for level2 advance, gameOver, gameWin, level2 gameOver
Game.prototype.playSound = function(sound) {
    if (!this.audio.muted) {
        switch (sound) {
            case 'bug':
                this.audio.bug.play();
                break;
            case 'water':
                this.audio.water.play();
                break;
            case 'itemFound':
                this.audio.itemFound.play();
                break;
            case 'heart':
                this.audio.heart.play();
                break;
            case 'gameOver':
                this.audio.gameOver.play();
                break;
            case 'nextLevel':
                this.audio.nextLevel.play();
                break;
            case 'win':
                this.audio.win.play();
                break;
        }
    }
};

// Display Game Status and Best Score so far
Game.prototype.displayStatus = function () {
    document.getElementById("score").innerHTML = '# of Lives: ' + this.gameLives + '   Game Level: ' + this.gameLevel + '   Game Points: ' + this.gamePoints;

    //if (!initializeGame) {
    //if (gameCount > 1) {
        document.getElementById("personalBest").innerHTML = "Your Highest Score: " + localStorage.getItem("saveScore") + "   Your Game Wins: " + localStorage.getItem("gameWins");
    //}
};

// Check for collisions
Game.prototype.checkCollisions = function() {
    for (var i = 0; i < this.allEnemies.length; i++) {
        // Difference between Enemy and Player y locations is 23
        // Difference between Enemy and Player x locations must be calculated with enemy - player, due to enemies start at x = -100
        if ((Math.abs(this.allEnemies[i].y - this.player.y) <= 23) && (this.player.x >= this.allEnemies[i].x) && (Math.abs(this.player.x - this.allEnemies[i].x) < TILE_WIDTH)) {
            game.playSound('bug');
            this.collision = true;
            this.capture = false; // prevent almost simultaneous events
            game.displayStatus();
            return;
        }
    }
};

// Check for captures.  If item captured, set capture flag, update game points, update announcement, save score to
// local storage, delete captured item from array, check for Level 2 win
Game.prototype.checkCaptures = function() {
    for (var i = 0; i < this.allItems.length; i++) {
        if ((Math.abs(this.allItems[i].y - this.player.y) <= 23) && (Math.abs(this.player.x - this.allItems[i].x) < TILE_WIDTH)) {
            this.capture = true;
            this.collision = false;  // prevent almost simultaneous events
            if (this.allItems[i].sprite === 'images/Heart.png') {
                this.gamePoints = this.gamePoints + 100;
                document.getElementById("announce").innerHTML = "Extra Life Heart found: You gained 100 points!!";
                game.playSound('heart');
            }
            else {
                this.gamePoints = this.gamePoints + 50;
                document.getElementById("announce").innerHTML = "Sparkly Gem found: You gained 50 points!!";
                game.playSound('itemFound');
            }
            // Delete this item from array, update score
            this.allItems.splice(i, 1);
            // if (this.gamePoints >= 800) {
            //     winGame = true;
            //     gameWinsCount = gameWinsCount + 1;
            //     localStorage.setItem('gameWins', gameWinsCount);
            //     game.saveScore();
            // }
            //game.displayStatus();
            return;
        }
    }
};


// Update player lives, points, and game level
// Changes occur when player reached water, collided with bug, used up all lives, used up allotted time
Game.prototype.updateGame = function () {
    console.log('inside updateGame');

    // Player Reached Water - Win Points / Win Game
    if (this.player.y <= 0) {
        game.playSound('water');
        this.pause = true;
        this.gamePoints += 50;

        // Check for winning Game Level 2
        if (this.gamePoints >= 800) {
            winGame = true;
            gameWinsCount = gameWinsCount + 1;
            this.numberOfWins += 1;
            localStorage.setItem('gameWins', this.numberOfWins);
            game.pause();
            //game.displayStatus();
        }

        // Check for winning Game Level 1 -- Transition to Level 2
        if ((this.gameLevel === 1) && (this.gamePoints >= 400)) {
            nextLevel = true;  // Set flag for level 2 - display is updated im engine.js
            advanceLevel = true;
            game.playSound('nextLevel');
            this.gameLevel = 2;
            localStorage.setItem('saveLevel', this.gameLevel);
            console.log('inside updateGame, saveLevel: ' + localStorage.getItem('saveLevel'));
            //this.saveGameLevel();
            console.log('inside updateGame, gameLevel: ' + this.gameLevel + ' nextLevel: ' + nextLevel);
            this.pause = true; // todo Of true, this makes an endless loop in engine.main set to false
        }
        // Continue at Level 1
        else {
            setTimeout(function() {
                document.getElementById("announce").innerHTML = "You Reached Water Safely:  Extra 50 Points!!";
                game.saveScore();
                this.player.x = (TILE_WIDTH/2) * 4; // Return to start place
                this.player.y = TILE_HEIGHT*5;
                this.pause = false;
            }.bind(this), 1000);
        }
    }

    // Player crashed into bug - Lose Points
    // Pause game, adjust point total, announce result, reset player, resume game
    if (this.collision === true) {
        this.pause = true;
        this.gamePoints = this.gamePoints - 50;
        game.displayStatus();
        setTimeout(function() {
            document.getElementById("announce").innerHTML = "BUG CRASH: Minus 50 points ... Try again!!";
            //this.player.x = (TILE_WIDTH/2) * 4;
            this.player.y = TILE_HEIGHT*5;  // Return to starting row
            this.pause = false;
            this.collision = false;
        }.bind(this), 1000);
        this.collision = false;
    }

    // When Player captured an item - Pause, send player back to home row, reset capture flag
    if (this.gameLevel === 2 && this.capture === true) {
        winGame = true;
        gameWinsCount = gameWinsCount + 1;
        this.numberOfWins += 1;
        localStorage.setItem('gameWins', this.numberOfWins);
        this.pause = true;
        setTimeout(function() {
            //this.player.x = (TILE_WIDTH/2) * 4;
            this.player.y = TILE_HEIGHT*5;  // Return to starting row
            this.pause = false;
        }.bind(this), 1000);
        this.capture = false;
    }

    // Update Lives and Points
    if (this.gamePoints >= 100) {
        this.gameLives = Math.floor(this.gamePoints / 100);
    }
    else {
        this.gamePoints = 0;
        this.gameLives = 0;
    }

    // Update Score Display
    game.displayStatus();

    // Game End - Player used up all lives
    if (this.gamePoints < 100) {
        endGame = true;
        document.getElementById("countdown").style.visibility = "hidden";
        document.getElementById("announce").innerHTML = "Game Over: Lost all Lives";
    }

    // Game End - Time is Up
    if (timeOver) {
        endGame = true;
        // Timer will show "Time is Up!"
        document.getElementById("announce").style.visibility = "hidden";
        document.getElementById("announce").innerHTML = "Game Over: Time Limit Reached";
    }

} ;  // updateGame()

// Save highest score for local storage
Game.prototype.saveScore = function () {

    if (this.gamePoints > bestScore) {
        bestScore = this.gamePoints;
    }

    // Set the local storage variable if it does not exist
    if (!localStorage.getItem('saveScore')) {
        localStorage.setItem('saveScore', bestScore);
    }
    // Update the local storage variable
    if ((localStorage.getItem('saveScore')) && (bestScore > localStorage.getItem('saveScore'))) {
        localStorage.setItem('saveScore', bestScore);
    }

    if (winGame && !localStorage.getItem('gameWins')){
        localStorage.setItem('gameWins', this.numberOfWins);
    }
    if (winGame) {
        localStorage.setItem('gameWins', this.numberOfWins);
    }

};

// Start Game on Button Click - starts countdown timer, and game engine running
Game.prototype.playGame = function() {
    document.getElementById("startButton").disabled = true;
    game.pause = false; // Release paused initial game screen
    initializeGame  =   false;  // When false, ok to run game engine

    if (this.gameLevel === 1) {
        countdownTimer('countdown', 0, 30);
    }
    else if (this.gameLevel === 2) {
        countdownTimer('countdown', 1, 0);
    }
    document.getElementById("countdown").style.visibility = "visible";
};

// resetGame is used by engine.js
// to initialize a new game and re-enable the play game button
// Retain Persistent highest score and display statistics
Game.prototype.resetGame = function()  {
    console.log('inside resetGame, this.gameLevel = ' + this.gameLevel);
    initializeGame = true;  // When true, stop game from running (when false go ahead and run game engine)
    endGame = false;
    timeOver = false;
    location.reload(true);  // Reload Page from the Server (if (true))
    //location.reload();
    console.log("START OF RESET: this.gameLevel = " + this.gameLevel + 'nextLevel = ' + nextLevel + "   winGame = " + winGame);


    // Reset to Play Level 1
    if (this.gameLevel === 1) {
        this.gameLives = 1;
        this.gamePoints = 350; // testing
        countdownTimer('countdown', 0, 30);
        document.getElementById("announce").innerHTML = "Click Play Game Button to Try Again at Level 1.";

    }

    // Reset to Play Level 2
    if (this.gameLevel === 2 && winGame === false) {
        this.gameLives = 4;
        this.gamePoints = 750;
        countdownTimer('countdown', 1, 0);
        document.getElementById("announce").innerHTML = "Click Play Game Button to Play Level 2";
    }

    // Level 2 Win - Revert to Level 1 again
    else if (this.gameLevel === 2 && winGame === true) {
        winGame = false;
        this.gameLevel = 1;
        this.gamePoints = 100;  // testing
        this.gameLives = 1;
        countdownTimer('countdown', 0, 30);
        document.getElementById("announce").innerHTML = "Click Play Game Button to Play Level 1 Again.";
    }

    game.setupGame();  // Set up game board
    game.displayStatus();
    document.getElementById("startButton").disabled = false;
    console.log("END OF RESET: this.gameLevel = " + this.gameLevel + ' nextLevel = ' + nextLevel + "  winGame = " + winGame);
};

// Quit Game on Button Click
Game.prototype.quitGame = function() {
    endGame = true;
    window.close();
};

// Clear Score History
Game.prototype.clearHistory = function() {
    localStorage.clear();
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
Game.prototype. getRandomIntInclusive = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Countdown Timer (this game will be timed)
function countdownTimer(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time, timer;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            element.innerHTML = "Game Over:  Time is Up!";
            timeOver = true;
        } else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = "Time Remaining: " + (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
            timer = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
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
