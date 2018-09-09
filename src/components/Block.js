import React from 'react';

class Block extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            color: 'blue',
            // alive : true,
            //health: 1, //this.props.health,
        };
    }

    render() {
        let { ball, left, bottom, width, height } = this.props;
        if(ball.x>left-ball.radius&&
            ball.y<bottom+ball.radius&&
            ball.x<left+width&&
            ball.y<bottom+height){
            let ballCenterX = ball.x + ball.radius;
            let ballCenterY = ball.y - ball.radius;
            let blockCenterX = left + width / 2;
            let blockCenterY = bottom - height / 2;
            let xDist = Math.abs(ballCenterX - blockCenterX);
            let yDist = Math.abs(ballCenterY - blockCenterY);
            let cornerDist = (xDist - width / 2) ^ 2 +
                (yDist - height / 2) ^ 2;
            if (
                !(xDist > (width / 2 + ball.radius)) &&
                !(yDist > (height / 2 + ball.radius))
            ) {
                if (
                    (xDist <= (width / 2)) ||
                    (yDist <= (height / 2)) ||
                    (cornerDist <= (ball.radius ^ 2))
                ) {
                    if (ballCenterY < blockCenterY) {
                        //if (this.props.unbreakable){
                        //  this.props.die('top');
                        //} else
                        this.props.die('top', true);
                    } else if (ballCenterY > blockCenterY) {
                        //if (this.props.unbreakable){
                        //  this.props.die('bottom');
                        //} else
                        this.props.die('bottom', true);
                    } else if (ballCenterX < blockCenterX) {
                        //if (this.props.unbreakable){
                        //  this.props.die('left');
                        //} else
                        this.props.die('left', true);
                    } else if (ballCenterX > blockCenterX) {
                        //if (this.props.unbreakable){
                        //  this.props.die('right');
                        //} else
                        this.props.die('right', true);
                    } else {
                        //if (this.props.unbreakable){
                        //  this.props.die('bottom');
                        //} else
                        this.props.die('bottom', true);
                    }
                }
            }
        }

        /*

                ball = {
                    x: this.state.ballX,
                    y: this.state.ballY,
                    radius: this.state.radius,
                    direction : {
                        x: this.state.XDir,
                        y: this.state.YDir
                    }
                }


                    ^
                    |+ball.direction.y
                    |
                  ____ v--(ball.x + 2*ball.radius, ball.y + 2*ball.radius)
                |/    \|
                |      | --> +ball.direction.x
                |\____/|
                ^--(ball.x, ball.y)

        */


        return (
            <div style={{
                position: 'absolute',
                bottom: `${this.props.bottom}px`,
                left: `${this.props.left}px`,
                height: `${this.props.height - 2}px`,
                width: `${this.props.width - 2}px`,
                background: this.props.color,
                border: '1px solid black',
            }} />
        )
    }


}

export default Block;

