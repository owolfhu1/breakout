
import React from 'react';

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
        };
        this.moveBall = this.moveBall.bind(this);
    }

    componentDidMount() {
        this.windowDiv.focus();
        this.setState({interval : setInterval(this.moveBall, 10)});
    }

    moveBall() {
//hmmm not sure where youa re going with this il watch
        //move paddle
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
            this.state.paddle -10 < this.state.ballX && //wtf this makes it smaller range
            this.state.paddle +10 > this.state.ballX - this.state.paddleWidth)) {//it gets stuck if youre not jumping, you shouldnt have to jump to bounce it
            this.setState({//thats kinda cool though, its a challenge to volly it currently lol
                YDir : this.state.YDir* ((this.state.jumping && this.state.ballY < this.state.paddleY) ? -2 : -1 ),//woah daz cool

                
            })  
                    
        }

        this.setState({
            ballX : this.state.ballX + this.state.XDir,
            ballY : this.state.ballY + this.state.YDir,
        })

        if (this.state.ballY < -10) {
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
                if(this.state.canJump&&this.state.paddleY==0){
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

    render() {
        return (
            <div ref={div => {this.windowDiv = div;}}
                 tabIndex="0" 
                 style={style}
                 onKeyDown={this.handleKeyDown.bind(this)}
                 onKeyUp={this.handleKeyUp.bind(this)}>
                
                <span style={this.getBallStyle()}></span>
                <span style={this.getPaddleStyle()}></span>

            </div>
        )
    }

}

export default Game;
