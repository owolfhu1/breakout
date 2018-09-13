//https://github.com/owolfhu1/breakout
import React from 'react';
//import Block from './Block';
const levels = require('../server/levels');

const Constants = require('../constants/Constants');

const HEIGHT = Constants.GAME_HEIGHT;
const WIDTH = Constants.GAME_WIDTH;

const style = {
    position : 'relative',
    width : WIDTH +'px',
    height : HEIGHT + 'px',
    border : 'black solid 1px',
    margin : '10px'
};

this.points = 0;
this.lives = 3;
this.ball = {
    radius:1,
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

const Block = props =>
    <span style={{
        position: 'absolute',
        bottom: `${props.x}px`,
        left: `${props.y}px`,
        height: `${props.height - 2}px`,
        width: `${props.width - 2}px`,
        background: props.color,
        border: '1px solid black',
    }} />;

const Paddle = props =>
    <span style={{
        width : props.width + 'px',
        left : props.x + 'px',
        bottom : props.y + 'px',
        background : props.color,
        position : 'absolute',
        height : '5px'
    }}/>;

const Ball = props =>
    <span style={{
        width : (props.radius * 2) + 'px',
        height : (props.radius * 2) + 'px',
        left : props.x + 'px',
        bottom : props.y + 'px',
        background : props.color,
        position : 'absolute',
    }}/>;

const drawPlayers = players => {
    let els = [];
    for (let name in players) {
        //todo: name, score, life.
        let player = players[name];
        els.push(<Ball radius={player.ball.radius}
                       x={player.ball.x}
                       y={player.ball.y}
                       color={player.color} />);
        els.push(<Paddle width={player.paddle.width}
                         x={player.paddle.x}
                         y={player.paddle.y}
                         color={player.color} />);
    }
    return els;
};

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players : {},
            blocks : [],
        };
        this.moveBall = this.moveBall.bind(this);

        props.socket.emit('console','hello server, from client.');

    }

    componentDidMount() {
        this.windowDiv.focus();
        //this.setState({blocks: levels[0]},
        //     () => this.setState({interval : setInterval(this.moveBall, 20)}));
        this.props.socket.on('new_frame', data => {
            this.setState({players : data.players, blocks : data.blocks});
        });
    }



    // moveBall() {
    //
    //     //checks if there are no blocks left and starts a new level if so
    //     if (this.blocksLength() === 0){
    //         let level = this.state.level + 1;
    //         //alert('good job on level ' + level);
    //
    //         if (levels.length > level) {
    //             let blocks = levels[level];
    //             this.setState({level,blocks});
    //         }
    //     }
    //
    //     //checks if the paddle should move
    //     if(this.state.movingRight){
    //         if(this.state.paddle<=(WIDTH-this.state.paddleWidth)-this.state.speed){
    //             this.setState({paddle:this.state.paddle + this.state.speed});
    //         }else{
    //             this.setState({paddle:(WIDTH-this.state.paddleWidth)});
    //         }
    //     }else if(this.state.movingLeft){
    //         if(this.state.paddle>=this.state.speed){
    //             this.setState({paddle:this.state.paddle - this.state.speed});
    //         }else{
    //             this.setState({paddle:0});
    //         }
    //     }
    //
    //     //do jump
    //     if(this.state.paddleY>=100&&this.state.jumping){
    //         this.setState({jumping:false});
    //     }else if(this.state.jumping){
    //         this.setState({paddleY:this.state.paddleY + 10});
    //     }else if(this.state.paddleY>0){
    //         if(this.state.paddleY>5){
    //             this.setState({paddleY:this.state.paddleY - 10});
    //         }else{
    //             this.setState({paddleY:0});
    //         }
    //     }
    //
    //
    //     if ((this.state.XDir > 0 && this.state.ballX > WIDTH - 2*this.state.radius) ||
    //      (this.state.XDir < 0 && this.state.ballX < 1)) {
    //         this.setState({
    //             XDir : this.state.XDir*-1
    //         })
    //     }
    //
    //     if ((this.state.YDir > 0 && this.state.ballY > HEIGHT - 2*this.state.radius) ||
    //      (this.state.YDir < 0 && this.state.ballY < this.state.paddleY &&
    //         this.state.paddle - this.state.radius < this.state.ballX &&
    //         this.state.paddle - this.state.radius > this.state.ballX - this.state.paddleWidth)) {
    //
    //         let zone = this.state.ballX - this.state.paddle + this.state.radius;
    //
    //         //debugger
    //         //alert(zone)
    //
    //         let YDir = this.state.YDir < 0 && !this.state.jumping ? 2 :
    //             (this.state.YDir * -1 + ((this.state.jumping && this.state.ballY < this.state.paddleY) ? 2 : 0 ));
    //
    //
    //         //let YDir = this.state.YDir * -1 + ((this.state.jumping && this.state.ballY < this.state.paddleY) ? 1 : 0 );
    //
    //         //let XDir = this.state.YDir > 0 ? this.state.XDir : (zone < 30 ? -2 : zone > this.state.width - 30 ? 2 : this.state.XDir)
    //         let XDir = this.state.YDir > 0 ? this.state.XDir :
    //             zone < this.state.paddleWidth/5 ? -4 :
    //             zone > this.state.paddleWidth - this.state.paddleWidth/5 ? 4 :
    //             this.state.XDir > 0 ? 2 : -2;
    //
    //         this.setState({YDir,XDir})
    //
    //     }
    //
    //     this.setState({
    //         ballX : this.state.ballX + this.state.XDir,
    //         ballY : this.state.ballY + this.state.YDir,
    //     });
    //
    //     if (this.state.ballY < -1 * this.YDir) {
    //         clearInterval(this.state.interval);
    //     }
    //
    // }
    //
    // getPaddleStyle() {
    //     return {
    //         position : 'absolute',
    //         height : '5px',
    //         width : this.state.paddleWidth+'px',
    //         background : 'black',
    //         bottom : this.state.paddleY+'px',
    //         left : `${this.state.paddle}px`,
    //     }
    // }
    //
    // handleKeyUp(e) {
    //     switch(e.key) {
    //         case 'ArrowLeft' : {
    //             this.setState({movingLeft:false});
    //             break;
    //         }
    //         case 'ArrowRight' : {
    //             this.setState({movingRight:false});
    //             break;
    //         }
    //     }
    // }
    //
    // handleKeyDown(e) {
    //
    //     switch(e.key) {
    //         case 'ArrowLeft' : {
    //             this.setState({movingLeft:true});
    //             break;
    //         }
    //         case 'ArrowRight' : {
    //             this.setState({movingRight:true});
    //             break;
    //         }
    //         case 'ArrowUp' : {
    //             if(this.state.canJump&&this.state.paddleY===0){
    //                 this.setState({jumping:true});
    //             }
    //             break;
    //         }
    //     }
    //
    // }
    //
    // getBallStyle() {
    //     return {
    //         position : 'absolute',
    //         bottom : `${this.state.ballY}px`,
    //         left : `${this.state.ballX}px`,
    //         width : 2*this.state.radius + 'px',
    //         height : 2*this.state.radius + 'px',
    //         background : 'red',
    //         borderRadius : this.state.radius + 'px',
    //     }
    // }
    //
    // killYourSelf(index) {
    //     return (side,die) => {
    //         switch(side) {
    //             case 'left' :
    //             case 'right' :
    //                 if (!this.state.unstopable)
    //                     this.setState({XDir:this.state.XDir*-1});
    //                 break;
    //             case 'top' :
    //             case 'bottom' :
    //                 if (!this.state.unstopable)
    //                     this.setState({YDir:this.state.YDir*-1});
    //                 break;
    //             default :
    //                 console.log('Error in killYourSelf()');
    //         }
    //         if (die) {
    //             let blocks = this.state.blocks;
    //             delete blocks[index];
    //             this.setState({blocks});
    //         }
    //     }
    // }
    //
    // drawBlocks() {
    //     let list = [];
    //     for (let i in this.state.blocks) {
    //         if (this.state.blocks[i])
    //             list.push(
    //                 <Block bottom={this.state.blocks[i].bottom}
    //                        left={this.state.blocks[i].left}
    //                        die={this.killYourSelf(i)}
    //                        health={this.state.blocks[i].health}
    //                        width={this.state.blocks[i].width}
    //                        height={this.state.blocks[i].height}
    //                        ball={{
    //                            x:this.state.ballX,
    //                            y:this.state.ballY,
    //                            radius:this.state.radius,
    //                            direction : {
    //                                x: this.state.XDir,
    //                                y: this.state.YDir
    //                            }
    //                        }}
    //                        color={this.state.blocks[i].color}
    //                        unbreakable={this.state.blocks[i].unbreakable}
    //                 />
    //         );
    //     }
    //     return list;
    // }




    render() {
        return (
            <div>
                level : {this.state.level + 1}
                <div ref={div => {this.windowDiv = div;}}
                     tabIndex="0"
                     style={style}
                     onKeyDown={this.handleKeyDown.bind(this)}
                     onKeyUp={this.handleKeyUp.bind(this)}>

                    {drawBlocks(this.state.blocks)}

                    {drawPlayers(this.state.players)}

                    {/*<span style={this.getBallStyle()}/>*/}
                    {/*<span style={this.getPaddleStyle()}/>*/}

                </div>
            </div>
        )
    }

}

export default Game;
