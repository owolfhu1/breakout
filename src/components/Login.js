import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username : ''
        }
    }

    handleInput = e => this.setState({username:e.target.value});

    handleEnter = e => {
        if (e.key === 'Enter')
            this.props.socket.emit('login',this.state.username);
    };

    render = () =>
        <div>
            <input value={this.state.username}
                   onChange={this.handleInput.bind(this)}
                   onKeyUp={this.handleEnter.bind(this)}
                   placeholder="enter a username"/>
        </div>;

}