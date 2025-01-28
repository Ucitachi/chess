"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        //socket object of both the players
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
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
    makeMove(socket, move) {
        this.moveCount++;
        console.log("One move done", this.moveCount);
        // validate the type of move using zod
        if (this.moveCount % 2 === 1 && socket != this.player1) {
            console.log("Early Return");
            return;
        }
        if (this.moveCount % 2 === 0 && socket != this.player2) {
            console.log("Early Return1");
            return;
        }
        try {
            console.log("Move made");
            this.board.move(move);
            console.log("Move Count", this.moveCount);
        }
        catch (e) {
            return;
        }
        // Update the board
        // Push the move
        // Check if the game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        console.log("Sent");
        if (this.moveCount % 2 === 1) {
            console.log("play2 received");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            console.log("play1 received");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        // send the updated board to both players
        // this.moveCount++;
    }
}
exports.Game = Game;
