const Constants = require('../constants/Constants');
const levels = require('./levels');

function Player(color) {
    this.points = 0;
    this.lives = 3;
    this.moving = false;
    this.ball = {
        radius : 10,
        x : Math.floor(Math.random() * 550),
        y : 0,
        dir : {
            x : Math.random() > .5 ? -1 : 1,
            y : 2
        }
    };
    this.paddle = {
        speed : 10,
        width : 100,
        moving : '',
        x : this.ball.x - 40 > 0 ? this.ball.x - 40 : 0,
        y : 0,
    };
    this.color = color;
}

const paddleHit = (ball, paddle) => {
    let zone = ball.x + ball.radius - paddle.x;
    return zone < 0 || zone > paddle.width ? '' :
        zone < paddle.width / 5 ? 'left' :
        zone > paddle.width - paddle.width / 5 ? 'right' : 'center';
};

function Game() {

    const colors = ['red','green','blue','yellow','purple'];
    const newColor = () => colors.splice(Math.floor(Math.random()*Math.floor(colors.length)),1)[0];

    let players = {};
    let blocks = levels[0];
    let level = 0;

    this.move = (player, dir) => players[player].paddle.moving = dir;
    this.stay = (player, dir) => {
        if (players[player].paddle.moving === dir)
            players[player].paddle.moving = '';
    };
    this.jump = player => {
        //todo
    };
    this.startStop = player => players[player].isActive = !players[player].isActive;
    this.addPlayer = name => players[name] = new Player(newColor());
    this.getNextFrame = () => {

        for (let name in players){

            let player = players[name];

            if (player.paddle.moving)
                player.paddle.x += player.paddle.moving === 'left' ? -1 * player.paddle.speed : player.paddle.speed;

            if (player.isActive) {


                //todo: jumping


                //check if it will hit a block
                for (let i in blocks) {
                    let {width, height, x, y} = blocks[i];

                    //todo

                }



                //move the ball
                player.ball.x += player.ball.dir.x;
                player.ball.y += player.ball.dir.y;

                //bounce off walls
                if (player.ball.x > Constants.GAME_HEIGHT - 2 * player.ball.radius) {
                    player.ball.x = Constants.GAME_HEIGHT - 2 * player.ball.radius;
                    player.ball.dir.x = -1 * player.ball.dir.x;
                } else if (player.ball.y > Constants.GAME_WIDTH - 2 * player.ball.radius) {
                    player.ball.y = Constants.GAME_WIDTH - 2 * player.ball.radius;
                    player.ball.dir.y = -1 * player.ball.dir.y
                } else if (player.ball.x < 0) {
                    player.ball.x = 0;
                    player.ball.dir.x = -1 * player.ball.dir.x;
                }

                else if (player.ball.y < player.paddle.y && paddleHit(player.ball,player.paddle)) {
                    player.ball.dir.y = Math.abs(player.ball.dir.y);//todo: make this bigger if jumping
                    player.ball.dir.x =
                        paddleHit(player.ball,player.paddle) === 'center' ? (player.ball.dir.x > 0 ? 1 : -1) :
                        paddleHit(player.ball,player.paddle) === 'left' ? -2 : 2;
                }






            }





        }

        //todo: game logic

        //todo: if blocks is empty, load next level

        return {players,blocks};
    };
}

module.exports = Game;

