"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManger = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
//User, Game
//Game Manager has a global array which is a list of all the games and details of individual game is Game
class GameManger {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    ;
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    ;
    /**
     * @param socket
     */
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            //When the user initially is looking for a opponent to play
            if (message.type === messages_1.INIT_GAME) {
                console.log("Init called");
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            //When the user who is already playing a game is making a move
            if (message.type === messages_1.MOVE) {
                console.log("Move called");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("Make Move is called");
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManger = GameManger;
