/*
Source file name:               lisachiang_300925122_ass1.js
    Author's name:              Lisa Chiang (student ID 300925122)
    Last Modified by:           Lisa Chiang
    Date Last Modified:         June 18, 2017
    Program Description:        Javascript file to run the Adventure Game through index.html
    Revision History:           Version 1 made on June 11, 2017
                                Corrected and Final Version made on June 18, 2017
*/

var stage;
const squareSize = 60;  // size of one element box in the world

const E=0, W=1, P=2, G=3, D1=4, D2=5, R1=6, R2=7; // E=empty; W=wall; G=goal; 
                                                    // D1=danger 1; D2=danger 2; R1=reward 1; R2=reward 2

const images= ['flower.png', 'rock.png', 'explorer_cut.png', 'treasure.png',
    'tiger.png', 'spider.png', 'parrot.png', 'monkey.png']; // array of the name of the image files of the elements

const imageScaleFactors= [0.2, 0.1, 0.17,  0.04,
    0.1, 0.02, 0.1, 0.1];   // array of the scale factors used on the images of the elements

// the array of arrays representing the world
var world = [
    [W,E,W,W,E,E,E,W,W,W],
    [W,E,E,E,E,W,E,W,E,E],
    [E,E,W,E,W,W,E,W,W,E],
    [W,E,W,E,E,W,E,E,W,E],
    [W,W,W,E,E,W,W,E,E,E],
    [E,E,E,E,R1,W,D1,E,E,E],
    [W,E,W,D2,E,E,E,W,W,W],
    [E,E,G,E,E,E,E,E,E,W],
    [E,W,E,R2,W,E,W,E,E,E],
    [W,W,E,W,W,W,W,W,E,P],
];

// the array of arrays containing the images of the fog
var fog = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
];

const worldDim = world.length;  // dimension of the squared matrix defining the world
const worldSize = squareSize * worldDim; // size of the stage

// constants for the keys up, down, left, right, letter "i"
const ARROW_KEY_LEFT = 37;
const ARROW_KEY_UP = 38;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_DOWN = 40;
const LETTER_I = 73;

var playerPosition = [worldDim-1,worldDim-1];   // current player's position
var playerMove = [worldDim-1,worldDim-1];       // position where the player wants to move to
var playerInventory = [false, false];   // element at 0 is true is parrot has been found; 
                                        // element at 1 is true is monkey has been found;

// function that is called when the page body is loaded
function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    // create message that will appear before the game starts
    initialMessage = getCentralMessage(
        "Click to Start the Game", stage.canvas.width / 2, stage.canvas.height / 2);
    stage.addChild(initialMessage);
    window.onclick = start; // add click event handler
}

// function that keeps the stage continuosly updated
function handleTick(e) {
    stage.update();
}

// function to get a central message
function getCentralMessage(message, x, y) {
    var text = new createjs.Text(message, "30px Arial", "red");
    text.textBaseline = "middle";
    text.textAlign = "center";
    text.x = x;
    text.y = y;
    return text;
}

// function that will make the game to start, event handler of the event click on the window
function start() {
    // reset the array containing the initial position of the player
    playerPosition[0] = worldDim-1;
    playerPosition[1] = worldDim-1;
    // cover any world from previous games
    var rectangleWhite = getRectangle('#000', 'white', 0, 0, worldSize, worldSize);       
    stage.addChild(rectangleWhite);       
    // remove initial message
    stage.removeChild(initialMessage);
    // create a new world to play
    getNewWorld();
    // add event handler to detect pressed keys
    window.onkeydown = onDPad;
}

// function to draw the elements of the world
function getNewWorld() {
    var x = 0;
    var y = 0;

    // go through all the elements of the world to add the respective images and the fog
    for( i=0; i<worldDim; i++) {
        for(j=0; j<worldDim; j++) {
            if (world[i][j] != P)
            {
                // add the image corresponding to the element of the world in this position
                var newImage = getBitmap(images[world[i][j]], x, y, imageScaleFactors[world[i][j]]);
                stage.addChild(newImage);

                // add the fog on top of the image
                var newFog = getBitmap('leaf.png', x, y, 0.1);  
                fog[i][j] = newFog;
                stage.addChild(fog[i][j]);
            }
            x += squareSize;           
        }

        x = 0;
        y += squareSize;
    }

    // add the player to the stage
    player = getBitmap(images[P], squareSize * (worldDim - 1), squareSize * (worldDim - 1), imageScaleFactors[P]);
    stage.addChild(player);
}

