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
    this.jumping = false;
    this.color = color;
}

const paddleHit = (ball, paddle) => {
    let zone = ball.x + ball.radius - paddle.x;
    return zone < 0 || zone > paddle.width ? '' :
        zone < paddle.width / 5 ? 'left' :
        zone > paddle.width - paddle.width / 5 ? 'right' : 'center';
};

function Game() {

    const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
    const newColor = () => colors.splice(Math.floor(Math.random() * Math.floor(colors.length)), 1)[0];

    let players = {};
    let blocks = JSON.parse(JSON.stringify(levels[3]));
    let level = 0;

    this.playersLeft = () => Object.keys(players).length;
    this.removePlayer = name => delete players[name];
    this.move = (player, dir) => players[player].paddle.moving = dir;
    this.stay = (player, dir) => {
        if (players[player].paddle.moving === dir)
            players[player].paddle.moving = '';
    };
    this.jump = player => {
        if (players[player].paddle.y === 0)
            players[player].jumping = true;
    };
    this.startStop = player => players[player].isActive = !players[player].isActive;
    this.addPlayer = name => players[name] = new Player(newColor());
    this.getNextFrame = () => {

        for (let name in players) {

            let player = players[name];

            //move paddle
            if (player.paddle.moving)
                player.paddle.x += player.paddle.moving === 'left' ?
                    -1 * player.paddle.speed : player.paddle.speed;

            //do jump
            if (player.paddle.y >= 100 && player.jumping) {
                player.jumping = false;
            } else if (player.jumping) {
                player.paddle.y = player.paddle.y + (player.paddle.y < 40 ? 14 : player.paddle.y < 80 ? 7 : 2);
            } else if (player.paddle.y > 0) {
                if (player.paddle.y > 14) {
                    player.paddle.y = player.paddle.y - (player.paddle.y < 40 ? 15 : player.paddle.y < 80 ? 8 : 3);
                } else {
                    player.paddle.y = 0;
                }
            }

            //move ball
            if (player.isActive) {

                //experiment
                let nextBall = {
                    x : player.ball.x + player.ball.dir.x,
                    y : player.ball.y + player.ball.dir.y,
                };
                let bounceOfBlock;

                let deletedX = 0;
                let deletedY = 0;

                //check if it will hit a block
                for (let i in blocks) {
                    let {width, height} = blocks[i];
                    let x = blocks[i].left;
                    let y = blocks[i].bottom;


                    if(player.ball.x>x-player.ball.radius&&
                        player.ball.y<y+player.ball.radius&&
                        player.ball.x<x+width&&
                        player.ball.y<y+height){



                        let blockCenterX = x + width / 2;
                        let blockCenterY = y - height / 2;


                        // let ballCenterX = player.ball.x + player.ball.radius;
                        // let ballCenterY = player.ball.y - player.ball.radius;

                        let ballCenterX = nextBall.x + player.ball.radius;
                        let ballCenterY = nextBall.y - player.ball.radius;

                        let xDist = Math.abs(ballCenterX - blockCenterX);
                        let yDist = Math.abs(ballCenterY - blockCenterY);
                        let cornerDist = (xDist - width / 2) ^ 2 +
                            (yDist - height / 2) ^ 2;

                        let collided = false;
                        if (
                            (xDist < (width / 2 + player.ball.radius)) ||
                            (yDist < (height / 2 + player.ball.radius))
                        ) {
                            collided=false;
                        } else if (
                            (xDist <= (width / 2)) ||
                            (yDist <= (height / 2))
                        ) {
                            collided=true;
                        } else if(cornerDist <= (player.ball.radius ^ 2)){
                            collided=true;
                        }

                        if (collided) {
                            delete blocks[i];
                            bounceOfBlock = true;

                            if (ballCenterY < blockCenterY) {
                                player.ball.dir.y = player.ball.dir.y * -1;
                                deletedY++;
                            } else if (ballCenterY > blockCenterY) {
                                player.ball.dir.y = player.ball.dir.y * -1;
                                deletedY++;
                            } else if (ballCenterX < blockCenterX) {
                                player.ball.dir.x = player.ball.dir.x * -1;
                                deletedX++;
                            } else if (ballCenterX > blockCenterX) {
                                player.ball.dir.x = player.ball.dir.x * -1;
                                deletedX++;
                            } else {
                                player.ball.dir.y = player.ball.dir.y * -1;
                                deletedY++;
                            }
                        }
                    }
                }

                //move the ball
                if (!bounceOfBlock) {
                    player.ball.x += player.ball.dir.x;
                    player.ball.y += player.ball.dir.y;
                } else {
                    if (deletedY % 2 === 0 && deletedY !== 0) player.ball.dir.y = player.ball.dir.y * -1;
                    if (deletedX % 2 === 0 && deletedX !== 0) player.ball.dir.x = player.ball.dir.x * -1;
                }

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

                //bounce off paddle
                else if (player.ball.y < player.paddle.y && paddleHit(player.ball, player.paddle) && player.ball.dir.y < 0) {
                    player.ball.dir.y = player.jumping ? Math.abs(player.ball.dir.y) + 1 : 1;
                    player.ball.dir.x =
                        paddleHit(player.ball, player.paddle) === 'center' ? (player.ball.dir.x > 0 ? 1 : -1) :
                            paddleHit(player.ball, player.paddle) === 'left' ? -2 : 2;
                }


            }


        }

        //todo: if blocks is empty, load next level

        return {players, blocks};
    };
}

module.exports = Game;

