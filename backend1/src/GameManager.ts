import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

//User, Game
//Game Manager has a global array which is a list of all the games and details of individual game is Game

export class GameManger{
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    };

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    };

    /**
     * @param socket 
     */
    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            
            //When the user initially is looking for a opponent to play
            if(message.type === INIT_GAME) {
                console.log("Init called");
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser = null;  
                } else { 
                    this.pendingUser = socket;
                } 
            }

            //When the user who is already playing a game is making a move
            if(message.type === MOVE) {
                console.log("Move called");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game) {
                    console.log("Make Move is called");
                    game.makeMove(socket, message.payload.move);
                }
            }
        }
            )
    }

}