// function to add a bitmap to the stage
function getBitmap(nameImage, x, y, scaleFactor)
{ 
    var imgPath = 'images/' + nameImage;
    objectDrawn = new createjs.Bitmap(imgPath);
    objectDrawn.scaleX=scaleFactor;
    objectDrawn.scaleY=scaleFactor;      
    objectDrawn.x = x; 
    objectDrawn.y = y;
    return objectDrawn;
}

// function to manage the actions that need to be done in case a key is pressed
function onDPad(e){
    // associate a position to the direction command given by the user
    // or show inventory in console in case of key "i"
    switch (e.keyCode){
        case ARROW_KEY_LEFT:
            playerMove[0] = playerPosition[0];
            playerMove[1] = playerPosition[1]-1;               
            break;
        case ARROW_KEY_UP:
            playerMove[0] = playerPosition[0]-1;
            playerMove[1] = playerPosition[1];               
            break;
        case ARROW_KEY_RIGHT:
            playerMove[0] = playerPosition[0];
            playerMove[1] = playerPosition[1]+1;
            break;
        case ARROW_KEY_DOWN:
            playerMove[0] = playerPosition[0]+1;
            playerMove[1] = playerPosition[1];
            break;
        case LETTER_I:
            console.log("REWARD INVENTORY:");
            if (playerInventory[0] == true)
            {
                console.log("parrot");
            }
            if (playerInventory[1] == true)
            {
                console.log("monkey");
            }               
    }

    // if the key was referred to a move
    if (e.keyCode == ARROW_KEY_LEFT || e.keyCode == ARROW_KEY_UP 
        || e.keyCode == ARROW_KEY_RIGHT || e.keyCode == ARROW_KEY_DOWN)
    {
        // verify that the move is within the world
        if (playerMove[0] >= worldDim || playerMove[1] >= worldDim)
        {
            var boundaryMessage = getCentralMessage(
                "You reached the border! Change direction.", stage.canvas.width / 2, stage.canvas.height / 2);
            stage.addChild(boundaryMessage);
            tweenMessage(boundaryMessage, 300, 2000, 40, 0);        
        }
        else
        {
            // verify which is the type of the box that the player moved to
            switch (world[playerMove[0]] [playerMove[1]]){
                case E: // empty box
                    playerPosition[0] = playerMove[0];    // update the player position
                    playerPosition[1] = playerMove[1];
                    fog[playerMove[0]][playerMove[1]].visible = false;  // hide fog
                    tweenPlayer(playerPosition[0], playerPosition[1], 300, 300);    // move player using tweening
                    break;
                
                case W: // wall box
                    fog[playerMove[0]][playerMove[1]].visible = false;  // hide fog
                    // show message to say that the player met a wall
                    var obstacleMessage = getCentralMessage(
                        "You met an obstacle!", stage.canvas.width / 2, stage.canvas.height / 2);
                    stage.addChild(obstacleMessage);
                    tweenMessage(obstacleMessage, 300, 2000, 40, 0);    // use tween on message
                    break;
                
                case G: // goal box
                    playerPosition[0] = playerMove[0];    // update the player position
                    playerPosition[1] = playerMove[1];
                    fog[playerMove[0]][playerMove[1]].visible = false; // hide fog
                    tweenPlayer(playerPosition[0], playerPosition[1], 300, 300);     // move player using tweening
                    window.onkeydown = null; // remove event handler that listen to the keys 
                    window.onclick = null; // remove click event handler  
                    // show message to say that the player won               
                    var winMessage = getCentralMessage(
                        "CONGRATULATIONS! YOU WON!", stage.canvas.width / 2, 0);
                    winMessage.alpha = 0;
                    stage.addChild(winMessage);
                    tweenMessage(winMessage, 500, 2000, worldSize/2, 1);     // use tween on message
                    break;
                
                case D1: // danger 1: the player is killed
                    playerPosition[0] = playerMove[0];    // update the player position
                    playerPosition[1] = playerMove[1];
                    fog[playerMove[0]][playerMove[1]].visible = false; // hide fog
                    tweenPlayer(playerPosition[0], playerPosition[1], 300, 300);    // move player using tweening 
                    window.onkeydown = null; // remove event handler that listen to the keys 
                    window.onclick = null; // remove click event handler    
                    // show message to say that the player lost                
                    var loseMessage = getCentralMessage(
                        "OPS... YOU LOST!", stage.canvas.width / 2, 0);
                    loseMessage.alpha = 0;
                    stage.addChild(loseMessage);
                    tweenMessage(loseMessage, 500, 2000, worldSize/2, 1);   // use tween on message
                    break;
                
                case D2:  // danger 2: the player starts from the beginning                   
                    fog[playerMove[0]][playerMove[1]].visible = false;  // hide fog
                    // bring the player to the beginning of the path
                    tweenPlayerBack(300,500);                      
                    playerPosition[0] = worldDim-1; // update player's position
                    playerPosition[1] = worldDim-1;
                    // show message to say that the player has to come back         
                    var dangerMessage = getCentralMessage(
                        "It is dangerous! Better to come back...", stage.canvas.width / 2, stage.canvas.height / 2);
                        stage.addChild(dangerMessage);
                    tweenMessage(dangerMessage, 300, 2000, 40, 0);   // use tween on message
                    break;
                
                case R1:  // reward 1: parrot
                    playerPosition[0] = playerMove[0];    // update the player position
                    playerPosition[1] = playerMove[1];
                    fog[playerMove[0]][playerMove[1]].visible = false;  // hide fog
                    tweenPlayer(playerPosition[0], playerPosition[1], 300, 300);   // move player using tweening 
                    // update the player's inventory
                    playerInventory[0] = true;
                    // show message to say that the player got a reward      
                    var rewardMessage = getCentralMessage(
                        "A parrot!", stage.canvas.width / 2, stage.canvas.height / 2);
                    stage.addChild(rewardMessage);
                    tweenMessage(rewardMessage, 300, 2000, 40, 0);   // use tween on message
                    break;
                
                case R2:  // reward 2: monkey
                    playerPosition[0] = playerMove[0];    // update the player position
                    playerPosition[1] = playerMove[1];
                    fog[playerMove[0]][playerMove[1]].visible = false;  // hide fog
                    tweenPlayer(playerPosition[0], playerPosition[1], 300, 300);
                    // update the player's inventory
                    playerInventory[1] = true;
                    // show message to say that the player got a reward  
                    var rewardMessage = getCentralMessage(
                        "A monkey!", stage.canvas.width / 2, stage.canvas.height / 2);
                    stage.addChild(rewardMessage);
                    tweenMessage(rewardMessage, 300, 2000, 40, 0);   // use tween on message
                    break;
            }             
        }
    }
    
}

