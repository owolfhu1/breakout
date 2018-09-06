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
            paddleWidth: 100,
            paddle : 200,
            paddleY : 0,
            canJump:true,
            jumping:false,     
            XDir:1,
            YDir:1,
            ballX : 100,
            ballY : 20,
            interval : null,

            blocks: [

                {bottom:20,left:40,health:2},
                {bottom:40,left:40,health:2},
                {bottom:60,left:40,health:2},
                {bottom:80,left:40,health:2},
                {bottom:20,left:80,health:2},
                {bottom:40,left:80,health:2},
                {bottom:60,left:80,health:2},
                {bottom:80,left:80,health:2},
            
            

                //dont need index thats automatic lol
                //im going to work on a funciton, you can make this 
                //programaticly instead of typing it all if you want, or jsut amke a few

                
            ],
        };
        this.moveBall = this.moveBall.bind(this);
    }

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
        
        
        if ((this.state.XDir > 0 && this.state.ballX > 480) ||
         (this.state.XDir < 0 && this.state.ballX < 1)) {
            this.setState({
                XDir : this.state.XDir*-1
            })            
        }

        if ((this.state.YDir > 0 && this.state.ballY > 480) ||
         (this.state.YDir < 0 && this.state.ballY < this.state.paddleY && 
            this.state.paddle -10 < this.state.ballX && 
            this.state.paddle +10 > this.state.ballX - this.state.paddleWidth)) {
            this.setState({YDir : this.state.YDir * -1 + 
                ((this.state.jumping && this.state.ballY < this.state.paddleY) ? 1 : 0 )})  
                    
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
    }//what wait?

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
            width : '20px',
            height : '20px',
            background : 'red',
            borderRadius : '10px'
        }
    }

    killYourSelf(index) {
        return () => {
            let blocks = this.state.blocks;
            delete blocks[index];
            this.setState({blocks});
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
                             ball={{
                                 x:this.state.ballX,
                                 y:this.state.ballY
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
