"use strict";
// TODO: run through html checker, and javascript, and css checkers
// TODO: review game metrics and make sure all are met

// Variables
// TILE_WIDTH and TILE_HEIGHT are based on the engine.js method provided for creating the grid
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var initializeGame = true;  // When true, setup and display start screen (when false go ahead and run game engine)
var endGame = false;
var timeOver = false;
var winGame = false;
var nextLevel = false;
// Init Game Values
var bestScore = 100;
var countGameWins = 0;
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
    //console.log("inside Enemy Update, dt = " + dt + " x: " +this.x + "y: " + this.y);
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
    //console.log('PLAYER: location x:' + this.x + ', y:' + this.y);
};

/************************************************************************/
// Create Game (template definition of object's properties and methods)
var Game = function() {
    this.pause = false,
    this.gameLives = 4,
    this.gameLevel = 2,
    this.gamePoints = 750; // for testing
    this.gameWins = 0;
    this.collision = false,
    this.capture = false,
    this.init(),
    this.displayStatus();
    this.saveScore();
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
};

// Initialize new game with player and enemies
Game.prototype.init = function () {
    if (this.gameLevel === 1) {
        this.player = new Player();
        this.allEnemies = [
            new Enemy(-100, 60, this.getRandomIntInclusive(100, 200)),
            new Enemy(-100, 60 + TILE_HEIGHT, this.getRandomIntInclusive(200, 400)),
            new Enemy(-100, 60 + (2 * TILE_HEIGHT), this.getRandomIntInclusive(100, 300)),
            new Enemy(-100, 60 + (3 * TILE_HEIGHT), this.getRandomIntInclusive(200, 400))
        ];
    }

    if (this.gameLevel === 2) {
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
};

// Play sound depends on what just happened
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
    if (!initializeGame) {
        document.getElementById("personalBest").innerHTML = "Your Highest Score: " + localStorage.getItem("saveScore") + "   Your Game Wins: " + localStorage.getItem("gameWins");
    }
};

// Check for collisions
Game.prototype.checkCollisions = function() {
    for (var i = 0; i < this.allEnemies.length; i++) {
        // Difference between Enemy and Player y locations is 23
        // Difference between Enemy and Player x locations must be calculated with enemy - player, due to enemies start at x = -100
        if ((Math.abs(this.allEnemies[i].y - this.player.y) <= 23) && (this.player.x >= this.allEnemies[i].x) && (Math.abs(this.player.x - this.allEnemies[i].x) < TILE_WIDTH)) {
            game.playSound('bug');
            this.collision = true;
            this.capture = false  // prevent almost simultaneous events
            game.displayStatus();
            return;
        }
    }
};

// Check for captures. This only occurs in Level 2 Game.
// If item captured, set capture flag, update game points, update announcement,
// save score to local storage, delete captured item from array, check for Level 2 win
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
            // Delete this item from array
            this.allItems.splice(i, 1);
            game.saveScore();
            if (this.gamePoints >= 800) {
                winGame = true;  // Set flag
                countGameWins += 1;
                game.saveScore();
            }
            game.displayStatus();
            return;
        }
    }
};


