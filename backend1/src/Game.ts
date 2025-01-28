import { WebSocket } from "ws";
import {Chess} from "chess.js";
import { GAME_OVER, INIT_GAME,MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    public startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        //socket object of both the players
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    /**
     * 
     * @param socket 
     * @param move 
     * @returns 
     */
    makeMove(socket: WebSocket, move: {
        from: string; 
        to: string; 
    }) {
        // validate the type of move using zod
        if (this.moveCount % 2 === 1 && socket != this.player2) {
            console.log("Early Return");
            return;
        }
        if (this.moveCount % 2 === 0 && socket != this.player1) {
            console.log("Early Return1");
            return;
        }
        this.moveCount++;
        console.log("One move done",this.moveCount)

        try {
            console.log("Move made");
            this.board.move(move);
            console.log("Move Count",this.moveCount);
        } catch(e) {
            return;
        }
        // Update the board
        // Push the move

        // Check if the game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return;
        }
        
        console.log("Sent");
        if (this.moveCount % 2 === 1) {
            console.log("play2 received");
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            console.log("play1 received");
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        // send the updated board to both players
        // this.moveCount++;
    }
}   