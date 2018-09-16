const Constants = require('../constants/Constants');
const levels = require('./levels');

function Player(color) {
    this.points = 0;
    this.lives = 3;
    this.moving = false;
    this.ball =
        {
            radius: 10,
            x: Math.floor(Math.random() * 550),
            y: 0,
            dir: {
                x: Math.random() > .5 ? -1 : 1,
                y: 2
            }
        }
    ;
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
    let blocks = JSON.parse(JSON.stringify(levels[0]));
    let level = 1;

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

        //check if player is directly under you
        Object.keys(players).forEach(key => {

            let otherPaddle = players[key].paddle;
            let myPaddle = players[player].paddle;
            if (
                key !== player &&
                otherPaddle.y === myPaddle.y - 5 &&
                (
                    otherPaddle.x < myPaddle.x && otherPaddle.x + otherPaddle.width > myPaddle.x ||
                    otherPaddle.x > myPaddle.x && otherPaddle.x < myPaddle.x + myPaddle.width
                      || otherPaddle.x === myPaddle.x
                )
            )
                players[player].jumping = true;

        });

        //check if a player is on top of you
        Object.keys(players).forEach(key => {

            let otherPaddle = players[key].paddle;
            let myPaddle = players[player].paddle;
            if (
                key !== player &&
                otherPaddle.y === myPaddle.y + 5 &&
                (
                    otherPaddle.x < myPaddle.x && otherPaddle.x + otherPaddle.width > myPaddle.x ||
                    otherPaddle.x > myPaddle.x && otherPaddle.x < myPaddle.x + myPaddle.width
                    || otherPaddle.x === myPaddle.x
                )
            )
                players[player].jumping = false;

        });



    };
    this.startStop = player => players[player].isActive = !players[player].isActive;
    this.addPlayer = name => players[name] = new Player(newColor());
    this.getNextFrame = () => {

        for (let name in players) {

            let player = players[name];
            let myPaddle = player.paddle;

            //move paddle
            if (player.paddle.moving) {

                if (player.paddle.moving === 'left') {

                    let leftPaddle;
                    Object.keys(players).forEach(key => {
                        let otherPaddle = players[key].paddle;
                        if (
                            key !== name &&
                            otherPaddle.y >= myPaddle.y &&
                            (
                                otherPaddle.y < myPaddle.y && otherPaddle.y + 5 > myPaddle.y ||
                                otherPaddle.y > myPaddle.y && otherPaddle.y < myPaddle.y + 5 ||
                                otherPaddle.y === myPaddle.y
                            ) &&
                            otherPaddle.width + otherPaddle.x >= myPaddle.x - myPaddle.speed &&
                            myPaddle.x - myPaddle.speed > otherPaddle.x
                    )
                        leftPaddle = otherPaddle;
                    });
                    if (leftPaddle)
                        myPaddle.x = leftPaddle.width + leftPaddle.x;
                    else if (myPaddle.x - myPaddle.speed < 0)
                        myPaddle.x = 0;
                    else
                        myPaddle.x = myPaddle.x - myPaddle.speed;

                } else {

                    let rightPaddle;
                    Object.keys(players).forEach(key => {
                        let otherPaddle = players[key].paddle;
                        if (
                            key !== name &&
                            otherPaddle.y >= myPaddle.y &&
                            (
                                otherPaddle.y < myPaddle.y && otherPaddle.y + 5 > myPaddle.y ||
                                otherPaddle.y > myPaddle.y && otherPaddle.y < myPaddle.y + 5 ||
                                otherPaddle.y === myPaddle.y
                            ) &&
                            otherPaddle.x <= myPaddle.x + myPaddle.speed + myPaddle.width &&
                            myPaddle.x + myPaddle.speed < otherPaddle.x
                        )
                            rightPaddle = otherPaddle;
                    });
                    if (rightPaddle)
                        myPaddle.x = rightPaddle.x - myPaddle.width;
                    else if (myPaddle.x + myPaddle.speed + myPaddle.width > Constants.GAME_WIDTH)
                        myPaddle.x = Constants.GAME_WIDTH - myPaddle.width;
                    else
                        myPaddle.x = myPaddle.x + myPaddle.speed;

                }

            }


            //do jump w/ collision
            let yPotential = player.paddle.y < 40 ? 14 : player.paddle.y < 80 ? 7 : 2;

            if (player.jumping) {

                let abovePaddle;

                Object.keys(players).forEach(key => {
                    if (key !== name) {
                        let otherPaddle = players[key].paddle;
                        if (
                            (
                                otherPaddle.x < myPaddle.x && otherPaddle.x + otherPaddle.width > myPaddle.x ||
                                otherPaddle.x > myPaddle.x && otherPaddle.x < myPaddle.x + myPaddle.width ||
                                otherPaddle.x === myPaddle.x
                            ) &&
                            otherPaddle.y <= myPaddle.y + yPotential + 5 &&
                            myPaddle.y + yPotential < otherPaddle.y
                        )
                            abovePaddle = otherPaddle;
                    }
                });

                if (player.paddle.y >= 100)
                    player.jumping = false;
                else if (abovePaddle) {
                    player.jumping = false;
                    myPaddle.y = abovePaddle.y - 5;
                } else
                    myPaddle.y = myPaddle.y + yPotential;

            }

            //do fall w/ collision
            else if (myPaddle.y !== 0) {

                let underPaddle;

                Object.keys(players).forEach(key => {
                    if (key !== name) {

                        let otherPaddle = players[key].paddle;
                        if (
                            (
                                otherPaddle.x < myPaddle.x && otherPaddle.x + otherPaddle.width > myPaddle.x ||
                                otherPaddle.x > myPaddle.x && otherPaddle.x < myPaddle.x + myPaddle.width ||
                                otherPaddle.x === myPaddle.x
                            )
                            &&
                            5 + otherPaddle.y >= myPaddle.y - yPotential &&
                            myPaddle.y - yPotential < otherPaddle.y
                        )
                            underPaddle = otherPaddle;
                    }
                });

                if (underPaddle) {
                    myPaddle.y = underPaddle.y + 5;
                } else
                    myPaddle.y = myPaddle.y - yPotential;

                 if (myPaddle.y < 0)
                     myPaddle.y = 0;

            }




            //temp start !!!!!!!!!!

            //move ball
            if (player.isActive) {

                let nextBall = {
                    x : player.ball.x + player.ball.dir.x,
                    y : player.ball.y + player.ball.dir.y,
                };
                let bounceOfBlock;

                let deletedX = 0;
                let deletedY = 0;

                //check if it will hit a block
                for (let i in blocks) {

                    if (blocks[i]) {


                        let {width, height} = blocks[i];
                        let x = blocks[i].left;
                        let y = blocks[i].bottom;


                        if (player.ball.x > x - player.ball.radius &&
                            player.ball.y < y + player.ball.radius &&
                            player.ball.x < x + width &&
                            player.ball.y < y + height) {


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

                            if (
                                !(xDist > (width / 2 + player.ball.radius)) &&
                                !(yDist > (height / 2 + player.ball.radius))
                            ) {
                                if (
                                    (xDist <= (width / 2)) ||
                                    (yDist <= (height / 2)) ||
                                    (cornerDist <= (player.ball.radius ^ 2))
                                ) {

                                    delete blocks[i];
                                    player.points++;
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

            //temp end !!!!!!!!!!


        //     if (player.isActive) {
        //
        //         let nextBall = {
        //             x : player.ball.x + player.ball.dir.x,
        //             y : player.ball.y + player.ball.dir.y,
        //         };
        //
        //         let bounceOfBlock;
        //
        //         let deletedX = 0;
        //         let deletedY = 0;
        //
        //         //check if it will hit a block
        //         for (let i in blocks) {
        //
        //             let {width, height} = blocks[i];
        //             let x = blocks[i].left;
        //             let y = blocks[i].bottom;
        //
        //
        //             if(
        //                 player.ball.x > x - player.ball.radius &&
        //                 player.ball.y < y + player.ball.radius &&
        //                 player.ball.x < x + width &&
        //                 player.ball.y < y + height
        //             ){
        //
        //                 let blockCenterX = x + width / 2;
        //                 let blockCenterY = y - height / 2;
        //
        //                 let ballCenterX = nextBall.x + player.ball.radius;
        //                 let ballCenterY = nextBall.y - player.ball.radius;
        //
        //                 let xDist = Math.abs(ballCenterX - blockCenterX);
        //                 let yDist = Math.abs(ballCenterY - blockCenterY);
        //                 let cornerDist = (xDist - width / 2) ^ 2 +
        //                     (yDist - height / 2) ^ 2;
        //
        //                 let collided = false;
        //                 if (
        //                     (xDist < (width / 2 + player.ball.radius)) ||
        //                     (yDist < (height / 2 + player.ball.radius))
        //                 ) {
        //                     collided = false;
        //                 } else if (
        //                     (xDist <= (width / 2)) ||
        //                     (yDist <= (height / 2))
        //                 ) {
        //                     collided=true;
        //                 } else if(cornerDist <= (player.ball.radius ^ 2)){
        //                     collided=true;
        //                 }
        //
        //                 if (collided) {
        //                     delete blocks[i];
        //                     player.points++;
        //                     bounceOfBlock = true;
        //
        //                     if (ballCenterY < blockCenterY) {
        //                         player.ball.dir.y = player.ball.dir.y * -1;
        //                         deletedY++;
        //                     } else if (ballCenterY > blockCenterY) {
        //                         player.ball.dir.y = player.ball.dir.y * -1;
        //                         deletedY++;
        //                     } else if (ballCenterX < blockCenterX) {
        //                         player.ball.dir.x = player.ball.dir.x * -1;
        //                         deletedX++;
        //                     } else if (ballCenterX > blockCenterX) {
        //                         player.ball.dir.x = player.ball.dir.x * -1;
        //                         deletedX++;
        //                     } else {
        //                         player.ball.dir.y = player.ball.dir.y * -1;
        //                         deletedY++;
        //                     }
        //
        //                 }
        //
        //             }
        //
        //         }
        //
        //         //move the ball
        //         if (!bounceOfBlock) {
        //             player.ball.x += player.ball.dir.x;
        //             player.ball.y += player.ball.dir.y;
        //         } else {
        //             if (deletedY % 2 === 0 && deletedY !== 0)
        //                 player.ball.dir.y = player.ball.dir.y * -1;
        //             if (deletedX % 2 === 0 && deletedX !== 0)
        //                 player.ball.dir.x = player.ball.dir.x * -1;
        //         }
        //
        //         //bounce off walls
        //         if (player.ball.x > Constants.GAME_HEIGHT - 2 * player.ball.radius) {
        //             player.ball.x = Constants.GAME_HEIGHT - 2 * player.ball.radius;
        //             player.ball.dir.x = -1 * player.ball.dir.x;
        //         } else if (player.ball.y > Constants.GAME_WIDTH - 2 * player.ball.radius) {
        //             player.ball.y = Constants.GAME_WIDTH - 2 * player.ball.radius;
        //             player.ball.dir.y = -1 * player.ball.dir.y
        //         } else if (player.ball.x < 0) {
        //             player.ball.x = 0;
        //             player.ball.dir.x = -1 * player.ball.dir.x;
        //         }
        //
        //         //bounce off paddle
        //         else if (player.ball.y < player.paddle.y && paddleHit(player.ball, player.paddle) && player.ball.dir.y < 0) {
        //             player.ball.dir.y = player.jumping ? Math.abs(player.ball.dir.y) + 1 : 1;
        //             player.ball.dir.x =
        //                 paddleHit(player.ball, player.paddle) === 'center' ? (player.ball.dir.x > 0 ? 1 : -1) :
        //                     paddleHit(player.ball, player.paddle) === 'left' ? -2 : 2;
        //         }
        //
        //
        //     }

        }

        //load next level if needed
        if (blocks.every(block => !block))
            blocks = JSON.parse(JSON.stringify(levels[level++]));

        //check if anyone is out of bounds. If so, deduct some points and turn them around.
        Object.keys(players).forEach(player => {
            if (players[player].ball.y < -5 && players[player].ball.dir.y < 0) {
                players[player].points = players[player].points - 20;
                players[player].ball.dir.y = 1;
            }
        });

        return {players, blocks};
    };
}

module.exports = Game;

