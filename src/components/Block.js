import React from 'react';



class Block extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //color : props.color
            alive : true,
            health : 1 || this.props.health,
            invincible: false || this.props.invincible,   
            //ok so i made it so that Block has a function it can call it suicide, props.die()
            //it also gets props.ball.x and props.ball.y so we need something in the render method that
            //will will this.props.die() if the ball touchs it    
        }
    }




    render () {
        let {ball, left, bottom} = this.props;

        if (ball.x > bottom && 
            ball.x < bottom + 10 && 
            ball.y > left && 
            ball.y < left + 30)
            this.props.die();


        return (
                <div style={{
                    position : 'absolute',
                    bottom : `${this.props.bottom}px` , 
                    left : `${this.props.left}px`,
                    height : '15px',
                    width : '34px',
                    background : this.state.color,
                    border : '2px solid black', 
                }}/>
        )
    }


}

export default Block;

//eric can you go into game.js constructor and re-write 
//the blocks array to hold objects like i started? i made the first one
//ok