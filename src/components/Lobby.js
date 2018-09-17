import React from 'react';

const drawOnline = (lobby, socket, name) => {
    let buttons = [];
    for (let i in lobby) {
        if (name !== i)
            buttons.push(<button onClick={() => socket.emit('request',i)}>{i}</button>);
    }
    return buttons;
};

const drawChat = list => {
    let chat = [];
    for (let i in list)
        chat.push(<p>{list[i]}</p>);
    return chat;
};

const chat = {
    position : 'absolute',
    border : 'blue solid 2px',
    top : '2%',
    right : '2%',
    height : '90%',
    width : '55%',
    textAlign : 'left',
    overflowY : 'scroll',
};

const input = {
    position: 'absolute',
    bottom : '2%',
    right : '5%',
    width : '50%'
};

const online = {
    position : 'absolute',
    border : 'blue solid 2px',
    top : '2%',
    left : '2%',
    height : '60%',
    width : '40%',
    textAlign : 'left',
};

const request = {
    position : 'absolute',
    border : 'blue solid 2px',
    bottom : '2%',
    left : '2%',
    height : '35%',
    width : '40%',
};


export default class Lobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name : '',
            lobby : {},
            chat : [],
            input : '',
            request : null
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
        socket.on('request', data => this.setState({request:
            <div>
                <h1>game request from {data.name}</h1>
                <button onClick={() => this.props.socket.emit('accept', data)}>accept</button>
                <button onClick={() => this.setState({request:null})}>decline</button>
            </div>
        }));
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

            <div style={chat}>
                {drawChat(this.state.chat)}
            </div>

            <input style={input}
                   value={this.state.input}
                   onKeyUp={this.handleEnter.bind(this)}
                   onChange={this.handleInput.bind(this)}
                   placeholder="chat"/><br/>

            <div style={online}>
                <h2>send a game request</h2>
                {drawOnline(this.state.lobby,this.props.socket,this.state.name)}
            </div>

            <div style={request}>
                {this.state.request}
            </div>

        </div>;

}