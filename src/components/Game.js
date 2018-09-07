//https://github.com/owolfhu1/breakout
import React from 'react';
import Block from './Block';

const style = {
    position : 'relative',
    width : '500px',
    height : '500px',
    border : 'black solid 1px',
    margin : '10px'
}


class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            speed : 5,
            movingLeft:false,
            movingRight:false,
            paddleWidth: 20,
            paddle : 200,
            paddleY : 0,
            canJump:true,
            jumping:false,
            XDir:1,
            YDir:1,
            ballX : 200,
            ballY : 200,
            radius : 5,
            interval : null,

            blocks: [

                {bottom:300,left:40,health:2},
                {bottom:320,left:40,health:2},
                {bottom:340,left:40,health:2},
                {bottom:360,left:40,health:2},
                {bottom:300,left:120,health:2},
                {bottom:320,left:120,health:2},
                {bottom:340,left:120,health:2},
                {bottom:360,left:120,health:2},
                {bottom:300,left:200,health:2},
                {bottom:320,left:200,health:2},
                {bottom:340,left:200,health:2},
                {bottom:360,left:200,health:2},
                {bottom:300,left:270,health:2},
                {bottom:320,left:270,health:2},
                {bottom:340,left:270,health:2},
                {bottom:360,left:270,health:2},
                {bottom:200,left:200,health:2},
                {bottom:220,left:200,health:2},
                {bottom:240,left:200,health:2},
                {bottom:260,left:200,health:2},
                {bottom:200,left:270,health:2},
                {bottom:220,left:270,health:2},
                {bottom:240,left:270,health:2},
                {bottom:260,left:270,health:2},


                //dont need index thats automatic lol
                //im going to work on a funciton, you can make this
                //programaticly instead of typing it all if you want, or jsut amke a few


            ],
        };
        this.moveBall = this.moveBall.bind(this);//ok it sort of works, try that
    }//go to line 178 come on

    componentDidMount() {
        this.windowDiv.focus();
        this.setState({interval : setInterval(this.moveBall, 10)});
    }

    moveBall() {

        if(this.state.movingRight){
            if(this.state.paddle<=(500-this.state.paddleWidth)-this.state.speed){
                this.setState({paddle:this.state.paddle + this.state.speed});
            }else{
                this.setState({paddle:(500-this.state.paddleWidth)});
            }
        }else if(this.state.movingLeft){
            if(this.state.paddle>=this.state.speed){
                this.setState({paddle:this.state.paddle - this.state.speed});
            }else{
                this.setState({paddle:0});
            }
        }

        //do jump
        if(this.state.paddleY>=100&&this.state.jumping){
            this.setState({jumping:false});
        }else if(this.state.jumping){
            this.setState({paddleY:this.state.paddleY + 5});
        }else if(this.state.paddleY>0){
            if(this.state.paddleY>5){
                this.setState({paddleY:this.state.paddleY - 5});
            }else{
                this.setState({paddleY:0});
            }
        }


        if ((this.state.XDir > 0 && this.state.ballX > 500 - 2*this.state.radius) ||
         (this.state.XDir < 0 && this.state.ballX < 1)) {
            this.setState({
                XDir : this.state.XDir*-1
            })
        }

        if ((this.state.YDir > 0 && this.state.ballY > 500 - 2*this.state.radius) ||
         (this.state.YDir < 0 && this.state.ballY < this.state.paddleY &&
            this.state.paddle -10 < this.state.ballX &&
            this.state.paddle +10 > this.state.ballX - this.state.paddleWidth)) {

            let zone = this.state.ballX - this.state.paddle + this.state.radius;

            //debugger
            //alert(zone)

            let YDir = this.state.YDir < 0 && !this.state.jumping ? 1 :
                (this.state.YDir * -1 + ((this.state.jumping && this.state.ballY < this.state.paddleY) ? 1 : 0 ))


            //let YDir = this.state.YDir * -1 + ((this.state.jumping && this.state.ballY < this.state.paddleY) ? 1 : 0 );

            //let XDir = this.state.YDir > 0 ? this.state.XDir : (zone < 30 ? -2 : zone > this.state.width - 30 ? 2 : this.state.XDir)
            let XDir = this.state.YDir > 0 ? this.state.XDir :
                zone < this.state.paddleWidth/5 ? -2 :
                zone > this.state.paddleWidth - this.state.paddleWidth/5 ? 2 :
                this.state.XDir > 0 ? 1 : -1;

            this.setState({YDir,XDir})

        }

        this.setState({
            ballX : this.state.ballX + this.state.XDir,
            ballY : this.state.ballY + this.state.YDir,
        })

        if (this.state.ballY < -1 * this.YDir) {
            clearInterval(this.state.interval);
        }

    }

    getPaddleStyle() {
        return {
            position : 'absolute',
            height : '5px',
            width : this.state.paddleWidth+'px',
            background : 'black',
            bottom : this.state.paddleY+'px',
            left : `${this.state.paddle}px`,
        }
    }

    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft' : {
                this.setState({movingLeft:false});
                break;
            }
            case 'ArrowRight' : {
                this.setState({movingRight:false});
                break;
            }
        }
    }

    handleKeyDown(e) {

        switch(e.key) {
            case 'ArrowLeft' : {
                this.setState({movingLeft:true});
                break;
            }
            case 'ArrowRight' : {
                this.setState({movingRight:true});
                break;
            }
            case 'ArrowUp' : {
                if(this.state.canJump&&this.state.paddleY===0){
                    this.setState({jumping:true});
                }
                break;
            }
        }

    }


    getBallStyle() {
        return {
            position : 'absolute',
            bottom : `${this.state.ballY}px`,
            left : `${this.state.ballX}px`,
            width : 2*this.state.radius + 'px',
            height : 2*this.state.radius + 'px',
            background : 'red',
            borderRadius : this.state.radius + 'px',
        }
    }

    killYourSelf(index) {
        return (side,die) => {
            switch(side) {
                case 'left' :
                case 'right' :
                    this.setState({XDir:this.state.XDir*-1});
                    break;
                case 'top' :
                case 'bottom' :
                    this.setState({YDir:this.state.YDir*-1});
                    break;
                default :
                    console.log('Error in killYourSelf()');
            }
            if (die) {
                let blocks = this.state.blocks;
                delete blocks[index];
                this.setState({blocks});
            }
        }
    }

    drawBlocks() {
        let list = [];
        for (let i = 0; i < this.state.blocks.length; i++) {
            if (this.state.blocks[i])
            list.push(<Block bottom={this.state.blocks[i].bottom}
                             left={this.state.blocks[i].left}
                             die={this.killYourSelf(i)}
                             health={this.state.blocks[i].health}
                             width={50}
                             height={15}
                             ball={{
                                 x:this.state.ballX,
                                 y:this.state.ballY,
                                 radius:this.state.radius,
                                 direction : {
                                     x: this.state.XDir,
                                     y: this.state.YDir
                                 }
                             }}
                              />);
            }
        return list;
    }

    render() {
        return (
            <div ref={div => {this.windowDiv = div;}}
                 tabIndex="0"
                 style={style}
                 onKeyDown={this.handleKeyDown.bind(this)}
                 onKeyUp={this.handleKeyUp.bind(this)}>

                {this.drawBlocks()}

                <span style={this.getBallStyle()}></span>
                <span style={this.getPaddleStyle()}></span>

            </div>
        )
    }

}

export default Game;
