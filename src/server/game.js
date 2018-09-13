const Constants = require('../constants/Constants');
const levels = require('./levels');

function Player(color) {
    this.points = 0;
    this.lives = 3;
    this.ball = {
        radius : 10,
        x : 0,
        y : 0,
        dir : {
            x : 1,
            y : 1
        }
    };
    this.paddle = {
        speed : 5,
        width : 100,
        moving : '',
        x : 0,
        y : 0,
    };
    this.color = color;
}

/**   EXAMPLE
 *
 *  let obj = new Game();
 *  let interval = setInterval(
 *      ()=> {
 *          let gameState = obj.getNextFrame();
 *          //send gameState to players
 *      }, 50
 *  );
 *  obj.addPlayer('playerOne');
 *  obj.addPlayer('playerTwo');
 *  obj.start();
 *  //play some breakout
 *  obj.stop();
 *  clearInterval(interval);
 *
 */

function Game() {

    const colors = ['red','green','blue','yellow','purple'];
    const newColor = () => colors.splice(Math.floor(Math.random()*Math.floor(colors.length)),1)[0];

    let players = {};
    let blocks = levels[0];
    let isActive = false;
    let level = 0;


    this.start = () => isActive = true;
    this.stop = () => isActive =  false;
    this.addPlayer = name => players[name] = new Player(newColor());
    this.getNextFrame = () => {

        //todo: game logic

        //todo: if blocks is empty, load next level

        return {players,blocks};
    };
}

module.exports = Game;