// function to apply tweening to the image of the player to move it to a specified position of the world
function tweenPlayer(row, column, waiting, time) {
    createjs.Tween.get(player).wait(waiting).to({x : squareSize * column, y : squareSize * row},time);
}

// function to apply tweening to a central message, by specifying target height and target opacity
function tweenMessage(msg, waiting, time, targetHeight, targetAlpha) {
    createjs.Tween.get(msg).wait(waiting).to({y:targetHeight, alpha:targetAlpha}, time);
}

// function to apply to the tweening of the player when it is sent back to the beginning
function tweenPlayerBack(waiting, time) {
    createjs.Tween.get(player).wait(waiting).to(
        {x : squareSize * (worldDim-1), y : squareSize * (worldDim-1)},time).call(fogEverything,[player],this);
}

// function to hide all the elements of world with the fog
function fogEverything() {
    // hide the world again
    for( i=0; i<worldDim; i++) {
        for(j=0; j<worldDim; j++) {
            if (i != worldDim-1 || j != worldDim - 1)
            {
                fog[i][j].visible = true;
            }       
        }
    }
}

// function to get a rectangle with the specified parameters
function getRectangle(sC, fC, x,y,w,h) {
    var rectangle = new createjs.Shape();
    rectangle.graphics.beginStroke(sC);
    rectangle.graphics.beginFill(fC);
    rectangle.graphics.drawRect(0, 0, w, h);
    rectangle.x = x;
    rectangle.y = y;
    return rectangle;
}