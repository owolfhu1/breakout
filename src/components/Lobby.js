import React from 'react';

const drawOnline = (list, socket, name) => {
    let buttons = [];
    for (let i in list)
        if (name !== i)
            buttons.push(<button onClick={() => socket.emit('play',list[i])}>{i}</button>);
    return buttons;
};

const drawChat = list => {
    let chat = [];
    for (let i in list)
        chat.push(<p>{list[i]}</p>);
    return chat;
};

export default class Lobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name : '',
            lobby : {},
            chat : [],
            input : '',
        }
    }

    componentDidMount = () => {
        const socket = this.props.socket;

        socket.on('chat', msg => {
            let chat = this.state.chat;
            chat.push(msg);
            this.setState({chat})
        });
        socket.on('lobby',lobby => this.setState({lobby}));
        socket.on('get_name', name => this.setState({name}));
        socket.emit('get_name');
    };

    handleInput = e => this.setState({input:e.target.value});

    handleEnter = e => {
        if (e.key === 'Enter') {
            this.props.socket.emit('chat',this.state.input);
            this.setState({input:''});
        }
    };

    render = () =>
        <div>
            {drawChat(this.state.chat)}
            <input value={this.state.input}
                   onKeyUp={this.handleEnter.bind(this)}
                   onChange={this.handleInput.bind(this)}
                   placeholder="chat"/><br/>
            {drawOnline(this.state.lobby,this.props.socket,this.state.name)}
        </div>;

}