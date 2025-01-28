import { WebSocketServer } from 'ws';
import { GameManger } from "./GameManager";

const wss = new WebSocketServer({port : 8080});

const gameManager = new GameManger();
let ct = 0;
wss.on('connection', function connection(ws){
    ct++;
    console.log("Connection Number: ", ct);
    gameManager.addUser(ws);
    ws.on('disconnect', () => gameManager.removeUser(ws));
})