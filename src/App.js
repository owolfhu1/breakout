import React, { Component } from 'react';
import './App.css';
import Game from './components/Game.js';
import socketIOClient from 'socket.io-client';
import Login from "./components/Login";
import Lobby from "./components/Lobby";

const socket = socketIOClient('http://localhost:4000');

const page = current => {
    switch (current) {
        case 'login' : return <Login socket={socket}/>;
        case 'game' : return <Game socket={socket}/>;
        case 'lobby' : return <Lobby socket={socket}/>;
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

    render = () => page(this.state.page);

}