// Update player lives, points and game level
// Changes occur when player reached water, collided with bug, or used up all lives
Game.prototype.update = function () {

    // Player Reached Water - Win Points
     if (this.player.y <= 0) {
         game.playSound('water');
         this.pause = true;
         this.gamePoints += 50;
         game.displayStatus();

         // Player Wins Game (Level 2)
         if (this.gamePoints >= 800) {
             winGame = true;  // Set flag
             game.playSound('win');
             countGameWins ++;
             document.getElementById("announce").innerHTML = "GREAT GOING:  You have won this game!!";
             game.pause();
             ctx.fillStyle = "black";
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             setTimeout(function() {
                 game.resetGame();
             }.bind(this), 2000);
         }

         // Player Wins Game Level 1 - Transition to Level 2
         if ((this.gameLevel === 1) && (this.gamePoints >= 400)) {
             game.playSound('nextLevel');
             this.gameLevel = 2;
             document.getElementById("countdown").style.visibility = "hidden";
             document.getElementById("announce").innerHTML = "Good Job! New Game Level!!";
             ctx.fillStyle = "black";
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             setTimeout(function() {
                 game.saveScore();
                 game.resetGame();
             }.bind(this), 2000);
         }
         // Continue Playing Game
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

     // Player captured an item - Gain Points
    if (this.capture === true) {
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

    if (this.gamePoints >= 400) {
        this.gameLevel = 2;
    }



     // Update Score Display
     game.displayStatus();

    // Game End - Player used up all lives
    if (this.gamePoints < 100) {
        endGame = true;
        document.getElementById("countdown").style.visibility = "hidden";
        document.getElementById("announce").innerHTML = "Game Over: Lost all Lives";
    }

    // Game End - Time is Up, Timer will show "Time is Up!"
    if (timeOver) {
        endGame = true;
        document.getElementById("announce").style.visibility = "hidden";
    }

} ;  // update()

// Save highest score for local storage
Game.prototype.saveScore = function () {

    if (this.gamePoints > bestScore) {
        bestScore = this.gamePoints;
    }

    // Check whether local storage is supported
    function supportsLocalStorage() {
        return typeof(Storage)!== 'undefined';
    }

    // Save score to localStorage if it is available
    if (!supportsLocalStorage()) {
        alert("No localStorage Support; this game will not keep score, but you can still play.");
    } else {
        try {
            // Set the local storage variable if it does not exist
            if (!localStorage.getItem('saveScore')) {
                localStorage.setItem('saveScore', bestScore);
            }
            // Update the local storage variable
            else if (localStorage.getItem('saveScore') && (bestScore > localStorage.getItem('saveScore'))) {
                localStorage.setItem('saveScore', bestScore);
            }
        } catch (e) {
            // If any errors, catch and alert the user
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Local Storage Quota Exceeded!');
            }
        }

        try {
            // Set the local storage variable if it does not exist
            if (!localStorage.getItem('gameWins')) {
                localStorage.setItem('gameWins', countGameWins);
            }
            // Update the local storage variable
            else if (countGameWins > localStorage.getItem('gameWins')) {
                localStorage.setItem('gameWins', countGameWins);
            }
        } catch (e) {
            // If any errors, catch and alert the user
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Local Storage Quota Exceeded!');
            }
        }
    }
}



// Start Game on Button Click
Game.prototype.playGame = function() {
        document.getElementById("startButton").disabled = true;
        game.pause = false; // Release paused initial game screen
        initializeGame  =   false;  // When false, ok to run game engine
        //var gameTimer = new countdownTimer('countdown', 0, 30);  // Start countdown timer
        if (this.gameLevel === 1) {
            countdownTimer('countdown', 0, 30);
        }
        else if (this.gameLevel === 2) {
            countdownTimer('countdown', 1, 0);
        }
        document.getElementById("countdown").style.visibility = "visible";
}

// resetGame is used by engine.js
// to initialize a new game and re-enable the play game button
// Retain Persistent highest score and display statistics
// Game.prototype.resetGame = function()  {
//     initializeGame = true;  // When true, setup and display start screen (when false go ahead and run game engine)
//     endGame = false;
//     timeOver = false;
//     location.reload();
//     if (this.gameLevel === 1) {
//         this.gameLives = 1;
//         this.gamePoints = 300; // for testing
//         countdownTimer('countdown', 0, 30);
//     }
//     if (this.gameLevel === 2) {
//         this.gameLives = 4;
//         this.gamePoints = 400;
//         countdownTimer('countdown', 1, 0);
//         document.getElementById("announce").innerHTML = "Click Play Game Button to Play Level 2";
//     }
//     //game.init();
//     document.getElementById("startButton").disabled = false;
// }

// resetGame is used by engine.js
// to initialize a new game board
Game.prototype.resetGame = function()  {
    initializeGame = true;  // When true, setup and display start screen (when false go ahead and run game engine)
    endGame = false;
    timeOver = false;
    location.reload(true);
    alert("START OF RESET: game.gameLevel = " + game.gameLevel + "  this.gameLevel = " + this.gameLevel + "   winGame = " + winGame);

    // Play Level 1 Again
    if (this.gameLevel === 1 && nextLevel === false) {
        this.gameLives = 1;
        this.gamePoints = 350; // testing
        countdownTimer('countdown', 0, 30);
        document.getElementById("announce").innerHTML = "Click Play Game Button to Try Again.";

    }

    // Move Up to Level 2
    if (this.gameLevel === 1 && nextLevel === true) {
        this.gameLevel = 2;
    }

    // Play Level 2
    if (this.gameLevel === 2 && winGame === false) {
        this.gameLives = 4;
        this.gamePoints = 750;  // for testing
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

    game.init();  // Set up game board
    game.displayStatus();
    document.getElementById("startButton").disabled = false;
    alert("END OF RESET: game.gameLevel = " + game.gameLevel + "  this.gameLevel = " + this.gameLevel + "   winGame = " + winGame);
}

// Quit Game on Button Click
Game.prototype.quitGame = function() {
    endGame = true;
    window.close();
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
Game.prototype. getRandomIntInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
