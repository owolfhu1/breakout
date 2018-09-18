import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import socketIOClient from 'socket.io-client';
import Login from "./components/Login";
import Lobby from "./components/Lobby";
const Constants = require('./constants/Constants');

const socket = socketIOClient('https://tempbreakserver.herokuapp.com');
//const socket = socketIOClient('http://localhost:4003');

let body = {
    border : 'gray solid 2px',
    borderRadius : '20px',
    position : 'relative',
    margin : 'auto',
    marginTop : '20px',
    background : 'lightgray',
    width : (Constants.GAME_WIDTH + 25) + 'px',
    height : (Constants.GAME_HEIGHT + 60) + 'px',
    padding : '20px'
};

const page = current => {
    switch (current) {
        case Constants.PAGE_LOGIN : return <Login socket={socket}/>;
        case Constants.PAGE_GAME : return <Game socket={socket}/>;
        case Constants.PAGE_LOBBY : return <Lobby socket={socket}/>;
        default : return <h1>ERROR</h1>;
    }
};

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            page : 'login'
        };
        socket.on('page', page => this.setState({page}));
    }

    render = () =>
        <div style={body}>
            {page(this.state.page)}
        </div>;

}